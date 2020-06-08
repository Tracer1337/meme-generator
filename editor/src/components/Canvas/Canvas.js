import React, { useContext, useEffect, useState, useRef } from "react"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import html2canvas from "html2canvas"

import Textbox from "./Textbox.js"
import Grid from "./Grid.js"
import BorderDialog from "../Dialogs/BorderDialog.js"
import ImageDialog from "../Dialogs/ImageDialog.js"
import GridDialog from "../Dialogs/GridDialog.js"

import { AppContext } from "../../App.js"

import importFile, { fileToImage } from "../../utils/importFile.js"

const showCanvas = (canvas) => {
    const newWindow = window.open("", "canvas")
    newWindow.document.body.appendChild(canvas)
}

const defaultBorderValues = {
    size: 0,
    top: true,
    bottom: true,
    left: false,
    right: false,
    color: "white"
}

const defaultGridValues = {
    enabled: false,
    spacing: 16,
    color: "black"
}

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        outline: `${theme.spacing(1)}px solid ${theme.palette.background.default}`,
        margin: theme.spacing(1),
        marginBottom: theme.mixins.toolbar.minHeight + theme.spacing(1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },

    canvas: {
        position: "relative",
        display: "flex"
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const idCounter = useRef(0)

    const image = useRef()
    const canvas = useRef()
    const container = useRef()
    const textboxes = useRef({})
    const textboxTemplates = useRef({})
    const generatedImageData = useRef({})
    const currentTemplate = useRef()

    let [keys, setKeys] = useState([])
    const [borderValues, setBorderValues] = useState(defaultBorderValues)
    const [gridValues, setGridValues] = useState(defaultGridValues)
    const [isBorderDialogOpen, setIsBorderDialogOpen] = useState(false)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [isGridDialogOpen, setIsGridDialogOpen] = useState(false)

    textboxes.current = {}
    for(let key of keys) {
        textboxes.current[key] = {}
    }

    const handleRemoveTextbox = (removeKey) => {
        const newKeys = keys.filter(key => key !== removeKey)
        setKeys(newKeys)

        delete textboxes.current[removeKey]
        delete textboxTemplates.current[removeKey]
    }

    const handleAddTextbox = ({ template }) => {
        const newKey = idCounter.current++
        
        if(template) {
            textboxTemplates.current[newKey] = template
        }

        setKeys([...keys, newKey])

        return newKey
    }

    const beforeCapturing = async container => {
        Object.values(textboxes.current).forEach(textbox => textbox.beforeCapturing())

        // Wait until the dom changes have applied
        await new Promise(requestAnimationFrame)
    }

    const afterCapturing = container => {
        Object.values(textboxes.current).forEach(textbox => textbox.afterCapturing())
    }

    const handleImportImage = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)
        currentTemplate.current = null
        context.setImage(base64Image)
    }

    const handleGenerateImage = async () => {
        const container = document.querySelector(`.${classes.canvas}`)

        await beforeCapturing(container)

        const canvas = await html2canvas(container)

        generatedImageData.current = canvas.toDataURL()
        
        afterCapturing(container)

        setIsImageDialogOpen(true)
    }

    const handleSetBorder = () => {
        setIsBorderDialogOpen(true)
    }

    const handleSetGrid = () => {
        setIsGridDialogOpen(true)
    }

    const handleBorderDialogClose = (values) => {
        setBorderValues(values)
        setIsBorderDialogOpen(false)
    }

    const handleGridDialogClose = (values) => {
        setGridValues(values)
        setIsGridDialogOpen(false)
    }

    const handleLoadTemplate = async ({ detail: { template } }) => {
        currentTemplate.current = template
        
        // Check if value is given as percentage string and convert it if true
        const formatPercentage = (object, selector, useWidth = false) => {
            if(/\d+%/.test(object[selector])) {
                const percentage = parseFloat(object[selector])
                object[selector] = (useWidth ? image.current.clientWidth : image.current.clientHeight) * (percentage / 100)
            }
        }

        // Delete all textboxes
        keys.forEach(key => handleRemoveTextbox(key))
        keys = []

        // Set image
        context.setImage(template.image)

        // Wait until image is loaded into DOM
        await new Promise(requestAnimationFrame)

        // Format border size
        if (typeof template.border?.size === "string") {
            formatPercentage(template.border, "size")
        }

        // Set border
        setBorderValues(template.border || defaultBorderValues)

        // Handle textboxes
        if(template.textboxes) {
            for(let textbox of template.textboxes){
                // Format values
                formatPercentage(textbox, "width", true)
                formatPercentage(textbox, "height")
                formatPercentage(textbox, "x", true)
                formatPercentage(textbox, "y")

                // Add textbox
                const newKey = handleAddTextbox({ template: textbox })
                keys.push(newKey)
            }
        }

        // Set new keys
        setKeys(keys)
    }

    const handleStringifyTextboxes = (currentTemplates) => {
        const formatted = Object.values(textboxes.current).map(textbox => textbox.toObject({ image: image.current }))

        // Insert textboxes into corresponding template
        if(currentTemplates) {
            currentTemplates = JSON.parse(currentTemplates)
            const selected = currentTemplates.find(t => t.label === currentTemplate.current.label)
            if(selected) {
                selected.textboxes = formatted
            }
            return JSON.stringify(currentTemplates)
        }

        return JSON.stringify(formatted)
    }

    // Set event listeners
    useEffect(() => {
        context.event.addEventListener("importImage", handleImportImage)
        context.event.addEventListener("addTextField", handleAddTextbox)
        context.event.addEventListener("generateImage", handleGenerateImage)
        context.event.addEventListener("setBorder", handleSetBorder)
        context.event.addEventListener("setGrid", handleSetGrid)
        context.event.addEventListener("loadTemplate", handleLoadTemplate)

        window.stringifyTextboxes = handleStringifyTextboxes
        
        return () => {
            context.event.removeEventListener("importImage", handleImportImage)
            context.event.removeEventListener("addTextField", handleAddTextbox)
            context.event.removeEventListener("generateImage", handleGenerateImage)
            context.event.removeEventListener("setBorder", handleSetBorder)
            context.event.removeEventListener("setGrid", handleSetGrid)
            context.event.removeEventListener("loadTemplate", handleLoadTemplate)
        }
    })

    // Set image dimensions
    useEffect(() => {
        if (!image.current || !container.current || !canvas.current) {
            return
        }

        // Get image dimensions
        const imgWidth = image.current.naturalWidth
        const imgHeight = image.current.naturalHeight
        const imgRatio = imgHeight / imgWidth

        // Get container size
        const maxWidth = container.current.offsetWidth
        const maxHeight = container.current.offsetHeight

        let newWidth, newHeight

        if(maxWidth * imgRatio > maxHeight) {
            // Height is larger than max height => Constrain height
            newHeight = maxHeight + "px"
            newWidth = maxHeight * (1 / imgRatio) + "px"
        } else {
            // Width is larger than max width => Constrain width
            newWidth = maxWidth + "px"
            newHeight = maxWidth * imgRatio + "px"
        }

        // Apply sizing to image
        image.current.style.width = newWidth
        image.current.style.height = newHeight

        // Apply sizing to canvas
        canvas.current.style.width = newWidth
        canvas.current.style.height = newHeight
    }, [context.image, image, container, canvas])
    
    return (
        <div className={classes.canvasWrapper} ref={container}>
            <div 
                className={classes.canvas} 
                style={{
                    paddingTop: borderValues.top && borderValues.size + "px",
                    paddingBottom: borderValues.bottom && borderValues.size + "px",
                    paddingLeft: borderValues.left && borderValues.size + "px",
                    paddingRight: borderValues.right && borderValues.size + "px",
                    backgroundColor: context.image && borderValues.color,
                    width: !context.image && "unset"
                }}
                ref={canvas}
            >
                {context.image ? (
                    <img alt="" src={context.image} className={classes.image} ref={image}/>
                ) : (
                    <IconButton onClick={handleImportImage}>
                        <PhotoLibraryIcon fontSize="large" />
                    </IconButton>
                )}

                {keys.map(key => (
                    <Textbox
                        key={key}
                        id={key}
                        onRemove={handleRemoveTextbox}
                        handle={textboxes.current[key]}
                        grid={gridValues}
                        template={textboxTemplates.current[key]}
                    />
                ))}
            </div>

            <Grid config={gridValues} canvas={canvas.current} image={context.image} border={borderValues}/>

            <BorderDialog open={isBorderDialogOpen} onClose={handleBorderDialogClose} values={borderValues}/>
            <GridDialog open={isGridDialogOpen} onClose={handleGridDialogClose} values={gridValues}/>
            <ImageDialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)} imageData={generatedImageData.current}/>
        </div>
    )
}

export default Canvas
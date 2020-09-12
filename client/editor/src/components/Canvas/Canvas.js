import React, { useContext, useEffect, useState, useRef } from "react"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"

import Textbox from "./Elements/Textbox.js"
import Sticker from "./Elements/Sticker.js"
import Rectangle from "./Elements/Rectangle.js"
import Grid from "./Grid.js"
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas.js"
import BorderDialog from "../Dialogs/BorderDialog.js"
import ImageDialog from "../Dialogs/ImageDialog.js"
import GridDialog from "../Dialogs/GridDialog.js"

import { AppContext } from "../../App.js"

import { fileToImage, importFile, createListeners } from "../../utils"
import generateImage from "../../utils/generateImage.js"

// function showCanvas (canvas) {
//     const newWindow = window.open("", "canvas")
//     newWindow.document.body.appendChild(canvas)
// }

function getDimensionsWithoutPadding(element) {
    const styles = getComputedStyle(element)

    return {
        width: element.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight),
        height: element.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom)
    }
}

async function waitFrames(amount = 1) {
    for(let i = 0; i < amount; i++) {
        await new Promise(requestAnimationFrame)
    }
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
    fixedSpacing: false,
    color: "black",
    spacing: undefined,
    columns: 16,
    rows: 16
}

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        paddingBottom: theme.mixins.toolbar.minHeight + theme.spacing(1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },

    canvas: {
        position: "relative",
        display: "flex"
    },

    elements: {
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%"
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const idCounter = useRef(0)

    const image = useRef()
    const canvas = useRef()
    const container = useRef()
    const elementRefs = useRef({})

    let [elements, setElements] = useState([])
    const [borderValues, setBorderValues] = useState(defaultBorderValues)
    const [gridValues, setGridValues] = useState(defaultGridValues)
    const [isBorderDialogOpen, setIsBorderDialogOpen] = useState(false)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [isGridDialogOpen, setIsGridDialogOpen] = useState(false)
    const [generatedImage, setGeneratedImage] = useState(null)

    elementRefs.current = {}
    for (let element of elements) {
        elementRefs.current[element.key] = {}
    }

    const handleBorderDialogClose = (values) => {
        if(values) {
            setBorderValues(values)
        }
        setIsBorderDialogOpen(false)
    }

    const handleGridDialogClose = (values) => {
        if(values) {
            setGridValues(values)
        }
        setIsGridDialogOpen(false)
    }

    const handleImageDialogClose = async () => {
        setIsImageDialogOpen(false)
        // Wait until dialog is closed
        await waitFrames(3)
        setGeneratedImage(null)
    }

    const handleRemoveElement = (elementKey) => {
        const newElements = elements.filter(({ key }) => key !== elementKey)
        setElements(newElements)

        delete elementRefs.current[elementKey]
    }

    const handleTemporaryRemoveElement = (elementKey) => {
        const element = elements.find(({ key }) => key === elementKey)
        element.data.isRemoved = true
        setElements([...elements])
    }

    const handleUndoRemoveElement = (elementKey) => {
        const element = elements.find(({ key }) => key === elementKey)
        element.data.isRemoved = false
        setElements([...elements])
    }

    const handleCloneElement = (elementKey) => {
        const element = elements.find(({ key }) => key === elementKey)

        const newElement = createNewElement(element.type, {
            defaultValues: elementRefs.current[element.key].getValues()
        })

        setElements([...elements, newElement])
    }

    const clearElements = () => {
        setElements([])
        elementRefs.current = {}
    }

    const createNewElement = (type, data = {}) => {
        const newElementKey = {
            type,
            data,
            key: idCounter.current++
        }

        return newElementKey
    }

    const handleAddTextbox = ({ data }) => {
        const newElementKey = createNewElement("textbox", data)

        setElements([...elements, newElementKey])

        return newElementKey
    }

    const handleAddRectangle = () => {
        const newElementKey = createNewElement("rectangle")

        setElements([...elements, newElementKey])

        return newElementKey
    }

    const handleToggleDrawing = () => {
        context.set({
            drawing: {
                ...context.drawing,
                enabled: !context.drawing.enabled
            }
        })
    }

    const addSticker = (src, id) => {
        const newElementKey = createNewElement("sticker", { src, id })
        setElements([...elements, newElementKey])
    }

    const handleImportSticker = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)
        addSticker(base64Image)
    }

    const beforeCapturing = async container => {
        Object.values(elementRefs.current).forEach(textbox => textbox.beforeCapturing())
        
        // Wait until the dom changes have applied
        await waitFrames(3)
    }

    const afterCapturing = container => {
        Object.values(elementRefs.current).forEach(textbox => textbox.afterCapturing())
    }

    const handleImportImage = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)

        clearElements()
        context.set({
            currentTemplate: null,
            image: base64Image
        })
    }

    const handleGenerateImage = async () => {
        setIsImageDialogOpen(true)

        // Wait until component got rendered and the textbox handles got applied
        await waitFrames(1)

        const container = document.querySelector(`.${classes.canvas}`)

        await beforeCapturing(container)

        const imageData = await generateImage(container)

        setGeneratedImage(imageData)
        
        afterCapturing(container)
    }

    const handleSetBorder = () => {
        setIsBorderDialogOpen(true)
    }

    const handleSetGrid = () => {
        setIsGridDialogOpen(true)
    }

    const handleLoadTemplate = async ({ detail: { template } }) => {
        context.set({
            currentTemplate: template,
            image: template.image_url,
            label: template.label
        })

        // Wait until image is loaded into DOM and resized
        await waitFrames(2)
        
        // Check if value is given as percentage string and convert it if true
        const formatPercentage = (object, selector, useWidth = false) => {
            if (/\d+%/.test(object[selector])) {
                const percentage = parseFloat(object[selector])
                object[selector] = (useWidth ? image.current.clientWidth : image.current.clientHeight) * (percentage / 100)
            }
        }

        // Delete all elements
        clearElements()
        elements = []

        // Stop if no metadata exists
        if (!template.meta_data) {
            return
        }

        const border = template.meta_data.border
        const textboxes = template.meta_data.textboxes

        // Format border size
        if (typeof border?.size === "string") {
            formatPercentage(border, "size")
        }

        // Set border
        setBorderValues(border || defaultBorderValues)

        // Handle textboxes
        if (textboxes) {
            for (let textbox of textboxes) {
                // Format values
                formatPercentage(textbox, "width", true)
                formatPercentage(textbox, "height")
                formatPercentage(textbox, "x", true)
                formatPercentage(textbox, "y")

                // Add textbox
                const newKey = handleAddTextbox({ data: {
                    defaultValues: textbox,
                    fromTemplate: true
                } })
                elements.push(newKey)
            }
        }

        // Set new keys
        setElements(elements)
    }

    const handleLoadSticker = ({ detail: { sticker } }) => {
        addSticker(sticker.image_url, sticker.id)
    }

    const handleGetTextboxes = () => {
        const textboxKeys = elements.filter(({ type }) => type === "textbox").map(({ key }) => key)
        const formatted = textboxKeys.map(key => elementRefs.current[key].toObject({ image: image.current }))

        return formatted
    }

    const handleGetBorder = () => {
        return borderValues
    }

    // Set event listeners
    useEffect(() => {
        window.getTextboxes = handleGetTextboxes
        window.getBorder = handleGetBorder

        const events = [
            ["importImage", handleImportImage],
            ["addTextbox", handleAddTextbox],
            ["addRectangle", handleAddRectangle],
            ["toggleDrawing", handleToggleDrawing],
            ["importSticker", handleImportSticker],
            ["generateImage", handleGenerateImage],
            ["setBorder", handleSetBorder],
            ["setGrid", handleSetGrid],
            ["loadTemplate", handleLoadTemplate],
            ["loadSticker", handleLoadSticker]
        ]

        const removeListeners = createListeners(context.event, events)

        return removeListeners
    })

    // Set image dimensions
    useEffect(() => {
        (async () => {
            // Wait until image is loaded
            await waitFrames(1)

            if (!image.current || !container.current || !canvas.current) {
                return
            }

            // Get image dimensions
            const imgWidth = image.current.naturalWidth
            const imgHeight = image.current.naturalHeight
            const imgRatio = imgHeight / imgWidth

            // Get container size
            const { width: maxWidth, height: maxHeight } = getDimensionsWithoutPadding(container.current)

            let newWidth, newHeight

            if (maxWidth * imgRatio > maxHeight) {
                // Height is larger than max height => Constrain height
                const margin = 32
                const borderSize = (borderValues.top || 0 + borderValues.bottom || 0) * borderValues.size
                newHeight = maxHeight - margin - borderSize
                newWidth = newHeight * (1 / imgRatio)
            } else {
                // Width is larger than max width => Constrain width
                const borderSize = (borderValues.left || 0 + borderValues.right || 0) * borderValues.size
                newWidth = maxWidth - borderSize
                newHeight = newWidth * imgRatio
            }

            newWidth = Math.floor(newWidth)
            newHeight = Math.floor(newHeight)

            // Apply sizing to image
            image.current.style.width = newWidth + "px"
            image.current.style.height = newHeight + "px"

            // Apply sizing to canvas
            canvas.current.style.width = newWidth + "px"
            canvas.current.style.height = newHeight + "px"
        })()
    }, [context.image, image, container, canvas, borderValues])

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
                    <img
                        alt=""
                        src={context.image}
                        className="meme-image"
                        ref={image}
                        draggable="false"
                    />
                ) : (
                    <>
                        <IconButton onClick={() => context.event.dispatchEvent(new CustomEvent("openTemplatesDialog"))}>
                            <CloudDownloadIcon fontSize="large" />
                        </IconButton>
                        
                        <IconButton onClick={handleImportImage}>
                            <PhotoLibraryIcon fontSize="large" />
                        </IconButton>
                    </>
                )}

                <div className={classes.elements}>
                    {elements.map(({ type, key, data }) => {
                        const props = {
                            key,
                            id: key,
                            data,
                            onRemove: handleRemoveElement,
                            onTemporaryRemove: handleTemporaryRemoveElement,
                            onUndoRemove: handleUndoRemoveElement,
                            onClone: handleCloneElement,
                            handle: elementRefs.current[key],
                            grid: gridValues,
                            canvas: canvas.current,
                        }

                        if (type === "textbox") {
                            return (
                                <Textbox {...props} />
                            )
                        } else if (type === "sticker") {
                            return (
                                <Sticker {...props} />
                            )
                        } else if (type === "rectangle") {
                            return (
                                <Rectangle {...props} />
                            )
                        }

                        throw new Error("Type " + type + " is not defined")
                    })}
                </div>

                <DrawingCanvas canvas={canvas.current} border={borderValues} />
            </div>

            <Grid config={gridValues} canvas={canvas.current} border={borderValues}/>

            <BorderDialog open={isBorderDialogOpen} onClose={handleBorderDialogClose} values={borderValues}/>
            <GridDialog open={isGridDialogOpen} onClose={handleGridDialogClose} values={gridValues}/>
            <ImageDialog open={isImageDialogOpen} onClose={handleImageDialogClose} imageData={generatedImage} elements={elements}/>
        </div>
    )
}

export default Canvas
import React, { useContext, useEffect, useState, useRef } from "react"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import html2canvas from "html2canvas"

import Textbox from "./Textbox.js"
import Grid from "./Grid.js"
import BorderDialog from "./Dialogs/BorderDialog.js"
import ImageDialog from "./Dialogs/ImageDialog.js"
import GridDialog from "./Dialogs/GridDialog.js"

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
    color: "white"
}

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        marginBottom: theme.mixins.toolbar.minHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },

    canvas: {
        width: `calc(100vw - ${theme.spacing(2)}px)`,
        position: "relative",
        display: "flex"
    },

    image: {
        width: "100%"
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const idCounter = useRef(0)

    const image = useRef()
    const canvas = useRef()
    const textboxes = useRef({})
    const generatedImageData = useRef({})

    const [keys, setKeys] = useState([])
    const [borderValues, setBorderValues] = useState(defaultBorderValues)
    const [gridValues, setGridValues] = useState(defaultGridValues)
    const [isBorderDialogOpen, setIsBorderDialogOpen] = useState(false)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [isGridDialogOpen, setIsGridDialogOpen] = useState(false)

    for(let key of keys) {
        textboxes.current = {}
        textboxes.current[key] = {}
    }

    const handleRemoveKey = removeKey => {
        const newKeys = keys.filter(key => key !== removeKey)
        setKeys(newKeys)
    }

    const handleAddTextField = () => {
        const newKey = idCounter.current++
        setKeys([...keys, newKey])
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

    useEffect(() => {
        context.event.addEventListener("importImage", handleImportImage)
        context.event.addEventListener("addTextField", handleAddTextField)
        context.event.addEventListener("generateImage", handleGenerateImage)
        context.event.addEventListener("setBorder", handleSetBorder)
        context.event.addEventListener("setGrid", handleSetGrid)
        
        return () => {
            context.event.removeEventListener("importImage", handleImportImage)
            context.event.removeEventListener("addTextField", handleAddTextField)
            context.event.removeEventListener("generateImage", handleGenerateImage)
            context.event.removeEventListener("setBorder", handleSetBorder)
            context.event.removeEventListener("setGrid", handleSetGrid)
        }
    })

    return (
        <div className={classes.canvasWrapper}>
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
                        onRemove={handleRemoveKey}
                        handle={textboxes.current[key]}
                        grid={gridValues}
                        canvas={canvas.current}
                    />
                ))}
            </div>

            <Grid config={gridValues} canvas={canvas.current} image={context.image}/>

            <BorderDialog open={isBorderDialogOpen} onClose={handleBorderDialogClose} values={borderValues}/>
            <GridDialog open={isGridDialogOpen} onClose={handleGridDialogClose} values={gridValues}/>
            <ImageDialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)} imageData={generatedImageData.current}/>
        </div>
    )
}

export default Canvas
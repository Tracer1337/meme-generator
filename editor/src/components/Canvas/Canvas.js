import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import html2canvas from "html2canvas"

import Textbox from "./Textbox.js"
import BorderDialog from "./BorderDialog.js"

import { AppContext } from "../../App.js"

import downloadImageSrc from "../../utils/downloadImageSrc.js"

const showCanvas = (canvas) => {
    const newWindow = window.open("", "canvas")
    newWindow.document.body.appendChild(canvas)
}

const imagePadding = 10

const defaultBorderValues = {
    size: 0,
    top: true,
    bottom: true,
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
        width: `calc(100vw - ${imagePadding * 2}px)`,
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
    const textboxes = useRef({})

    const [keys, setKeys] = useState([])
    const [borderValues, setBorderValues] = useState(defaultBorderValues)
    const [isBorderDialogOpen, setIsBorderDialogOpen] = useState(false)

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

    const handleGenerateImage = async () => {
        const container = document.querySelector(`.${classes.canvas}`)

        await beforeCapturing(container)

        const canvas = await html2canvas(container)

        showCanvas(canvas)
        
        afterCapturing(container)
        
        return

        downloadImageSrc(canvas.toDataURL())
    }

    const handleSetBorder = () => {
        setIsBorderDialogOpen(true)
    }

    const handleBorderDialogClose = (values) => {
        setBorderValues(values)
        setIsBorderDialogOpen(false)
    }

    useEffect(() => {
        context.event.addEventListener("addTextField", handleAddTextField)
        context.event.addEventListener("generateImage", handleGenerateImage)
        context.event.addEventListener("setBorder", handleSetBorder)

        return () => {
            context.event.removeEventListener("addTextField", handleAddTextField)
            context.event.removeEventListener("generateImage", handleGenerateImage)
            context.event.removeEventListener("setBorder", handleSetBorder)
        }
    })

    return (
        <div className={classes.canvasWrapper}>
            <div className={classes.canvas} style={{
                paddingTop: borderValues.top ? borderValues.size + "px" : null,
                paddingBottom: borderValues.bottom ? borderValues.size + "px" : null,
                backgroundColor: borderValues.color
            }}>
                {context.image && <img alt="" src={context.image} className={classes.image} ref={image}/>}

                {keys.map(key => (
                    <Textbox
                        key={key}
                        id={key}
                        onRemove={handleRemoveKey}
                        handle={textboxes.current[key]}
                    />
                ))}
            </div>

            <BorderDialog open={isBorderDialogOpen} onClose={handleBorderDialogClose} values={borderValues}/>
        </div>
    )
}

export default Canvas
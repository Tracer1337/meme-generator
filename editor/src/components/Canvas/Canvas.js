import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import html2canvas from "html2canvas"

import Textbox from "./Textbox.js"

import { AppContext } from "../../App.js"

import downloadImageSrc from "../../utils/downloadImageSrc.js"

const showCanvas = (canvas) => {
    const newWindow = window.open("", "canvas")
    newWindow.document.body.appendChild(canvas)
}

const imagePadding = 10

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
        position: "relative"
    },

    imageWrapper: {
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

    const [keys, setKeys] = useState([])
    const textboxes = useRef({})

    for(let key in keys) {
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
        const container = document.querySelector(`.${classes.imageWrapper}`)

        await beforeCapturing(container)

        const canvas = await html2canvas(container)

        showCanvas(canvas)
        
        return
        
        afterCapturing(container)

        downloadImageSrc(canvas.toDataURL())
    }

    useEffect(() => {
        context.event.addEventListener("addTextField", handleAddTextField)
        context.event.addEventListener("generateImage", handleGenerateImage)

        return () => {
            context.event.removeEventListener("addTextField", handleAddTextField)
            context.event.removeEventListener("generateImage", handleGenerateImage)
        }
    })

    return (
        <div className={classes.canvasWrapper}>
            <div className={classes.canvas}>
                <div className={classes.imageWrapper}>
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
            </div>
        </div>
    )
}

export default Canvas
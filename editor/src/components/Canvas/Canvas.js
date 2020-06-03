import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Textbox from "./Textbox.js"

import { AppContext } from "../../App.js"

import generateImage from "../../utils/generateImage.js"
import downloadImage from "../../utils/downloadImage.js"

const imagePadding = 10

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        marginBottom: theme.mixins.toolbar.minHeight,
        display: "flex",
        overflow: "hidden"
    },

    canvas: {
        flexGrow: 1,
        position: "relative"
    },

    image: {
        width: `calc(100vw - ${imagePadding * 2}px)`,
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)"
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const idCounter = useRef(0)

    const image = useRef()

    const [keys, setKeys] = useState([])

    const getTextboxes = () => {
        const textboxes = []

        const imageRect = image.current.getBoundingClientRect()

        for (let key in keys) {
            const textbox = document.getElementById(`textbox-${key}`)

            if (!textbox) {
                continue
            }

            const styles = getComputedStyle(textbox)

            const textboxRect = textbox.getBoundingClientRect()

            const textboxPosition = {
                x: textboxRect.x - imageRect.x,
                y: textboxRect.y - imageRect.y + parseInt(styles.fontSize)
            }

            const element = {
                content: textbox.value,
                position: textboxPosition,
                fontSize: styles.fontSize,
                color: styles.color
            }

            textboxes.push(element)
        }

        return textboxes
    }

    const handleRemoveKey = removeKey => {
        const newKeys = keys.filter(key => key !== removeKey)
        setKeys(newKeys)
    }

    const handleAddTextField = () => {
        const newKey = idCounter.current++
        setKeys([...keys, newKey])
    }

    const handleGenerateImage = async () => {
        const textboxes = getTextboxes()

        const newImage = await generateImage({
            imageElement: image.current,
            textboxes
        })

        downloadImage(newImage)
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
                {context.image && <img alt="" src={context.image} className={classes.image} ref={image}/>}

                {keys.map(key => (
                    <Textbox
                        key={key}
                        id={key}
                        onRemove={handleRemoveKey}
                    />
                ))}
            </div>
        </div>
    )
}

export default Canvas
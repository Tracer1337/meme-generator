import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Grid from "./Grid.js"
import DrawingCanvas from "./DrawingCanvas.js"
import Base from "./Base.js"
import Elements from "./Elements/Elements.js"

import { AppContext } from "../../App.js"
import { createListeners } from "../../utils"
import generateImage from "../../utils/generateImage.js"
import BaseElement from "../../Models/BaseElement.js"
import Element from "../../Models/Element.js"
import { BASE_ELEMENT_TYPES } from "../../config/constants.js"
import useBackButton from "../../utils/useBackButton.js"
import { defaultBorderValues } from "../../store/state.js"

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
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    useBackButton(!context.editor.isEmptyState, context.resetEditor)

    const baseRef = useRef()
    const elementsRef = useRef()
    const canvas = useRef()
    const container = useRef()

    const [gridValues, setGridValues] = useState(defaultGridValues)

    const handleGenerateImage = async () => {
        const dialogHandle = context.openDialog("Image")

        // Wait until component got rendered and the textbox handles got applied
        await waitFrames(1)

        const container = document.querySelector(`.${classes.canvas}`)

        await elementsRef.current.beforeCapturing()

        // Wait until the dom changes have applied
        await waitFrames(3)

        const imageData = await generateImage(container)

        dialogHandle.set({ imageData })
        
        elementsRef.current.afterCapturing()
    }

    const handleSetBorder = () => {
        const dialogHandle = context.openDialog("Border", { values: context.editor.model.border })

        dialogHandle.addEventListener("close", (values) => {
            if (values) {
                context.set({ editor: { model: { border: values } } })
            }
        })
    }

    const handleSetGrid = () => {
        const dialogHandle = context.openDialog("Grid", { values: gridValues })

        dialogHandle.addEventListener("close", (values) => {
            if (values) {
                setGridValues(values)
            }
        })
    }

    const handleResetCanvas = () => {
        context.set({ editor: { model: { border: defaultBorderValues } } })
        setGridValues(defaultGridValues)
    }

    const handleLoadTemplate = async ({ template }) => {
        const newContextValue = {
            editor: {
                currentTemplate: template,
                isEmptyState: false,
                model: {
                    rootElement: new BaseElement({
                        type: BASE_ELEMENT_TYPES["IMAGE"],
                        image: template.image_url,
                        label: template.label
                    }),
                    elements: []
                }
            }
        }

        context.set(newContextValue)

        // Wait until image is loaded into DOM and resized
        await waitFrames(1)
        await awaitImageLoad()
        await waitFrames(1)
        
        // Check if value is given as percentage string and convert it if true
        const formatPercentage = (object, selector, useWidth = false) => {
            if (/\d+%/.test(object[selector])) {
                const percentage = parseFloat(object[selector])
                object[selector] = (useWidth ? baseRef.current.clientWidth : baseRef.current.clientHeight) * (percentage / 100)
            }
        }

        const border = template.model.border
        const elements = template.model.elements

        // Format border size
        if (border?.size) {
            if (typeof border?.size === "string") {
                formatPercentage(border, "size")
            }

            border.size = Math.floor(border.size)
        }

        // Set border
        newContextValue.editor.model.border = border || defaultBorderValues

        // Handle elements
        if (elements) {
            for (let element of elements) {
                // Format values
                formatPercentage(element.data, "width", true)
                formatPercentage(element.data, "height")
                formatPercentage(element.data, "x", true)
                formatPercentage(element.data, "y")

                // Add element to context
                newContextValue.editor.model.elements.push(Element.fromTemplate({
                    ...element,
                    id: elementsRef.current.createId()
                }))
            }
        }

        context.set(newContextValue)
    }

    const awaitImageLoad = () => new Promise(resolve => {
        if (context.editor.model.rootElement?.type !== BASE_ELEMENT_TYPES["IMAGE"] || baseRef.current.complete) {
            resolve()
        }

        baseRef.current.addEventListener("load", resolve, { once: true })
    })

    // Set event listeners
    useEffect(() => {
        return createListeners(context, [
            ["resetCanvas", handleResetCanvas],
            ["setBorder", handleSetBorder],
            ["setGrid", handleSetGrid],
            ["loadTemplate", handleLoadTemplate],
            ["generateImage", handleGenerateImage]
        ])
    })

    useEffect(() => {
        // Detect ctrl + z
        const handleUndo = (event) => {
            if (event.ctrlKey && event.keyCode === 90) {
                context.dispatchEvent("undo")
            }
        }

        return createListeners(window, [
            ["keydown", handleUndo]
        ])
    })

    // Set base dimensions
    useEffect(() => {
        (async () => {
            if (!baseRef.current || !container.current || !canvas.current) {
                return
            }
            
            // Wait until image is loaded
            await awaitImageLoad()

            // Get base (image) ratio
            let ratio = 1
            if (context.editor.model.rootElement.type === BASE_ELEMENT_TYPES["IMAGE"]) {
                const imgWidth = baseRef.current.naturalWidth
                const imgHeight = baseRef.current.naturalHeight
                ratio = imgHeight / imgWidth
            }

            // Get container size
            const { width: maxWidth, height: maxHeight } = getDimensionsWithoutPadding(container.current)

            let newWidth, newHeight

            if (maxWidth * ratio > maxHeight) {
                // Height is larger than max height => Constrain height
                const margin = 32
                const borderSize = (context.editor.model.border.top || 0 + context.editor.model.border.bottom || 0) * context.editor.model.border.size
                newHeight = maxHeight - margin - borderSize
                newWidth = newHeight * (1 / ratio)
            } else {
                // Width is larger than max width => Constrain width
                const borderSize = (context.editor.model.border.left || 0 + context.editor.model.border.right || 0) * context.editor.model.border.size
                newWidth = maxWidth - borderSize
                newHeight = newWidth * ratio
            }

            newWidth = Math.floor(newWidth)
            newHeight = Math.floor(newHeight)

            // Apply sizing to base
            baseRef.current.style.width = newWidth + "px"
            baseRef.current.style.height = newHeight + "px"

            // Apply sizing to canvas
            canvas.current.style.width = newWidth + "px"
            canvas.current.style.height = newHeight + "px"
        })()

        // eslint-disable-next-line
    }, [context.editor.model.rootElement, baseRef, container, canvas, context.editor.model.border])

    return (
        <div className={classes.canvasWrapper} ref={container}>
            <div 
                className={classes.canvas} 
                style={{
                    paddingTop: context.editor.model.border.top && context.editor.model.border.size + "px",
                    paddingBottom: context.editor.model.border.bottom && context.editor.model.border.size + "px",
                    paddingLeft: context.editor.model.border.left && context.editor.model.border.size + "px",
                    paddingRight: context.editor.model.border.right && context.editor.model.border.size + "px",
                    backgroundColor: !context.editor.isEmptyState && context.editor.model.border.color,
                    width: context.editor.isEmptyState && "unset",
                    height: context.editor.isEmptyState && "unset"
                }}
                ref={canvas}
            >
                <Base ref={baseRef}/>

                <Elements ref={elementsRef} base={baseRef.current} grid={gridValues} canvas={canvas.current}/>

                <DrawingCanvas canvas={canvas.current} border={context.editor.model.border} />
            </div>

            <Grid config={gridValues} canvas={canvas.current} border={context.editor.model.border}/>
        </div>
    )
}

export default Canvas
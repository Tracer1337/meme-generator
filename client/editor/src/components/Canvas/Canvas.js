import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Grid from "./Grid.js"
import DrawingCanvas from "./DrawingCanvas.js"
import BorderDialog from "../Dialogs/BorderDialog.js"
import ImageDialog from "../Dialogs/ImageDialog.js"
import GridDialog from "../Dialogs/GridDialog.js"
import Base from "./BaseElements/BaseElements.js"
import Elements from "./Elements/Elements.js"

import { AppContext } from "../../App.js"
import { createListeners } from "../../utils"
import generateImage from "../../utils/generateImage.js"
import BaseElement from "../../Models/BaseElement.js"
import Element from "../../Models/Element.js"
import { BASE_ELEMENT_TYPES, ELEMENT_TYPES } from "../../config/constants.js"

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
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const baseRef = useRef()
    const elementsRef = useRef()
    const canvas = useRef()
    const container = useRef()

    const [borderValues, setBorderValues] = useState(defaultBorderValues)
    const [gridValues, setGridValues] = useState(defaultGridValues)
    const [isBorderDialogOpen, setIsBorderDialogOpen] = useState(false)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [isGridDialogOpen, setIsGridDialogOpen] = useState(false)
    const [generatedImage, setGeneratedImage] = useState(null)

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

    const handleGenerateImage = async () => {
        setIsImageDialogOpen(true)

        // Wait until component got rendered and the textbox handles got applied
        await waitFrames(1)

        const container = document.querySelector(`.${classes.canvas}`)

        await elementsRef.current.beforeCapturing()

        // Wait until the dom changes have applied
        await waitFrames(3)

        const imageData = await generateImage(container)

        setGeneratedImage(imageData)
        
        elementsRef.current.afterCapturing()
    }

    const handleSetBorder = () => {
        setIsBorderDialogOpen(true)
    }

    const handleSetGrid = () => {
        setIsGridDialogOpen(true)
    }

    const handleResetCanvas = () => {
        setBorderValues(defaultBorderValues)
        setGridValues(defaultGridValues)
    }

    const handleLoadTemplate = async ({ detail: { template } }) => {
        const newContextValue = {
            currentTemplate: template,
            isEmptyState: false,
            elements: [],
            rootElement: new BaseElement({
                type: BASE_ELEMENT_TYPES["IMAGE"],
                image: template.image_url,
                label: template.label
            })
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

        // Stop if no metadata exists
        if (!template.meta_data) {
            return
        }

        const border = template.meta_data.border
        const textboxes = template.meta_data.textboxes

        // Format border size
        if (border?.size) {
            if (typeof border?.size === "string") {
                formatPercentage(border, "size")
            }

            border.size = Math.floor(border.size)
        }

        // Set border
        setBorderValues(border || defaultBorderValues)

        // Handle textboxes
        const elements = []
        if (textboxes) {
            for (let textbox of textboxes) {
                // Format values
                formatPercentage(textbox, "width", true)
                formatPercentage(textbox, "height")
                formatPercentage(textbox, "x", true)
                formatPercentage(textbox, "y")

                // Add textbox
                elements.push(new Element({
                    type: ELEMENT_TYPES["TEXTBOX"],
                    data: {
                        defaultValues: textbox,
                        fromTemplate: true
                    },
                    id: elementsRef.current.createId()
                }))
            }
        }

        newContextValue.elements = elements
        context.set(newContextValue)
    }

    const handleGetBorder = () => {
        return borderValues
    }

    const awaitImageLoad = () => new Promise(resolve => {
        if (context.rootElement?.type !== BASE_ELEMENT_TYPES["IMAGE"] || baseRef.current.complete) {
            resolve()
        }

        baseRef.current.addEventListener("load", resolve, { once: true })
    })

    // Set event listeners
    useEffect(() => {
        window.getBorder = handleGetBorder

        const events = [
            ["resetCanvas", handleResetCanvas],
            ["setBorder", handleSetBorder],
            ["setGrid", handleSetGrid],
            ["loadTemplate", handleLoadTemplate],
            ["generateImage", handleGenerateImage]
        ]

        const removeListeners = createListeners(context.event, events)

        return removeListeners
    })

    // Set base dimensions
    useEffect(() => {
        (async () => {
            if (!baseRef.current?.getRatio || !container.current || !canvas.current) {
                return
            }
            
            // Wait until image is loaded
            await awaitImageLoad()

            // Get base (image) ratio
            const ratio = baseRef.current.getRatio()

            // Get container size
            const { width: maxWidth, height: maxHeight } = getDimensionsWithoutPadding(container.current)

            let newWidth, newHeight

            if (maxWidth * ratio > maxHeight) {
                // Height is larger than max height => Constrain height
                const margin = 32
                const borderSize = (borderValues.top || 0 + borderValues.bottom || 0) * borderValues.size
                newHeight = maxHeight - margin - borderSize
                newWidth = newHeight * (1 / ratio)
            } else {
                // Width is larger than max width => Constrain width
                const borderSize = (borderValues.left || 0 + borderValues.right || 0) * borderValues.size
                newWidth = maxWidth - borderSize
                newHeight = newWidth * ratio
            }

            const margin = 16

            newWidth = Math.floor(newWidth) - margin * 2
            newHeight = Math.floor(newHeight) - margin * 2

            // Apply sizing to base
            baseRef.current.getElement().style.width = newWidth + "px"
            baseRef.current.getElement().style.height = newHeight + "px"
            
            // Apply sizing to canvas
            canvas.current.style.width = newWidth + "px"
            canvas.current.style.height = newHeight + "px"
        })()

        // eslint-disable-next-line
    }, [context.rootElement, baseRef, container, canvas, borderValues])

    return (
        <div className={classes.canvasWrapper} ref={container}>
            <div 
                className={classes.canvas} 
                style={{
                    paddingTop: borderValues.top && borderValues.size + "px",
                    paddingBottom: borderValues.bottom && borderValues.size + "px",
                    paddingLeft: borderValues.left && borderValues.size + "px",
                    paddingRight: borderValues.right && borderValues.size + "px",
                    backgroundColor: !context.isEmptyState && borderValues.color,
                    width: context.isEmptyState && "unset"
                }}
                ref={canvas}
            >
                <Base ref={baseRef}/>

                <Elements ref={elementsRef} base={baseRef.current} grid={gridValues} canvas={canvas.current}/>

                <DrawingCanvas canvas={canvas.current} border={borderValues} />
            </div>

            <Grid config={gridValues} canvas={canvas.current} border={borderValues}/>

            <BorderDialog open={isBorderDialogOpen} onClose={handleBorderDialogClose} values={borderValues}/>
            <GridDialog open={isGridDialogOpen} onClose={handleGridDialogClose} values={gridValues}/>
            <ImageDialog open={isImageDialogOpen} onClose={handleImageDialogClose} imageData={generatedImage}/>
        </div>
    )
}

export default Canvas
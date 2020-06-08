import React, { useState, useRef, useMemo, useEffect } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"
import EditIcon from "@material-ui/icons/Edit"

import SettingsDialog from "../Dialogs/SettingsDialog.js"

import fitText from "../../utils/fitText.js"

const padding = 12
const placeholder = "Enter Text..."

const useStyles = makeStyles(theme => {
    const handle = {
        zIndex: 20,
        height: 24,
        position: "absolute",
        cursor: "pointer"
    }

    return {
        container: {
            position: "absolute",
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10
        },

        input: {
            background: "none",
            border: "none",
            outline: "1px dashed gray",
            fontSize: 24,
            color: "white",
            fontFamily: theme.typography.fontFamily,
            resize: "none",
            whiteSpace: "pre",
            zIndex: 10,
            padding,

            "&::placeholder": {
                color: "white"
            }
        },

        button: {
            padding: 0,
            marginLeft: theme.spacing(1),
            color: "black"
        },

        action: {
            position: "absolute",
            transform: "translateY(-100%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: 24
        },

        resizeHandles: {
            position: "absolute",
            height: "100%",
            width: "100%"
        },

        vertical: {
            ...handle,
            top: "100%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },

        horizontal: {
            ...handle,
            top: "50%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
        },

        diagonal: {
            ...handle,
            top: "100%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
        }
    }
})

let defaultSettings = {
    color: "black",
    textAlign: "left",
    fontFamily: "Roboto"
}

function Textbox({ id, onRemove, handle, grid, canvas, template }) {
    defaultSettings = { ...defaultSettings, ...template }

    const classes = useStyles()

    const lastRotation = useRef(0)
    const container = useRef()

    const [value, setValue] = useState(placeholder)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [height, setHeight] = useState(24)
    const [width, setWidth] = useState(160)
    const [capture, setCapture] = useState(false)

    // Keep track of width and height during resize in grid 
    const internalDimensions = useRef({ width, height })

    const handleChange = event => {
        setValue(event.target.value)
    }

    const getRotationAngle = (event, data) => {
        // Get textbox center position
        const textbox = document.getElementById(`textbox-${id}`).getBoundingClientRect()
        const textboxCenter = {
            x: textbox.x + textbox.width / 2,
            y: textbox.y + textbox.height / 2
        }

        // Calculate new rotation
        const textboxToMouse = Math.atan2(textboxCenter.y - data.y, textboxCenter.x - data.x)
        let newRotation = textboxToMouse - lastRotation.current

        // Snap to 45°
        if(grid.enabled) {
            newRotation -= newRotation % (Math.PI / 4)
        }

        return newRotation
    }

    const handleRotationStart = (event, data) => {
        lastRotation.current = getRotationAngle(event, data)
    }

    const handleRotationEnd = (event, data) => {
        lastRotation.current = getRotationAngle(event, data)
    }

    const handleRotationDrag = (event, data) => {
        setRotation(getRotationAngle(event, data))
    }

    const calcNewHeight = (data) => {
        // Calculate new delta-y with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
        const angle = -rotation
        const dy = data.deltaX * Math.sin(angle) + data.deltaY * Math.cos(angle)
        internalDimensions.current.height += dy

        // Snap to grid
        const boxHeight = Math.floor(internalDimensions.current.height) + padding * 2
        if(grid.enabled && boxHeight % grid.spacing !== 0) {
            return
        }

        setHeight(internalDimensions.current.height)
    }

    const calcNewWidth = (data) => {
        // Calculate new delta-x with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
        const angle = -rotation
        const dx = data.deltaX * Math.cos(angle) - data.deltaY * Math.sin(angle)
        internalDimensions.current.width += dx

        // Snap to grid
        const boxWidth = Math.floor(internalDimensions.current.width) + padding * 2
        if (grid.enabled && boxWidth % grid.spacing !== 0) {
            return
        }

        setWidth(internalDimensions.current.width)
    }

    const handleVerticalDrag = (event, data) => {
        calcNewHeight(data)
    }

    const handleHorizontalDrag = (event, data) => {
        calcNewWidth(data)
    }

    const handleDiagonalDrag = (event, data) => {
        calcNewWidth(data)
        calcNewHeight(data)
    }

    const handleMovementDrag = (event, data) => {
        setPosition({
            x: position.x + data.deltaX,
            y: position.y + data.deltaY
        })
    }

    const handleSettingsClicked = () => {
        setDialogOpen(true)
    }

    const handleSettingsApply = values => {
        setSettings(values)
        setDialogOpen(false)
    }

    const handleRemoveClicked = () => {
        onRemove(id)
    }

    const handleEditClicked = () => {
        const textbox = document.getElementById(`textbox-${id}`)
        textbox.focus()

        // Clear the placeholder
        if(value === placeholder) {
            setValue("")
        }
    }

    const beforeCapturing = () => {
        setCapture(true)
    }

    const afterCapturing = () => {
        setCapture(false)
    }

    // Expose methods for parent
    if(handle) {
        handle.beforeCapturing = beforeCapturing
        handle.afterCapturing = afterCapturing
    }

    // Generate stylings for textbox
    const styles = useMemo(() => ({
        width: width + "px",
        height: height + "px",
        fontSize: fitText({ width, height, styles: settings, text: value }),
        ...settings
    }), [value, settings, height, width])

    useEffect(() => {
        (async function() {
            // Wait until canvas has resized proberly
            await new Promise(requestAnimationFrame)

            // Apply template position
            if (template?.position) {
                if (template.position === "top") {
                    // Move to: center top
                    setPosition({
                        x: canvas.offsetWidth / 2 - container.current.offsetWidth / 2,
                        y: 0
                    })
                }
            }
        })()
    }, [])

    useEffect(() => {
        if(grid.enabled) {
            // Init position in grid
            setPosition({
                x: position.x - position.x % grid.spacing,
                y: position.y - position.y % grid.spacing
            })

            // Init height in grid
            const newHeight = height - (height + padding * 2) % grid.spacing
            internalDimensions.current.height = newHeight
            setHeight(newHeight)

            // Init width in grid
            const newWidth = width - (width + padding * 2) % grid.spacing
            internalDimensions.current.width = newWidth
            setWidth(newWidth)
        }
    }, [grid.enabled])

    return (
        <DraggableCore onDrag={handleMovementDrag} grid={grid.enabled ? [grid.spacing, grid.spacing] : null} handle={`#textbox-${id}`}>
            <div 
                className={classes.container}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`,
                    transformOrigin: `center center`
                }}
                ref={container}
            >
                {!capture ? (
                    // Render textarea for editing
                    <textarea
                        id={`textbox-${id}`}
                        type="text"
                        className={classes.input}
                        value={value}
                        onChange={handleChange}
                        style={styles}
                    />
                ) : (
                    // Render div for capturing
                    <div id={`textbox-${id}`} className={classes.input} style={styles}>
                        {value}
                    </div>
                )}

                <div className={classes.resizeHandles}>
                    <DraggableCore onDrag={handleVerticalDrag}>
                        <div className={classes.vertical}>
                            <HeightIcon/>
                        </div>
                    </DraggableCore>

                    <DraggableCore onDrag={handleHorizontalDrag}>
                        <div className={classes.horizontal}>
                            <HeightIcon/>
                        </div>
                    </DraggableCore>

                    <DraggableCore onDrag={handleDiagonalDrag}>
                        <div className={classes.diagonal}>
                            <HeightIcon/>
                        </div>
                    </DraggableCore>
                </div>
                
                <div className={classes.action}>
                    <DraggableCore onStart={handleRotationStart} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                        <RotateLeftIcon/>
                    </DraggableCore>

                    <IconButton className={classes.button} onClick={handleEditClicked}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton className={classes.button} onClick={handleSettingsClicked}>
                        <SettingsIcon/>
                    </IconButton>

                    <IconButton className={classes.button} onClick={handleRemoveClicked}>
                        <CloseIcon/>
                    </IconButton>
                </div>

                <SettingsDialog open={dialogOpen} onClose={handleSettingsApply} values={settings} text={value}/>
            </div>
        </DraggableCore>
    )
}

export default Textbox
import React, { useState, useRef, useMemo, useEffect } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"

import SettingsDialog from "../Dialogs/SettingsDialog.js"

import textWidth from "../../utils/textWidth.js"

const useStyles = makeStyles(theme => {
    const handle = {
        color: "white",
        cursor: "pointer",
        marginLeft: theme.spacing(2)
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

        handle,

        rotationHandle: {
            ...handle,
            marginLeft: 0
        },

        movementHandle: {
            ...handle,
            transform: "rotate(45deg)",
            fontSize: 28
        },

        input: {
            background: "none",
            border: "none",
            outline: "1px dashed white",
            fontSize: 24,
            color: "white",
            fontFamily: theme.typography.fontFamily,
            resize: "none",
            whiteSpace: "pre",

            "&::placeholder": {
                color: "white"
            }
        },

        button: {
            padding: 0,
            marginLeft: theme.spacing(2)
        },

        action: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)"
        }
    }
})

let defaultSettings = {
    fontSize: 24,
    color: "black",
    textAlign: "left",
    fontFamily: "Roboto"
}

function Textbox({ id, onRemove, handle, grid, canvas, template }) {
    defaultSettings = { ...defaultSettings, ...template }

    const classes = useStyles()

    const lastRotation = useRef(0)
    const movementHandle = useRef()
    const container = useRef()

    const [value, setValue] = useState("Enter Text...")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [height, setHeight] = useState(defaultSettings.fontSize)
    const [capture, setCapture] = useState(false)

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

    const handleMovementDrag = (event, data) => {
        let newX, newY

        if(grid.enabled) {
            const canvasRect = canvas.getBoundingClientRect()
            const movementHandleRect = movementHandle.current.getBoundingClientRect()
            const containerRect = container.current.getBoundingClientRect()
            const textareaRect = document.getElementById(`textbox-${id}`).getBoundingClientRect()

            // Movement-Handle position relative to container
            const offsetX = movementHandleRect.x - containerRect.x + movementHandleRect.width / 2
            const offsetY = movementHandleRect.y - containerRect.y + movementHandleRect.height / 2
            
            // Textbox position relative to canvas
            const relativeX = data.x - canvasRect.x - offsetX
            const relativeY = data.y - canvasRect.y - offsetY

            // Textarea position relative to textbox-container
            const textareaX = textareaRect.x - containerRect.x
            const textareaY = textareaRect.y - containerRect.y

            // New textbox position inside the grid
            newX = relativeX - (relativeX + textareaX) % grid.spacing
            newY = relativeY - (relativeY + textareaY) % grid.spacing
        } else {
            newX = position.x + data.deltaX
            newY = position.y + data.deltaY
        }

        setPosition({ x: newX, y: newY })
    }

    const handleHeightDrag = (event, data) => {
        // Calculate new delta-y with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
        const angle = -rotation
        const dy = data.deltaX * Math.sin(angle) + data.deltaY * Math.cos(angle)
        setHeight(height + dy)
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
        width: textWidth(value, settings) + "px",
        height: height + "px",
        ...settings
    }), [value, settings, height])

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

    return (
        <div 
            className={classes.container}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`,
                transformOrigin: `center ${height / 2} px`
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
            
            <div className={classes.action} style={{ background: capture && "none" }}>
                <DraggableCore onStart={handleRotationStart} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                    <RotateLeftIcon className={classes.rotationHandle} fontSize="large"/>
                </DraggableCore>

                <DraggableCore onDrag={handleMovementDrag}>
                    <ZoomOutMapIcon className={classes.movementHandle} ref={movementHandle}/>
                </DraggableCore>

                <DraggableCore onDrag={handleHeightDrag}>
                    <HeightIcon className={classes.handle} fontSize="large"/>
                </DraggableCore>

                <IconButton className={classes.button} onClick={handleSettingsClicked}>
                    <SettingsIcon fontSize="large"/>
                </IconButton>

                <IconButton className={classes.button} onClick={handleRemoveClicked}>
                    <CloseIcon fontSize="large"/>
                </IconButton>
            </div>

            <SettingsDialog open={dialogOpen} onClose={handleSettingsApply} values={settings} text={value}/>
        </div>
    )
}

export default Textbox
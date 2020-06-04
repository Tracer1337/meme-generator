import React, { useState, useRef } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"

import SettingsDialog from "./SettingsDialog.js"

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
            alignItems: "center"
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
            alignItems: "center"
        }
    }
})

const defaultSettings = {
    fontSize: 24,
    color: "white"
}

function Textbox({ id, onRemove, handle }) {
    const classes = useStyles()

    const lastRotation = useRef(0)

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
        const newRotation = textboxToMouse - lastRotation.current

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
        setPosition({ x: position.x + data.deltaX, y: position.y + data.deltaY })
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
    handle.beforeCapturing = beforeCapturing
    handle.afterCapturing = afterCapturing

    const styles = {
        width: textWidth({ text: value, fontSize: settings.fontSize }) + "px",
        height: height + "px",
        ...settings
    }

    return (
        <div className={classes.container} style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`
        }}>
            {!capture ? (
                // Render textarea for editing
                <textarea
                    id={`textbox-${id}`}
                    type="text"
                    className={`${classes.input} input`}
                    value={value}
                    onChange={handleChange}
                    style={styles}
                />
            ) : (
                // Render div for capturing
                <div className={classes.input} style={styles} >
                    {value}
                </div>
            )}
            
            <div className={classes.action}>
                <DraggableCore onStart={handleRotationStart} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                    <RotateLeftIcon className={classes.rotationHandle} fontSize="large"/>
                </DraggableCore>

                <DraggableCore onDrag={handleMovementDrag}>
                    <ZoomOutMapIcon className={classes.movementHandle}/>
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
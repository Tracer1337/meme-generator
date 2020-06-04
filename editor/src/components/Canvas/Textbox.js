import React, { useState, useRef } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"

import SettingsDialog from "./SettingsDialog.js"

import textWidth from "../../utils/textWidth.js"

const useStyles = makeStyles(theme => ({
    container: {
        position: "absolute",
        top: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    rotationHandle: {
        color: "white",
        cursor: "pointer"
    },

    movementHandle: {
        transform: "rotate(45deg)",
        color: "white",
        fontSize: 28,
        cursor: "pointer",
        marginLeft: theme.spacing(2)
    },

    input: {
        background: "none",
        border: "none",
        fontSize: 24,
        color: "white",

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
}))

const defaultSettings = {
    fontSize: 24,
    color: "white"
}

function Textbox({ id, onRemove }) {
    const classes = useStyles()

    const lastRotation = useRef()

    const [value, setValue] = useState("Enter Text...")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)

    const handleChange = event => {
        setValue(event.target.value)
    }

    const getRotationAngle = (event, data) => {
        // Get handle position
        const handle = event.target.getBoundingClientRect()
        const handleCenter = {
            x: handle.x + handle.width / 2,
            y: handle.y + handle.height / 2
        }

        // Get textbox position
        const textbox = document.getElementById(`textbox-${id}`).getBoundingClientRect()
        const textboxCenter = {
            x: textbox.x + textbox.width / 2,
            y: textbox.y + textbox.height / 2
        }

        // Calculate new rotation
        const textboxToMouse = Math.atan2(textboxCenter.y - data.y, textboxCenter.x - data.x)
        const newRotation = textboxToMouse - (lastRotation.current || 0)

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

    return (
        <div className={classes.container} style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`
        }}>
            <input
                id={`textbox-${id}`}
                type="text"
                className={`${classes.input} input`}
                value={value}
                onChange={handleChange}
                style={{
                    width: textWidth({ text: value, fontSize: settings.fontSize }) + "px",
                    ...settings
                }}
            />
            
            <div className={classes.action}>
                <DraggableCore onStart={handleRotationStart} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                    <RotateLeftIcon className={classes.rotationHandle} fontSize="large"/>
                </DraggableCore>

                <DraggableCore onDrag={handleMovementDrag}>
                    <ZoomOutMapIcon className={classes.movementHandle}/>
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
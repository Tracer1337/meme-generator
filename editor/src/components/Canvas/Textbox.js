import React, { useState } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"

import SettingsDialog from "./SettingsDialog.js"

import textWidth from "../../utils/textWidth.js"

const useStyles = makeStyles(theme => ({
    container: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    movementHandle: {
        transform: "rotate(45deg)",
        color: "white",
        fontSize: 28,
        cursor: "pointer"
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

    const [value, setValue] = useState("Enter Text...")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [pos, setPos] = useState({
        x: window.innerWidth / 2 - 100,
        y: (window.innerHeight - 56) / 2
    })

    const handleChange = event => {
        setValue(event.target.value)
    }

    const handleDrag = (event, data) => {
        setPos({ x: pos.x + data.deltaX, y: pos.y + data.deltaY })
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
        <div id={id} className={classes.container} style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`
        }}>
            <input
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
                <DraggableCore
                    onDrag={handleDrag}
                >
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
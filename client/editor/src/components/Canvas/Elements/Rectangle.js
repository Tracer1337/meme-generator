import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"

import RectangleSettingsDialog from "../../Dialogs/RectangleSettingsDialog.js"
import settingsOptions from "../../../config/settings-options.json"

import makeElement from "./makeElement.js"

const defaultSettings = {
    backgroundColor: "transparent",
    borderColor: settingsOptions.colors["Red"],
    borderWidth: 5,
    circle: false
}

const useStyles = makeStyles(theme => ({
    rectangle: props => ({
        zIndex: 1,
        cursor: "move",
        borderStyle: "solid",
        ...props.settings,
        borderWidth: parseInt(props.settings.borderWidth),
        borderRadius: props.settings.circle && "50%"
    })
}))

function Rectangle({ id, onFocus, dimensions, handle }, forwardedRef) {
    const [settings, setSettings] = useState(defaultSettings)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    const classes = useStyles({ settings })

    const handleSettingsApply = (values) => {
        if (values) {
            setSettings(values)
        }
        setIsDialogOpen(false)
    }

    const styles = {
        width: dimensions.width + "px",
        height: dimensions.height + "px"
    }

    if (handle) {
        handle.onSettingsClicked = () => setIsDialogOpen(true)
    }

    return (
        <>
            <div
                id={`element-${id}`}
                ref={forwardedRef}
                style={styles}
                className={classes.rectangle}
                draggable="false"
                onMouseDown={onFocus}
                onTouchStart={onFocus}
            />

            <RectangleSettingsDialog open={isDialogOpen} onClose={handleSettingsApply} values={settings}/>
        </>
    )
}

export default makeElement({
    controls: ["resize", "rotate", "remove", "settings"],
    defaultValues: {
        width: 100,
        height: 75,
        zIndex: 2
    },
    Child: React.forwardRef(Rectangle)
})
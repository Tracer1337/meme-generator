import React, { useState, useRef, useMemo, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import SettingsDialog from "../../Dialogs/SettingsDialog.js"

import makeElement from "./makeElement.js"
import fitText from "../../../utils/fitText.js"

const placeholder = "Enter Text..."

const globalDefaultSettings = {
    color: "black",
    textAlign: "center",
    fontFamily: "'Impact', fantasy",
    backgroundColor: "transparent",
    verticalTextAlign: "center",
    bold: false,
    caps: true
}

const useStyles = makeStyles(theme => ({
    input: {
        background: "none",
        border: "none",
        outline: props => !props.capture && props.isFocused ? "1px dashed gray" : "none",
        fontSize: 24,
        color: "white",
        fontFamily: theme.typography.fontFamily,
        textTransform: props => props.settings.caps && "uppercase",
        resize: "none",
        whiteSpace: "pre",
        zIndex: 10,
        padding: props => props.padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: props => (
            props.settings.verticalTextAlign === "top" ? "flex-start" :
            props.settings.verticalTextAlign === "bottom" ? "flex-end" :
            props.settings.verticalTextAlign === "center" ? "center" :
            null
        )
    }
}))

function Textbox({ id, handle, template, onFocus, isFocused, toggleMovement, dimensions, padding }, forwardedRef) {
    const defaultSettings = {...globalDefaultSettings}

    // Apply template settings
    if(template?.settings) {
        for(let key in defaultSettings) {
            if(template.settings[key]) {
                defaultSettings[key] = template.settings[key]
            }
        }
    }

    const textboxRef = useRef()

    const [value, setValue] = useState(placeholder)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)

    const classes = useStyles({ settings, isFocused, padding })

    const handleSettingsClicked = () => {
        setDialogOpen(true)
    }

    const handleSettingsApply = values => {
        if(values) {
            setSettings(values)
        }
        setDialogOpen(false)
    }
    
    const handleEditClicked = () => {
        const handleFocusOut = () => {
            toggleMovement(true)
            textboxRef.current.removeEventListener("focusout", handleFocusOut)
        }
        toggleMovement(false)
        textboxRef.current.addEventListener("focusout", handleFocusOut)

        textboxRef.current.focus()

        // Clear the placeholder
        if(value.toLowerCase() === placeholder.toLowerCase()) {
            textboxRef.current.textContent = ""
            setValue("")
        }
    }

    const handleValueChange = (event) => {
        const newValue = event.target.textContent
        setValue(newValue)
    }

    const toObject = ({ image }) => {
        const toPercentage = (value, useWidth = false) => value / (useWidth ? image.clientWidth : image.clientHeight) * 100 + "%"

        const changedSettings = {}
        for(let key in settings) {
            if(settings[key] !== defaultSettings[key]) {
                changedSettings[key] = settings[key]
            }
        }

        return {
            width: toPercentage(dimensions.width + padding * 2, true),
            height: toPercentage(dimensions.height + padding * 2),
            x: toPercentage(dimensions.x, true),
            y: toPercentage(dimensions.y),
            rotation: dimensions.rotation,
            settings: changedSettings
        }
    }

    // Expose methods for parent
    if(handle) {
        handle.toObject = toObject
        handle.onEditClicked = handleEditClicked
        handle.onSettingsClicked = handleSettingsClicked
    }

    // Generate stylings for textbox
    const styles = useMemo(() => ({
        ...settings,
        width: dimensions.width + "px",
        height: dimensions.height + "px",
        fontSize: fitText({ styles: settings, text: value, ...dimensions }),
        fontWeight: settings.bold ? "bold" : null
    }), [value, settings, dimensions.width, dimensions.height])

    useEffect(() => {
        // Set initial value
        textboxRef.current.textContent = value
    }, [])

    useEffect(() => {
        // Insert placeholder if textbox is empty
        if(!value && !isFocused) {
            setValue(placeholder)
            textboxRef.current.textContent = placeholder
        }
    }, [isFocused])

    return (
        <>
            <div
                contentEditable
                id={`element-${id}`}
                className={classes.input}
                style={styles}
                ref={ref => {
                    textboxRef.current = ref
                    forwardedRef.current = ref
                }}
                onClick={onFocus}
                onTouchStart={onFocus}
                onInput={handleValueChange}
            />

            <SettingsDialog open={dialogOpen} onClose={handleSettingsApply} values={settings} text={value}/>
        </>
    )
}

export default makeElement({
    controls: ["resize", "rotate", "edit", "settings", "remove"],
    defaultValues: {
        width: 160,
        height: 24,
        zIndex: 2
    },
    Child: React.forwardRef(Textbox)
})
import React, { useState, useRef, useMemo, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"

import TextboxSettingsDialog from "../../Dialogs/TextboxSettingsDialog.js"

import { AppContext } from "../../../App.js"
import makeElement from "./makeElement.js"
import fitText from "../../../utils/fitText.js"
import { TEXTBOX_PLACEHOLDER, MAX_SNAPSHOTS } from "../../../config/constants.js"

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

    const context = useContext(AppContext)

    const textboxRef = useRef()
    const snapshots = useRef([])
    const shouldEmitSnapshot = useRef(false)

    const [value, setValue] = useState(TEXTBOX_PLACEHOLDER)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)

    const classes = useStyles({ settings, isFocused, padding })

    const addSnapshot = () => {
        console.log("Add snapshot")
        // Create new snapshot
        const newSnapshot = { value, settings }
        snapshots.current.push(newSnapshot)

        // Apply size constraint
        if(snapshots.current.length > MAX_SNAPSHOTS) {
            snapshots.current.shift()
        }
    }

    const applySnapshot = (snapshot) => {
        setValue(snapshot.value)
        textboxRef.current.textContent = snapshot.value
        setSettings(snapshot.settings)
    }

    const handleUndo = () => {
        console.log("Undo")
        if(snapshots.current.length === 0) {
            // Set initial values
            setValue(TEXTBOX_PLACEHOLDER)
            setSettings(defaultSettings)
            return
        }

        // Apply snapshot
        const snapshot = snapshots.current.pop()
        applySnapshot(snapshot)
    }

    const emitAddSnapshot = () => {
        context.event.dispatchEvent(new CustomEvent("addSnapshot"))
    }

    const handleSettingsClicked = () => {
        setDialogOpen(true)
    }

    const handleSettingsApply = values => {
        if(values) {
            emitAddSnapshot()
            setSettings(values)
        }
        setDialogOpen(false)
    }
    
    const handleEditClicked = () => {
        const handleFocusOut = () => {
            toggleMovement(true)
            textboxRef.current.removeEventListener("focusout", handleFocusOut)
        }
        
        shouldEmitSnapshot.current = true
        toggleMovement(false)
        textboxRef.current.addEventListener("focusout", handleFocusOut)

        textboxRef.current.focus()

        // Clear the placeholder
        if(value.toLowerCase() === TEXTBOX_PLACEHOLDER.toLowerCase()) {
            textboxRef.current.textContent = ""
        }
    }

    const handleValueChange = (event) => {
        if(shouldEmitSnapshot.current) {
            shouldEmitSnapshot.current = false
            emitAddSnapshot()
        }

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
        context.event.addEventListener("addSnapshot", addSnapshot)
        context.event.addEventListener("undo", handleUndo)
        
        return () => {         
            context.event.removeEventListener("addSnapshot", addSnapshot)
            context.event.removeEventListener("undo", handleUndo)
        }
    })

    useEffect(() => {
        if(!isFocused && !value) {
            // Insert placeholder if textbox is empty
            setValue(TEXTBOX_PLACEHOLDER)
            textboxRef.current.textContent = TEXTBOX_PLACEHOLDER
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

            <TextboxSettingsDialog open={dialogOpen} onClose={handleSettingsApply} values={settings} text={value}/>
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
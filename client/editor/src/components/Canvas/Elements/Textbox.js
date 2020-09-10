import React, { useState, useRef, useMemo, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import TextboxSettingsDialog from "../../Dialogs/TextboxSettingsDialog.js"

import useSnapshots from "../../../utils/useSnapshots.js"
import makeElement from "./makeElement.js"
import fitText from "../../../utils/fitText.js"
import getTextboxStyles from "../../../utils/getTextboxStyles.js"
import { TEXTBOX_PLACEHOLDER, TEXTBOX_PADDING } from "../../../config/constants.js"

const globalDefaultSettings = {
    color: "white",
    textOutlineWidth: 2,
    textOutlineColor: "black",
    textAlign: "center",
    fontFamily: "'Impact', fantasy",
    backgroundColor: "transparent",
    verticalTextAlign: "center",
    bold: false,
    caps: true
}

const useStyles = makeStyles(theme => ({
    input: props => getTextboxStyles({ theme, props })
}))

function Textbox({ id, handle, template, onFocus, isFocused, toggleMovement, dimensions }, forwardedRef) {
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
    const shouldEmitSnapshot = useRef(false)

    const [value, setValue] = useState(TEXTBOX_PLACEHOLDER)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [isEditing, setIsEditing] = useState(false)

    const classes = useStyles({ settings, isFocused, isEditing }) 

    const addSnapshot = useSnapshots({
        createSnapshot: () => ({ value, settings }),

        applySnapshot: (snapshot) => {
            setValue(snapshot.value)
            textboxRef.current.textContent = snapshot.value
            setSettings(snapshot.settings)
        },

        onSnapshotsEmpty: () => {
            // Set initial values
            setValue(TEXTBOX_PLACEHOLDER)
            setSettings(defaultSettings)
        }
    })

    const handleSettingsClicked = () => {
        setDialogOpen(true)
    }

    const handleSettingsApply = values => {
        if(values) {
            addSnapshot()
            setSettings(values)
        }
        setDialogOpen(false)
    }
    
    const handleEditClicked = async () => {
        const handleFocusOut = () => {
            toggleMovement(true)
            setIsEditing(false)
            textboxRef.current.removeEventListener("focusout", handleFocusOut)
        }
        
        shouldEmitSnapshot.current = true
        toggleMovement(false)
        setIsEditing(true)
        textboxRef.current.addEventListener("focusout", handleFocusOut)

        // Wait until contenteditable is set
        await new Promise(requestAnimationFrame)

        textboxRef.current.focus()

        // Clear the placeholder
        if(value.toLowerCase() === TEXTBOX_PLACEHOLDER.toLowerCase()) {
            textboxRef.current.textContent = ""
        }
    }

    const handleValueChange = (event) => {
        if(shouldEmitSnapshot.current) {
            shouldEmitSnapshot.current = false
            addSnapshot()
        }

        const newValue = event.target.textContent
        setValue(newValue)
    }

    const toObject = ({ image }) => {
        const toPercentage = (value, useWidth = false) => value / (useWidth ? image.clientWidth : image.clientHeight) * 100 + "%"

        const changedSettings = template?.settings || {}
        for(let key in settings) {
            if(settings[key] !== defaultSettings[key]) {
                changedSettings[key] = settings[key]
            }
        }

        return {
            value,
            width: toPercentage(dimensions.width + TEXTBOX_PADDING * 2, true),
            height: toPercentage(dimensions.height + TEXTBOX_PADDING * 2),
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
        width: dimensions.width + "px",
        height: dimensions.height + "px",
        fontSize: fitText({ styles: settings, text: value, ...dimensions })
    }), [value, settings, dimensions])

    useEffect(() => {
        // Set initial value
        textboxRef.current.textContent = value

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(!isEditing && !value) {
            // Insert placeholder if textbox is empty
            setValue(TEXTBOX_PLACEHOLDER)
            textboxRef.current.textContent = TEXTBOX_PLACEHOLDER
        }

        // eslint-disable-next-line
    }, [isEditing])
    
    return (
        <>
            <div
                contentEditable={isEditing}
                id={`element-${id}`}
                className={`textbox ${classes.input}`}
                style={styles}
                ref={ref => {
                    textboxRef.current = ref
                    forwardedRef.current = ref
                }}
                onMouseDown={onFocus}
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
        zIndex: 3
    },
    Child: React.forwardRef(Textbox)
})
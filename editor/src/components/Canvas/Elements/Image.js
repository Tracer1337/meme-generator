import React, { useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"

import ImageSettingsDialog from "../../Dialogs/ImageSettingsDialog.js"

import makeElement from "./makeElement.js"

const defaultSettings = {
    keepAspectRatio: true
}

const useStyles = makeStyles(theme => ({
    image: {
        zIndex: 1
    }
}))

const Image = ({ src, id, onFocus, dimensions, handle }, forwardedRef) => {
    const classes = useStyles()

    const imageRef = useRef()

    const [settings, setSettings] = useState(defaultSettings)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleSettingsApply = (values) => {
        if(values) {
            setSettings(values)
        }
        setIsDialogOpen(false)
    }

    const styles = {
        width: dimensions.width + "px",
        height: dimensions.height + "px"
    }

    if(handle) {
        handle.onSettingsClicked = () => setIsDialogOpen(true)

        if(settings.keepAspectRatio) {
            Object.defineProperty(handle, "aspectRatio", { 
                get: function() {
                    return imageRef.current?.naturalHeight / imageRef.current?.naturalWidth
                },
                configurable: true
            })
        } else {
            delete handle.aspectRatio
        }
    }

    return (
        <>
            <img
                src={src}
                alt=""
                id={`element-${id}`}
                ref={ref => {
                    forwardedRef.current = ref
                    imageRef.current = ref
                }}
                onClick={onFocus}
                onTouchStart={onFocus}
                style={styles}
                className={classes.image}
            />

            <ImageSettingsDialog open={isDialogOpen} onClose={handleSettingsApply} values={settings} src={src}/>
        </>
    )
}

export default makeElement({
    controls: ["resize", "rotate", "remove", "settings"],
    defaultValues: {
        width: 100,
        zIndex: 1
    },
    Child: React.forwardRef(Image)
})
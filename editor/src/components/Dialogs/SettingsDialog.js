import React, { useEffect } from "react"
import { Dialog, Button, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormContext } from "react-hook-form"

import Select from "./components/Select.js"

import settingsOptions from "../../config/settings-options.json"

const useStyles = makeStyles(theme => ({
    form: {
        padding: theme.spacing(2),
        paddingTop: 0
    },

    text: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
        whiteSpace: "pre"
    },

    applyButton: {
        marginTop: theme.spacing(2)
    },

    input: {
        marginTop: theme.spacing(1)
    }
}))

function SettingsDialog({ onClose, open, values, text }) {
    const { getValues, handleSubmit, control, watch, reset } = useForm()

    const classes = useStyles()

    const handleClose = () => {
        onClose(getValues())
    }

    useEffect(() => {
        reset(values)
    }, [values, reset])

    return (
        <Dialog onClose={handleClose} open={open}>
            <div className={classes.text} style={watch()}>
                {text}
            </div>
            
            <FormContext {...{ control, watch }}>
                <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                    {/* Color */}
                    <Select
                        name="color"
                        label="Color"
                        options={settingsOptions.colors}
                        child={({ label, value }) => (
                            <span style={{ color: value }}>{label}</span>
                        )}
                    />

                    {/* Text Align */}
                    <Select
                        name="textAlign"
                        label="Text Align"
                        options={settingsOptions.textAlign}
                        child={({ label }) => label}
                    />

                    {/* Font Family */}
                    <Select
                        name="fontFamily"
                        label="Font Family"
                        options={settingsOptions.fontFamilies}
                        child={({ label, value }) => (
                            <span style={{ fontFamily: value }}>{label}</span>
                        )}
                    />

                    <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
                </form>
            </FormContext>
        </Dialog>
    )
}

export default SettingsDialog
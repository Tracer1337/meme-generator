import React, { useEffect } from "react"
import { Dialog, DialogTitle, Button, TextField, FormGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormContext } from "react-hook-form"

import Select from "./components/Select.js"
import Switch from "./components/Switch.js"

import settingsOptions from "../../config/settings-options.json"

const useStyles = makeStyles(theme => ({
    form: {
        padding: theme.spacing(2),
        paddingTop: 0
    },

    applyButton: {
        marginTop: theme.spacing(2)
    },

    input: {
        marginTop: theme.spacing(1)
    }
}))

function GridDialog({ onClose, open, values }) {
    const { register, getValues, handleSubmit, control, watch, reset, setValue } = useForm()

    const classes = useStyles()

    const handleClose = () => {
        const values = getValues()

        values.spacing = parseInt(values.spacing)

        onClose(values)
    }

    useEffect(() => {
        reset(values)
    }, [values, reset])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set Grid</DialogTitle>

            <FormContext {...{ control, watch, register, setValue }}>
                <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                    <FormGroup>
                        {/* Enabled */}
                        <Switch name="enabled" label="Enabled" className={classes.input}/>

                        {/* Spacing */}
                        <TextField
                            inputRef={register()}
                            className={classes.input}
                            fullWidth
                            type="number"
                            name="spacing"
                            label="Spacing (px)"
                        />

                        {/* Color */}
                        <Select
                            name="color"
                            label="Color"
                            options={settingsOptions.colors}
                            className={classes.input}
                            child={({ label, value }) => (
                                <span style={{ color: value }}>{label}</span>
                            )}
                        />

                        <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
                    </FormGroup>
                </form>
            </FormContext>
        </Dialog>
    )
}

export default GridDialog
import React, { useEffect } from "react"
import { Dialog, DialogTitle, Button, TextField, FormControlLabel, Switch, FormGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormContext } from "react-hook-form"

import Select from "./Select.js"

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

            <FormContext {...{ control, watch }}>
                <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                    <FormGroup>
                        {/* Enabled */}
                        <FormControlLabel
                            control={
                                <Switch
                                    name="enabled"
                                    inputRef={register()}
                                    onChange={(event, value) => setValue("enabled", value)}
                                    checked={watch("enabled")}
                                />
                            }
                            label="Enabled"
                            className={classes.input}
                        />

                        {/* Spacing */}
                        <TextField
                            inputRef={register()}
                            className={classes.input}
                            fullWidth
                            type="number"
                            name="spacing"
                            label="Spacing"
                        />

                        {/* Color */}
                        <Select
                            name="color"
                            label="Color"
                            options={settingsOptions.colors}
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
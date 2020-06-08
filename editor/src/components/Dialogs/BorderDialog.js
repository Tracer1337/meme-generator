import React, { useEffect } from "react"
import { Dialog, DialogTitle, Button, TextField, FormControlLabel, Switch, FormGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormContext } from "react-hook-form"

import Select from "./components/Select.js"

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

function BorderDialog({ onClose, open, values }) {
    const { register, getValues, handleSubmit, control, watch, reset, setValue } = useForm()

    const classes = useStyles()

    const handleClose = () => {
        const values = getValues()

        onClose(values)
    }

    useEffect(() => {
        reset(values)
    }, [values, reset])

    return (
        <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Set Border</DialogTitle>

                <FormContext {...{ control, watch }}>
                    <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                        <FormGroup>
                            {/* Size */}
                            <TextField
                                inputRef={register()}
                                className={classes.input}
                                fullWidth
                                type="number"
                                name="size"
                                label="Size (px)"
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

                            {/* Top */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="top"
                                        inputRef={register()}
                                        onChange={(event, value) => setValue("top", value)}
                                        checked={watch("top")}
                                    />
                                }
                                label="Top"
                                className={classes.input}
                            />
                                

                            {/* Bottom */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="bottom"
                                        inputRef={register()}
                                        onChange={(event, value) => setValue("bottom", value)}
                                        checked={watch("bottom")}
                                    />
                                }
                                label="Bottom"
                                className={classes.input}
                            />

                            {/* Left */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="left"
                                        inputRef={register()}
                                        onChange={(event, value) => setValue("left", value)}
                                        checked={watch("left")}
                                    />
                                }
                                label="Left"
                                className={classes.input}
                            />

                            {/* Right */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="right"
                                        inputRef={register()}
                                        onChange={(event, value) => setValue("right", value)}
                                        checked={watch("right")}
                                    />
                                }
                                label="Right"
                                className={classes.input}
                            />

                            <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
                        </FormGroup>
                    </form>
                </FormContext>
        </Dialog>
    )
}

export default BorderDialog
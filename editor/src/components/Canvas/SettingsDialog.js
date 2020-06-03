import React, { useEffect } from "react"
import { Dialog, DialogTitle, Button, TextField, MenuItem } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, Controller } from "react-hook-form"

import colors from "../../config/colors.json"

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

function SettingsDialog({ onClose, open, values, text }) {
    const { register, getValues, handleSubmit, control, watch, reset } = useForm()

    const classes = useStyles()

    const handleClose = () => {
        const values = getValues()
        
        values.fontSize = parseInt(values.fontSize)

        onClose(values)
    }

    useEffect(() => {
        reset(values)
    }, [values, reset])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                <span style={{
                    ...watch(),
                    fontSize: parseInt(watch("fontSize")),
                }}>
                    {text}
                </span>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                <TextField
                    inputRef={register()}
                    name="fontSize"
                    type="number"
                    label="Font Size"
                    fullWidth
                    className={classes.input}
                />

                <Controller
                    as={props => (
                        <TextField
                            select
                            label="Color"
                            fullWidth
                            className={classes.input}
                            value={watch("color")}
                            {...props}
                        >
                            {Object.entries(colors).map(([label, code]) => (
                                <MenuItem key={code} value={code}>
                                    <span style={{ color: code }}>{label}</span>
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    control={control}
                    name="color"
                />

                <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
            </form>
        </Dialog>
    )
}

export default SettingsDialog
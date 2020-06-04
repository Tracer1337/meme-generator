import React, { useEffect } from "react"
import { Dialog, DialogTitle, Button, TextField, MenuItem } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, Controller } from "react-hook-form"

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
            <div className={classes.text} style={{
                ...watch(),
                fontSize: parseInt(watch("fontSize") || 0)
            }}>
                {text}
            </div>

            <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                {/* Font Size */}
                <TextField
                    inputRef={register()}
                    name="fontSize"
                    type="number"
                    label="Font Size"
                    fullWidth
                    className={classes.input}
                />

                {/* Color */}
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
                            {Object.entries(settingsOptions.colors).map(([label, code]) => (
                                <MenuItem key={code} value={code}>
                                    <span style={{ color: code }}>{label}</span>
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    control={control}
                    name="color"
                />
                
                {/* Text Align */}
                <Controller
                    as={props => (
                        <TextField
                            select
                            label="Text Align"
                            fullWidth
                            className={classes.input}
                            value={watch("textAlign")}
                            {...props}
                        >
                            {Object.entries(settingsOptions.textAlign).map(([label, value]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    control={control}
                    name="textAlign"
                />

                {/* Font Family */}
                <Controller
                    as={props => (
                        <TextField
                            select
                            label="Font Family"
                            fullWidth
                            className={classes.input}
                            value={watch("fontFamily")}
                            {...props}
                        >
                            {Object.entries(settingsOptions.fontFamilies).map(([label, value]) => (
                                <MenuItem key={value} value={value}>
                                    <span style={{ fontFamily: value }}>{label}</span>
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    control={control}
                    name="fontFamily"
                />

                <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
            </form>
        </Dialog>
    )
}

export default SettingsDialog
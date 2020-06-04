import React from "react"
import { TextField, MenuItem } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Controller, useFormContext } from "react-hook-form"

const useStyles = makeStyles(theme => ({
    input: {
        marginTop: theme.spacing(1)
    }
}))

function Select({ name, label, options, child }) {
    const classes = useStyles()

    const { control, watch } = useFormContext()

    return (
        <Controller
            as={props => (
                <TextField
                    select
                    label={label}
                    fullWidth
                    className={classes.input}
                    value={watch(name)}
                    {...props}
                >
                    {Object.entries(options).map(([label, value]) => (
                        <MenuItem key={value} value={value}>
                            {React.createElement(child, { label, value })}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            control={control}
            name={name}
        />
    )
}

export default Select
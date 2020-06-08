import React from "react"
import { Switch, FormControlLabel } from "@material-ui/core"
import { useFormContext } from "react-hook-form"

function Select({ name, label, className }) {
    const { register, watch, setValue } = useFormContext()

    return (
        <FormControlLabel
            control={
                <Switch
                    name={name}
                    inputRef={register()}
                    onChange={(event, value) => setValue(name, value)}
                    checked={watch(name)}
                />
            }
            label={label}
            className={className}
        />
    )
}

export default Select
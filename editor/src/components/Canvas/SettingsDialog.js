import React from "react"
import { Dialog, DialogTitle, Button, TextField } from "@material-ui/core"
import { useForm, Controller } from "react-hook-form"

function SettingsDialog({ onClose, open, values }) {
    const { getValues, handleSubmit, control } = useForm()

    const handleClose = () => {
        onClose(getValues())
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Customize Text</DialogTitle>

            <form onSubmit={handleSubmit(handleClose)}>
                <Controller
                    as={TextField}
                    control={control}
                    name="fontSize"
                    defaultValue={values.fontSize}
                    type="number"
                />

                <Button>Apply</Button>
            </form>
        </Dialog>
    )
}

export default SettingsDialog
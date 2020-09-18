import React, { useEffect, useContext } from "react"
import { Dialog, DialogTitle, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormProvider } from "react-hook-form"

import Switch from "./components/Switch.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { AppContext } from "../../App.js"

const useStyles = makeStyles(theme => ({
    form: {
        padding: theme.spacing(2),
        paddingTop: 0
    },

    applyButton: {
        marginTop: theme.spacing(2)
    },

    input: {
        marginTop: theme.spacing(1),
        marginLeft: 0
    }
}))

function SettingsDialog({ onClose, open }) {
    const context = useContext(AppContext)

    const { getValues, handleSubmit, control, watch, reset, register, setValue } = useForm()

    const classes = useStyles({ settings: watch() })

    const handleClose = () => {
        context.set({
            settings: {
                ...context.settings,
                ...getValues()
            }
        })
        onClose()
    }

    useEffect(() => {
        reset(context.settings)
    }, [context.settings, reset])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Settings</DialogTitle>

            <FormProvider {...{ control, watch, register, setValue }}>
                <form onSubmit={handleSubmit(handleClose)} className={classes.form}>
                    {/* Experimental */}
                    <Switch name="isExperimental" label="Experimental" className={classes.input} />

                    <Button fullWidth className={classes.applyButton} type="submit">Apply</Button>
                </form>
            </FormProvider>
        </Dialog>
    )
}

export default withBackButtonSupport(SettingsDialog, "settings")
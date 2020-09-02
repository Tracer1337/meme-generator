import React, { useState, useContext } from "react"
import { Dialog, DialogTitle, Button, TextField, FormGroup, Snackbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useForm, FormProvider } from "react-hook-form"
import CloseIcon from "@material-ui/icons/Close"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { authorize } from "../../config/api.js"

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
    },

    snackbarClose: {
        color: theme.palette.primary.variant
    }
}))

function BorderDialog({ onClose, open }) {
    const context = useContext(AppContext)

    const { register, getValues, handleSubmit, control, watch, setValue } = useForm()

    const classes = useStyles()

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [isWrongPassword, setIsWrongPassword] = useState(false)

    const onSubmit = async () => {
        const password = getValues("password")

        const res = await authorize(password)

        if(res.data) {
            setIsWrongPassword(false)
            setIsSnackbarOpen(true)
            context.setPassword(password)
            onClose()
        } else {
            setIsWrongPassword(true)
        }
    }

    return (
        <>
            <Dialog onClose={onClose} open={open}>
                <DialogTitle>Login</DialogTitle>

                <FormProvider {...{ control, watch, register, setValue }}>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <FormGroup>
                            {/* Password */}
                            <TextField
                                error={isWrongPassword}
                                inputRef={register()}
                                className={classes.input}
                                fullWidth
                                type="password"
                                name="password"
                                label="Password"
                                helperText={isWrongPassword && "Wrong Password"}
                            />

                            <Button fullWidth className={classes.applyButton} type="submit">Login</Button>
                        </FormGroup>
                    </form>
                </FormProvider>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setIsSnackbarOpen(false)}
                message="Logged In"
                action={
                    <IconButton onClick={() => setIsSnackbarOpen(false)} className={classes.snackbarClose}>
                        <CloseIcon />
                    </IconButton>
                }
            />
        </>
    )
}

export default withBackButtonSupport(BorderDialog, "auth")
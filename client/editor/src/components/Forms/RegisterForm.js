import React, { useContext, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { AppContext } from "../../App.js"
import Input from "./components/Input.js"
import { register as apiRegister } from "../../config/api.js"

const useStyles = makeStyles(theme => ({
    submit: {
        marginTop: theme.spacing(2)
    }
}))

function RegisterForm({ onRegister }) {
    const context = useContext(AppContext)

    const formObject = useForm()
    const { handleSubmit, errors, setError } = formObject
    
    const classes = useStyles()

    const onSubmit = (values) => {
        if (values.password !== values.password_confirmation) {
            setError("password_confirmation", {
                message: "The passwords do not match"
            })
        }

        apiRegister(values)
            .then(res => {
                context.set({
                    auth: {
                        ...context.auth,
                        token: res.data.token,
                        user: res.data.user,
                        isLoggedIn: true
                    }
                })
                
                if (onRegister) {
                    onRegister()
                }
            })
            .catch(res => {
                const errors = res.response.data

                for (let name in errors) {
                    const { message, constraints } = errors[name]
                    const constructedMessage = message + (constraints ? ` (${constraints})` : "")

                    setError(name, {
                        message: constructedMessage
                    })
                }
            })
    }

    return (
        <FormProvider {...formObject}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <Input
                    name="username"
                    label="Username"
                />

                {/* Email */}
                <Input
                    name="email"
                    label="Email"
                />

                {/* Password */}
                <Input
                    type="password"
                    name="password"
                    label="Password"
                />

                {/* Password */}
                <Input
                    type="password"
                    name="password_confirmation"
                    label="Confirm Password"
                />

                <Button
                    type="submit"
                    fullWidth
                    className={classes.submit}
                >Submit</Button>
            </form>
        </FormProvider>
    )
}

export default RegisterForm
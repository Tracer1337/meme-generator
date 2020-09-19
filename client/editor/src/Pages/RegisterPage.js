import React from "react"
import { useHistory } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout/Layout.js"
import RegisterForm from "../components/Forms/RegisterForm.js"

const useStyles = makeStyles(theme => ({
    registerPage: {
        marginTop: theme.spacing(6),
        maxWidth: 300
    }
}))

function RegisterPage() {
    const history = useHistory()

    const classes = useStyles()

    const handleOnRegister = () => {
        history.push("/profile")
    }

    return (
        <Layout center>
            <div className={classes.registerPage}>
                <RegisterForm onRegister={handleOnRegister}/>
            </div>
        </Layout>
    )
}

export default RegisterPage
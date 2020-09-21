import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Router from "./Router/Router.js"
import Analytics from "./utils/Analytics.js"
import OfflineUseAlerts from "./utils/OfflineUseAlerts.js"
import { setTokenHeader } from "./config/api.js"
import settingsOptions from "./config/settings-options.json"
import { getProfile } from "./config/api.js"

const useStyles = makeStyles(theme => ({
    "@global": {
        body: {
            margin: 0
        },

        a: {
            color: theme.palette.text.primary,
            textDecoration: "none",
            fontFamily: theme.typography.fontFamily
        }
    }
}))

const AppContext = React.createContext()

function contextMiddleware(values) {
    if ("auth" in values) {
        if (values.auth.token) {
            localStorage.setItem("token", values.auth.token)
            setTokenHeader(values.auth.token)
        } else {
            localStorage.removeItem("token")
        }
    }
}

function App() {
    useStyles()
    
    const [context, setContext] = useState({
        password: localStorage.getItem("password"),
        event: new EventTarget(),

        auth: {
            user: null,
            isLoggedIn: false,
            token: localStorage.getItem("token")
        },

        isEmptyState: true,
        currentTemplate: null,
        focus: null,
        rootElement: null,
        elements: [],
        drawing: {
            enabled: false,
            color: settingsOptions.colors["Red"],
            lineWidth: settingsOptions.lineWidth[1]
        }
    })

    const setter = {
        set: values => {
            contextMiddleware(values)
            setContext({ ...context, ...values })
        },
        setPassword: password => {
            // Store password in localstorage
            if (!password) {
                localStorage.removeItem("password")
            } else {
                localStorage.setItem("password", password)
            }
            setContext({ ...context, password })
        }
    }

    useEffect(() => {
        if (context.auth.token) {
            setTokenHeader(context.auth.token)
            getProfile()
                .then(res => {
                    setter.set({
                        auth: {
                            ...context.auth,
                            user: res.data,
                            isLoggedIn: true
                        }
                    })
                })
        }
    }, [])

    window.context = context

    return (
        <AppContext.Provider value={{ ...context, ...setter }}>
            <Analytics />
            <OfflineUseAlerts />

            <Router/>
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Router from "./Router/Router.js"
import Analytics from "./utils/Analytics.js"
import OfflineUseAlerts from "./utils/OfflineUseAlerts.js"
import { setPasswordHeader } from "./config/api.js"
import settingsOptions from "./config/settings-options.json"

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

if (localStorage.getItem("password")) {
    setPasswordHeader(localStorage.getItem("password"))
}

function App() {
    useStyles()
    
    const [context, setContext] = useState({
        password: localStorage.getItem("password"),
        event: new EventTarget(),

        auth: {
            user: null,
            isLoggedIn: false,
            token: null
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
        set: values => setContext({ ...context, ...values }),
        setPassword: password => {
            // Store password in localstorage
            if (!password) {
                localStorage.removeItem("password")
            } else {
                localStorage.setItem("password", password)
            }
            setPasswordHeader(password)
            setContext({ ...context, password })
        }
    }

    useEffect(() => {
        // Detect ctrl + z
        const handleUndo = (event) => {
            if (event.ctrlKey && event.keyCode === 90) {
                context.event.dispatchEvent(new CustomEvent("undo"))
            }
        }

        window.addEventListener("keydown", handleUndo)

        return () => {
            window.removeEventListener("keydown", handleUndo)
        }
    })

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
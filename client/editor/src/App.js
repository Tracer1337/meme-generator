import React, { useState, useEffect, useReducer } from "react"
import { CircularProgress } from "@material-ui/core"
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
            margin: 0,
            backgroundColor: theme.palette.background.default
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

const contextDefaultValue = {
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
}

function App() {
    useStyles()
    
    const [context, setContext] = useState(contextDefaultValue)
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem("token"))
    const [updateKey, forceUpdate] = useReducer(key => key + 1, 0)

    const contextMethods = {
        set: values => {
            contextMiddleware(values)
            setContext({ ...context, ...values })
        },

        resetEditor: () => {
            setContext({
                ...context,
                isEmptyState: contextDefaultValue.isEmptyState,
                currentTemplate: contextDefaultValue.currentTemplates,
                focus: contextDefaultValue.focus,
                rootElement: contextDefaultValue.rootElement,
                elements: contextDefaultValue.elements,
                drawing: contextDefaultValue.drawing
            })
        },

        reloadProfile: forceUpdate
    }

    useEffect(() => {
        if (context.auth.token) {
            setTokenHeader(context.auth.token)
            getProfile()
                .then(res => {
                    contextMethods.set({
                        auth: {
                            ...context.auth,
                            user: res.data,
                            isLoggedIn: true
                        }
                    })
                })
                .finally(() => setIsLoading(false))
        }

        // eslint-disable-next-line
    }, [updateKey])

    window.context = context

    return (
        <AppContext.Provider value={{ ...context, ...contextMethods }}>
            <Analytics />
            <OfflineUseAlerts />

            {isLoading ? (
                <CircularProgress/>
            ) : (
                <Router/>
            )}
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
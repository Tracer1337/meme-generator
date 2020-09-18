import React, { useState, useEffect } from "react"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"
import Analytics from "./utils/Analytics.js"
import OfflineUseAlerts from "./utils/OfflineUseAlerts.js"
import { setPasswordHeader } from "./config/api.js"
import settingsOptions from "./config/settings-options.json"

const AppContext = React.createContext()

if (localStorage.getItem("password")) {
    setPasswordHeader(localStorage.getItem("password"))
}

const initialSettings = !!localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings")) : {
    isExperimental: false
}

function App() {
    const [context, setContext] = useState({
        password: localStorage.getItem("password"),
        event: new EventTarget(),
        
        isEmptyState: true,
        
        currentTemplate: null,
        rootElement: null,
        elements: [],
        focus: null,
        
        drawing: {
            enabled: false,
            color: settingsOptions.colors["Red"],
            lineWidth: settingsOptions.lineWidth[1]
        },

        settings: initialSettings
    })

    const setter = {
        set: values => {
            if ("settings" in values) {
                localStorage.setItem("settings", JSON.stringify(values.settings))
            }

            setContext({ ...context, ...values })
        },
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

            <Canvas />
            <BottomBar />
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
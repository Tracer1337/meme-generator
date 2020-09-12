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

function App() {
    const [context, setContext] = useState({
        event: new EventTarget(),
        image: null,
        label: null,
        currentTemplate: null,
        password: localStorage.getItem("password"),
        drawing: {
            enabled: false,
            color: settingsOptions.colors["Red"]
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
        // Handle image injection
        const handleMessage = (message) => {
            if (message.data.image) {
                setContext({
                    ...context,
                    image: message.data.image,
                    label: message.data.label
                })
            }
        }

        // Detect ctrl + z
        const handleUndo = (event) => {
            if (event.ctrlKey && event.keyCode === 90) {
                context.event.dispatchEvent(new CustomEvent("undo"))
            }
        }

        window.addEventListener("message", handleMessage)
        window.addEventListener("keydown", handleUndo)

        return () => {
            window.removeEventListener("message", handleMessage)
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
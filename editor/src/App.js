import React, { useState, useEffect } from "react"
import { useTheme } from "@material-ui/core/styles"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"
import Analytics from "./utils/Analytics.js"
import OfflineUseAlerts from "./utils/OfflineUseAlerts.js"
import { setCSSVariable } from "./utils/style.js"

const AppContext = React.createContext()

// The screen should not be wider than maxRatio% of the height
const maxRatio = .65

function getWidth() {
    if (window.outerWidth / window.outerHeight > maxRatio) {
        return window.outerHeight * maxRatio
    }

    return window.outerWidth
}

function App({ injectedImage = null }) {
    const theme = useTheme()

    const [context, setContext] = useState({
        event: new EventTarget(),
        image: injectedImage,
        label: null,
        currentTemplate: null,
        password: localStorage.getItem("password"),
        width: getWidth()
    })

    const setter = {
        set: values => setContext({ ...context, ...values }),
        setPassword: password => {
            // Store password in localstorage
            localStorage.setItem("password", password)
            setContext({ ...context, password })
        }
    }

    useEffect(() => {
        const handleUndo = (event) => {
            // Detect ctrl + z
            if(event.ctrlKey && event.keyCode === 90) {
                context.event.dispatchEvent(new CustomEvent("undo"))
            }
        }

        window.addEventListener("keydown", handleUndo)

        return () => window.removeEventListener("keydown", handleUndo)
    }, [])

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

        // Reset dimensions
        const handleResize = () => {
            setter.set({ width: getWidth() })
        }

        window.addEventListener("message", handleMessage)
        window.addEventListener("resize", handleResize)
        
        return () => {
            window.removeEventListener("message", handleMessage)
            window.removeEventListener("resize", handleResize)
        }
    })

    useEffect(() => {
        // Apply width
        setCSSVariable("width", context.width + "px")
    }, [context.width])

    useEffect(() => {
        // Set root's shadow
        document.getElementById("root").style.boxShadow = theme.shadows[4]
    }, [theme])

    return (
        <AppContext.Provider value={{ ...context, ...setter }}>
            <Analytics/>
            <OfflineUseAlerts/>
            
            <Canvas/>
            <BottomBar/>
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
import React, { useState, useEffect, useReducer } from "react"
import { useTheme } from "@material-ui/core/styles"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"
import Analytics from "./utils/Analytics.js"
import OfflineUseAlerts from "./utils/OfflineUseAlerts.js"
import { setCSSVariable } from "./utils/style.js"

const AppContext = React.createContext()

/**
 * If the screen is wider than maxRatio% of the height, set
 * the width to constraintTo * height.
 */
const maxRatio = 1
const constrainTo = .65

function getWidth() {
    if (window.outerWidth / window.outerHeight > maxRatio) {
        return window.outerHeight * constrainTo
    }

    return window.outerWidth
}

function App() {
    const theme = useTheme()

    const [context, setContext] = useState({
        event: new EventTarget(),
        image: null,
        label: null,
        currentTemplate: null,
        password: localStorage.getItem("password"),
        width: getWidth()
    })

    const [updateKey, update] = useReducer(key => key + 1, 0)

    const setter = {
        set: values => setContext({ ...context, ...values }),
        setPassword: password => {
            // Store password in localstorage
            localStorage.setItem("password", password)
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

        // Reset dimensions
        const handleResize = () => {
            setter.set({ width: getWidth() })
        }

        // Detect ctrl + z
        const handleUndo = (event) => {
            if (event.ctrlKey && event.keyCode === 90) {
                context.event.dispatchEvent(new CustomEvent("undo"))
            }
        }

        window.addEventListener("message", handleMessage)
        window.addEventListener("resize", handleResize)
        window.addEventListener("keydown", handleUndo)
        
        return () => {
            window.removeEventListener("message", handleMessage)
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("keydown", handleUndo)
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

    useEffect(() => {
        if (updateKey !== 0) {
            // Fix layout in chrome extension
            setter.set({ width: getWidth() })
        } else {
            setTimeout(update, 100)
        }
    }, [updateKey])

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
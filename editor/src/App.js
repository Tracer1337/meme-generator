import React, { useState, useEffect } from "react"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"
import Analytics from "./utils/Analytics.js"

const AppContext = React.createContext()

function App({ injectedImage = null }) {
    const [context, setContext] = useState({
        event: new EventTarget(),
        image: injectedImage,
        label: null,
        currentTemplate: null,
        password: localStorage.getItem("password")
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

        window.addEventListener("message", handleMessage)

        return () => {
            window.removeEventListener("message", handleMessage)
        }
    })

    return (
        <AppContext.Provider value={{ ...context, ...setter }}>
            <Analytics/>
            
            <Canvas/>
            <BottomBar/>
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
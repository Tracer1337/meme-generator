import React, { useState, useEffect } from "react"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"

const AppContext = React.createContext()

function App() {
    const [context, setContext] = useState({
        event: new EventTarget(),
        image: null,
        password: localStorage.getItem("password")
    })

    const setter = {
        setImage: image => setContext({ ...context, image }),
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

    return (
        <AppContext.Provider value={{ ...context, ...setter }}>
            <Canvas/>
            <BottomBar/>
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
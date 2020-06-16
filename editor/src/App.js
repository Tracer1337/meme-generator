import React, { useState, useEffect } from "react"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"

const AppContext = React.createContext()

function App() {
    const [context, setContext] = useState({
        event: new EventTarget(),
        image: null,
        setImage: image => setContext({...context, image})
    })

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
        <AppContext.Provider value={context}>
            <Canvas/>
            <BottomBar/>
        </AppContext.Provider>
    )
}

export default App

export {
    AppContext
}
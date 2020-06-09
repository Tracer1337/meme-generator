import React, { useState } from "react"

import Canvas from "./components/Canvas/Canvas.js"
import BottomBar from "./components/BottomBar/BottomBar.js"

const AppContext = React.createContext()

function App() {
    const [context, setContext] = useState({
        event: new EventTarget(),
        image: null,
        setImage: image => setContext({...context, image})
    })

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
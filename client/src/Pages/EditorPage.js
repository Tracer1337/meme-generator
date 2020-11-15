import React from "react"

import Container from "../components/Layout/Container.js"
import HeaderActions from "../components/BottomBar/HeaderActions.js"
import Canvas from "../components/Canvas/Canvas.js"
import BottomBar from "../components/BottomBar/BottomBar.js"

function EditorPage() {
    return (
        <Container>
            <HeaderActions/>
            <Canvas/>
            <BottomBar/>
        </Container>
    )
}

export default EditorPage
import "core-js/stable"
import "regenerator-runtime/runtime"
import ReactDOM from "react-dom"
import React from "react"

import Grid from "./components/Grid.js"

if (!images) {
    throw new Error("No images given")
}

ReactDOM.render(<Grid/>, document.getElementById("image-grid"))
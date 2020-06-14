import React from "react"
import ReactDOM from "react-dom"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"

import App from "./App.js"
import "./index.css"

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#BB86FC"
        }
    }
})

if(process.env.NODE_ENV === "development") {
    console.log(theme)
}

document.body.style.overflow = "hidden"

ReactDOM.render((
    <ThemeProvider theme={theme}>
        <App/>
    </ThemeProvider>
), document.getElementById("root"))
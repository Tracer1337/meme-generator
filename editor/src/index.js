import React from "react"
import ReactDOM from "react-dom"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"

import App from "./App.js"
import "./index.css"

import { IS_DEV } from "./config/constants.js"

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#BB86FC",
            variant: "#3700B3"
        }
    }
})

if(IS_DEV) {
    console.log(theme)
}

document.body.style.overflow = "hidden"

ReactDOM.render((
    <ThemeProvider theme={theme}>
        <App/>
    </ThemeProvider>
), document.getElementById("root"))
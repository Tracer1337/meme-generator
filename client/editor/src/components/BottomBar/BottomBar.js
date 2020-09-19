import React from "react"
import { AppBar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import MenuButton from "./MenuButton.js"
import DefaultActions from "./DefaultActions.js"
import DrawingActions from "./DrawingActions.js"
import ElementActions from "./ElementActions"

const useStyles = makeStyles(theme => ({
    appBar: {
        position: "absolute",
        top: "unset",
        bottom: 0,
        left: 0,
        right: "unset",
        backgroundColor: theme.palette.background.paper
    }
}))

function BottomBar() {
    const classes = useStyles()

    return (
        <>
            <MenuButton/>
            <DrawingActions />
            
            <AppBar position="fixed" className={classes.appBar} id="bottom-bar">
                <DefaultActions/>
                <ElementActions/>
            </AppBar>
        </>
    )
}

export default BottomBar
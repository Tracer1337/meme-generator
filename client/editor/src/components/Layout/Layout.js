import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import Header from "./Header.js"
import Footer from "./Footer.js"

const useStyles = makeStyles(theme => ({
    layout: props => ({
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        padding: theme.spacing(1),
        paddingTop: theme.mixins.toolbar.minHeight + theme.spacing(1),
        boxSizing: "border-box",
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        display: props.center && "flex",
        alignItems: props.center && "center",
        flexDirection: "column"
    })
}))

function Layout({ children, center }) {
    const classes = useStyles({ center })

    return (
        <div className={classes.layout}>
            <Header/>

            { children }

            <Footer/>
        </div>
    )
}

export default Layout
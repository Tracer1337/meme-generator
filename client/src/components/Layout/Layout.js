import React, { useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"

import { AppContext } from "../../App.js"
import Header from "./Header.js"
import Footer from "./Footer.js"
import ComponentOpener from "../ComponentOpener/ComponentOpener.js"

const useStyles = makeStyles(theme => ({
    layout: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        flexDirection: "column"
    }
}))

function Layout({ children }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    return (
        <div className={classes.layout}>
            <Header isHidden={!context.editor.isEmptyState}/>

            { children }

            <Footer isHidden={!context.editor.isEmptyState}/>

            <ComponentOpener />
        </div>
    )
}

export default Layout
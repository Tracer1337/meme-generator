import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        minHeight: "100vh",
        boxSizing: "border-box",
        paddingTop: theme.mixins.toolbar.minHeight,
        paddingBottom: theme.mixins.toolbar.minHeight,
        position: "relative"
    }
}))

function Container({ children }) {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            { children }
        </div>
    )
}

export default Container
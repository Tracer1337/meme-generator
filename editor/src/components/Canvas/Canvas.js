import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        display: "flex"
    },

    canvas: {
        flexGrow: 1
    },

    spacer: {
        ...theme.mixins.toolbar
    }
}))

function Canvas() {
    const classes = useStyles()

    return (
        <div className={classes.canvasWrapper}>
            <div className={classes.canvas}/>
            <div className={classes.spacer}/>
        </div>
    )
}

export default Canvas
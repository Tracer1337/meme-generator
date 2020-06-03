import React, { useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"

import { AppContext } from "../../App.js"

const imagePadding = 10

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        marginBottom: theme.mixins.toolbar.minHeight,
        display: "flex"
    },

    canvas: {
        flexGrow: 1
    },

    image: {
        width: `calc(100vw - ${imagePadding * 2}px)`,
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)"
    }
}))

function Canvas() {
    const context = useContext(AppContext)
    const classes = useStyles()

    return (
        <div className={classes.canvasWrapper}>
            <div className={classes.canvas}>
                {context.image && <img src={context.image} className={classes.image}/>}
            </div>
        </div>
    )
}

export default Canvas
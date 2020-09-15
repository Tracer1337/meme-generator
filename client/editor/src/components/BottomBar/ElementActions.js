import React, { useContext } from "react"
import { Toolbar, IconButton, Fade } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"
import CloneIcon from "@material-ui/icons/LibraryAddOutlined"
import FlipToBackIcon from "@material-ui/icons/FlipToBack"
import FlipToFrontIcon from "@material-ui/icons/FlipToFront"

import { AppContext } from "../../App.js"

const useStyles = makeStyles(theme => ({
    elementActions: {
        position: "absolute",
        right: 0
    }
}))

function ElementActions() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const { element, controls } = context.focus || {}

    const dispatchEvent = (name) => () => {
        context.event.dispatchEvent(new CustomEvent(name, { detail: { element } }))
    }

    return (
        <Fade in={!!context.focus}>
            <Toolbar className={classes.elementActions}>
                {controls?.includes("clone") && (
                    <IconButton onClick={dispatchEvent("elementClone")}>
                        <CloneIcon fontSize="small" />
                    </IconButton>
                )}

                {controls?.includes("layers") && (
                    <IconButton onClick={dispatchEvent("elementToBack")}>
                        <FlipToBackIcon fontSize="small" />
                    </IconButton>
                )}

                {controls?.includes("layers") && (
                    <IconButton onClick={dispatchEvent("elementToFront")}>
                        <FlipToFrontIcon fontSize="small" />
                    </IconButton>
                )}

                
                <IconButton onClick={dispatchEvent("elementBlur")}>
                    <CloseIcon />
                </IconButton>
            </Toolbar>
        </Fade>
    )
}

export default ElementActions
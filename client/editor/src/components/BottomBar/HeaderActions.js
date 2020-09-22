import React, { useContext } from "react"
import { AppBar, Toolbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import { AppContext } from "../../App.js"
import DrawingActions from "./DrawingActions.js"

const useStyles = makeStyles(theme => ({
    headerActions: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.default,
        boxShadow: "none"
    }
}))

function HeaderActions() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const handleClose = () => {
        context.resetEditor()
    }

    return (
        <AppBar className={classes.headerActions}>
            <Toolbar>
                <div>
                    <IconButton onClick={handleClose} edge="start">
                        <CloseIcon/>
                    </IconButton>
                </div>

                <div>
                    <DrawingActions />
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderActions
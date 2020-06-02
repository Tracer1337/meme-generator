import React from "react"
import { AppBar, Toolbar, Fab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"

const useStyles = makeStyles(theme => ({
    appBar: {
        top: "auto",
        bottom: 0,
        backgroundColor: theme.palette.background.paper
    },

    fabButton: {
        position: "absolute",
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto"
    }
}))

function BottomBar() {
    const classes = useStyles()

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Fab color="primary" className={classes.fabButton}>
                    <DoneIcon/>
                </Fab>
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar
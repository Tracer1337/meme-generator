import React from "react"
import { AppBar, Toolbar, Divider, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    header: {
        backgroundColor: theme.palette.background.default,
        boxShadow: "none"
    },

    brand: {
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightLight
    }
}))

function Header() {
    const classes = useStyles()

    return (
        <AppBar className={classes.header}>
            <Toolbar>
                <Typography variant="subtitle1" className={classes.brand}>Easy Meme</Typography>
            </Toolbar>

            <Divider/>
        </AppBar>
    )
}

export default Header
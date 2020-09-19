import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    layout: props => ({
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        padding: theme.spacing(1),
        boxSizing: "border-box",
        display: props.center && "flex",
        justifyContent: props.center && "center"
    })
}))

function Layout({ children, center }) {
    const classes = useStyles({ center })

    return (
        <div className={classes.layout}>
            { children }
        </div>
    )
}

export default Layout
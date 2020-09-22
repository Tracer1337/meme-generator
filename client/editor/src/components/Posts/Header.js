import React from "react"
import { Grid, Avatar, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    header: {
        padding: theme.spacing(2)
    },

    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginRight: theme.spacing(2)
    }
}))

function Header({ data }) {
    const classes = useStyles()

    return (
        <Grid container className={classes.header}>
            <Grid item>
                <Avatar className={classes.avatar}>{ data.user.username[0] }</Avatar>
            </Grid>

            <Grid item>
                <Typography>{ data.user.username }</Typography>
            </Grid>
        </Grid>
    )
}

export default Header
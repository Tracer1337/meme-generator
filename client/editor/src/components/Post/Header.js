import React from "react"
import { Link } from "react-router-dom"
import { Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Avatar from "../User/Avatar.js"

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
                <Link to={data.user.profile_url}>
                    <Avatar className={classes.avatar} user={data.user}/>
                </Link>
            </Grid>

            <Grid item>
                <Link to={data.user.profile_url}>
                    <Typography>{ data.user.username }</Typography>
                </Link>
            </Grid>
        </Grid>
    )
}

export default Header
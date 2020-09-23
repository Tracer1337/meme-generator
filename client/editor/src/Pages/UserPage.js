import React from "react"
import { useParams } from "react-router-dom"
import { Typography, CircularProgress, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout/Layout.js"
import Avatar from "../components/User/Avatar.js"
import Templates from "../components/Dialogs/components/Templates.js"
import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    grid: {
        marginTop: theme.spacing(2)
    },

    avatar: {
        width: 64,
        height: 64,
        marginBottom: theme.spacing(2)
    },

    username: {
        marginBottom: theme.spacing(3)
    }
}))

function UserPage() {
    const classes = useStyles()

    const { username } = useParams()

    const { isLoading, data, reload } = useAPIData({
        method: "getUserByUsername",
        data: username
    })

    if (isLoading) {
        return (
            <Layout>
                <CircularProgress/>
            </Layout>
        )
    }

    return (
        <Layout>
            <Grid container direction="column" alignItems="center" className={classes.grid}>
                <Grid item>
                    <Avatar user={data} className={classes.avatar}/>
                </Grid>

                <Grid item>
                    <Typography variant="h6" className={classes.username}>{data.username}</Typography>
                </Grid>
            </Grid>

            <Templates
                templates={data.templates}
                renderUserTemplates={false}
                onLoad={console.log}
                onReload={reload}
            />
        </Layout>
    )
}

export default UserPage
import React, { useState } from "react"
import { Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import ProfileDialog from "../Dialogs/ProfileDialog.js"
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

    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

    const openProfileDialog = () => setIsProfileDialogOpen(true)

    return (
        <Grid container className={classes.header}>
            <Grid item>
                <Avatar className={classes.avatar} user={data.user} onClick={openProfileDialog}/>
            </Grid>

            <Grid item>
                <Typography onClick={openProfileDialog}>{ data.user.username }</Typography>
            </Grid>

            <ProfileDialog
                open={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                user={data.user}
            />
        </Grid>
    )
}

export default Header
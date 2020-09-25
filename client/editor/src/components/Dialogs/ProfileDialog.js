import React, { useEffect, useContext } from "react"
import { Dialog, AppBar, Toolbar, Typography, Slide, IconButton, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/ExpandMore"

import { AppContext } from "../../App.js"
import Avatar from "../User/Avatar.js" 
import MyProfileElements from "./components/MyProfileElements.js"
import ProfileContent from "./components/ProfileContent.js"
import { createListeners } from "../../utils"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
    innerDialog: {
        overflowY: "overlay",
        overflowX: "hidden"
    },

    header: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: "none"
    },

    grid: {
        marginTop: theme.mixins.toolbar.minHeight
    },

    avatar: {
        width: 64,
        height: 64,
        marginBottom: theme.spacing(1)
    }
}))

function ProfileDialog({ open, onClose, user, onReload = () => {} }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const isMyProfile = user.id === context.auth.user.id

    useEffect(() => {
        return createListeners(context.event, [
            ["loadTemplate", onClose]
        ])
    })

    return (
        <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition} classes={{ paper: classes.innerDialog }}>
            <AppBar className={classes.header}>
                <Toolbar>
                    <IconButton edge="start" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Grid container direction="column" alignItems="center" className={classes.grid}>
                <Grid item>
                    <Avatar user={user} className={classes.avatar} hasUploadButton={isMyProfile}/>
                </Grid>

                <Grid item>
                    <Typography variant="h6">{user.username}</Typography>
                </Grid>
            </Grid>

            { isMyProfile && <MyProfileElements/> }

            <ProfileContent user={user} onReload={onReload}/>
        </Dialog>
    )
}

export default ProfileDialog
import React, { useEffect, useContext } from "react"
import { Dialog, AppBar, Toolbar, Typography, Slide, IconButton, Grid, Button as MuiButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/ExpandMore"

import { AppContext } from "../../App.js"
import Avatar from "../User/Avatar.js" 
import Templates from "./components/Templates.js"
import { createListeners } from "../../utils"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
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
    },

    section: {
        margin: theme.spacing(2),
        marginBottom: 0
    },

    sectionTitle: {
        marginBottom: theme.spacing(1)
    },

    button: {
        marginBottom: theme.spacing(1)
    },

    templates: {
        margin: -theme.spacing(2),
        marginBottom: 0
    }
}))

function Button({ children, ...props }) {
    const classes = useStyles()
    
    return (
        <MuiButton
            variant="outlined"
            color="primary"
            fullWidth
            className={classes.button}
            {...props}
        >
            { children }
        </MuiButton>
    )
}

function ProfileDialog({ open, onClose, user, onReload = () => {} }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const dispatch = (name) => () => context.event.dispatchEvent(new CustomEvent(name))

    const isOwnProfile = user.id === context.auth.user.id

    useEffect(() => {
        return createListeners(context.event, [
            ["loadTemplate", onClose]
        ])
    })

    return (
        <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition}>
            <AppBar className={classes.header}>
                <Toolbar>
                    <IconButton edge="start" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Grid container direction="column" alignItems="center" className={classes.grid}>
                <Grid item>
                    <Avatar user={user} className={classes.avatar} />
                </Grid>

                <Grid item>
                    <Typography variant="h6">{user.username}</Typography>
                </Grid>
            </Grid>

            { isOwnProfile && (
                <div className={classes.section}>
                    <Typography variant="h6" className={classes.sectionTitle}>Friends</Typography>

                    <Button onClick={dispatch("openAddFriendsDialog")}>Add Friends</Button>

                    <Button onClick={dispatch("openMyFriendsDialog")}>My Friends</Button>
                </div>
            ) }

            <div className={classes.section}>
                <Typography variant="h6" className={classes.sectionTitle}>Templates</Typography>

                <div className={classes.templates}>
                    <Templates
                        templates={user.templates}
                        renderUserTemplates={false}
                        onReload={onReload}
                    />
                </div>
            </div>
        </Dialog>
    )
}

export default ProfileDialog
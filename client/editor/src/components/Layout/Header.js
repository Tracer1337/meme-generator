import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AppBar, Toolbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AccountIcon from "@material-ui/icons/AccountCircle"
import PersonAddIcon from "@material-ui/icons/PersonAdd"

import { AppContext } from "../../App.js"
import Avatar from "../User/Avatar.js"
import FriendsDialog from "../Dialogs/FriendsDialog.js"

const useStyles = makeStyles(theme => ({
    header: {
        backgroundColor: theme.palette.background.default,
        boxShadow: "none"
    },

    accountButton: {
        marginRight: theme.spacing(2)
    },

    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3)
    }
}))

function Header() {
    const context = useContext(AppContext)
    
    const classes = useStyles()

    const [isFriendsDialogOpen, setIsFriendsDialogOpen] = useState(false)

    return (
        <AppBar className={classes.header}>
            <Toolbar>
                <Link className={classes.accountButton} to={context.auth.isLoggedIn ? context.auth.user.profile_url : "/login"}>
                    {context.auth.isLoggedIn ? <Avatar user={context.auth.user} className={classes.avatar} /> : (
                        <IconButton size="small">
                            <AccountIcon/>
                        </IconButton>
                    )}
                </Link>

                { context.auth.isLoggedIn && (
                    <IconButton size="small" onClick={() => setIsFriendsDialogOpen(true)}>
                        <PersonAddIcon />
                    </IconButton>
                ) }
            </Toolbar>

            <FriendsDialog
                open={isFriendsDialogOpen}
                onClose={() => setIsFriendsDialogOpen(false)}
            />
        </AppBar>
    )
}

export default Header
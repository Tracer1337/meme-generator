import React, { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { AppBar, Toolbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AccountIcon from "@material-ui/icons/AccountCircle"
import PersonAddIcon from "@material-ui/icons/PersonAdd"

import { AppContext } from "../../App.js"
import Avatar from "../User/Avatar.js"
import AddFriendsDialog from "../Dialogs/AddFriendsDialog.js"
import MyFriendsDialog from "../Dialogs/MyFriendsDialog.js"
import ProfileDialog from "../Dialogs/ProfileDialog.js"
import { createListeners } from "../../utils"

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

function Header({ isHidden }) {
    const context = useContext(AppContext)
    
    const history = useHistory()
    
    const classes = useStyles()

    const [isAddFriendsDialogOpen, setIsAddFriendsDialogOpen] = useState(false)
    const [isMyFriendsDialogOpen, setIsMyFriendsDialogOpen] = useState(false)
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

    const handleAvatarClick = () => {
        if (!context.auth.isLoggedIn) {
            history.push("/login")
        } else {
            setIsProfileDialogOpen(true)
        }
    }

    useEffect(() => {
        return createListeners(context.event, [
            ["openAddFriendsDialog", () => setIsAddFriendsDialogOpen(true)],
            ["openMyFriendsDialog", () => setIsMyFriendsDialogOpen(true)]
        ])
    })

    return (
        <AppBar className={classes.header} style={{ display: isHidden && "none" }}>
            <Toolbar>
                <div className={classes.accountButton}>
                    <IconButton size="small" onClick={handleAvatarClick}>
                        {context.auth.isLoggedIn ? (
                            <Avatar user={context.auth.user} className={classes.avatar} />
                        ) : (
                            <AccountIcon />
                        )}
                    </IconButton>
                </div>

                { context.auth.isLoggedIn && (
                    <IconButton size="small" onClick={() => setIsAddFriendsDialogOpen(true)}>
                        <PersonAddIcon />
                    </IconButton>
                ) }
            </Toolbar>

            { context.auth.isLoggedIn && (
                <>
                    <ProfileDialog
                        open={isProfileDialogOpen}
                        onClose={() => setIsProfileDialogOpen(false)}
                        user={context.auth.user}
                        onReload={context.reloadProfile}
                    />
                    <AddFriendsDialog open={isAddFriendsDialogOpen} onClose={() => setIsAddFriendsDialogOpen(false)} />
                    <MyFriendsDialog open={isMyFriendsDialogOpen} onClose={() => setIsMyFriendsDialogOpen(false)} />
                </>
            ) }
        </AppBar>
    )
}

export default Header
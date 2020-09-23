import React, { useContext } from "react"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RemoveIcon from "@material-ui/icons/Close"

import { AppContext } from "../../../App.js"
import UserCard from "../../User/UserCard.js"
import { removeFriend } from "../../../config/api.js"

const useStyles = makeStyles(theme => ({
    usercard: {
        marginBottom: theme.spacing(2)
    }
}))

function MyFriends({ search }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const handleAddClick = (user) => {
        removeFriend(user.id)
            .then(context.reloadProfile)
            .catch(console.error)
    }

    const renderUsers = context.auth.user.friends.filter(user => user.username.startsWith(search))

    return (
        <div>
            { renderUsers.map(user => (
                <UserCard user={user} className={classes.usercard} key={user.id} RightElement={(
                    <IconButton onClick={() => handleAddClick(user)}>
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                )} />
            ))}
        </div>
    )
}

export default MyFriends
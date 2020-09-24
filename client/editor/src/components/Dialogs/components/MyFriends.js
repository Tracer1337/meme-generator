import React, { useContext } from "react"
import { IconButton, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RemoveIcon from "@material-ui/icons/Close"

import { AppContext } from "../../../App.js"
import UserCard from "../../User/UserCard.js"
import { removeFriend } from "../../../config/api.js"

const useStyles = makeStyles(theme => ({
    letter: {
        marginBottom: theme.spacing(2)
    },

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

    const sortedUsers = renderUsers.reduce((map, user) => {
        const letter = user.username[0].toUpperCase()

        if (!map[letter]) {
            map[letter] = []
        }

        map[letter].push(user)

        return map
    }, {})

    const sortedKeys = Object.keys(sortedUsers).sort((a, b) => a.localeCompare(b))

    return (
        <div>
            { sortedKeys.map(letter => (
                <div key={letter}>
                    <Typography variant="h6" className={classes.letter}>{ letter }</Typography>

                    { sortedUsers[letter].map(user => (
                        <UserCard user={user} className={classes.usercard} key={user.id} RightElement={(
                            <IconButton onClick={() => handleAddClick(user)}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                        )} />
                    )) }
                </div>
            )) }
        </div>
    )
}

export default MyFriends
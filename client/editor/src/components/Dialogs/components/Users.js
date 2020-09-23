import React, { useState, useContext, useImperativeHandle } from "react"
import { CircularProgress, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/PersonAdd"
import DoneIcon from "@material-ui/icons/Done"

import { AppContext } from "../../../App.js"
import UserCard from "../../User/UserCard.js"
import useAPIData from "../../../utils/useAPIData.js"
import { addFriend } from "../../../config/api.js"

const useStyles = makeStyles(theme => ({
    usercard: {
        marginBottom: theme.spacing(2)
    }
}))

function Users({ search }, ref) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const { isLoading, data, reload, reset } = useAPIData({
        method: "getUsersByQueryString",
        data: search,
        useCache: false,
        initialRequests: false
    })

    const [addedUsers, setAddedUsers] = useState([])

    useImperativeHandle(ref, () => ({ reload, reset }))

    if (isLoading) {
        return <CircularProgress/>
    }

    if (!data) {
        return null
    }

    const renderUsers = data.filter(user => (
        user.id !== context.auth.user.id &&
        !context.auth.user.friends.some(({ id }) => user.id === id)
    ))
    
    const handleAddClick = (user) => {
        addFriend(user.id)
            .then(() => {
                setAddedUsers([ ...addedUsers, user ])
            })
            .catch(console.error)
    }

    return (
        <div>
            { renderUsers.map(user => (
                <UserCard user={user} className={classes.usercard} key={user.id} RightElement={
                    addedUsers.some(({ id }) => user.id === id) ? (
                        <IconButton>
                            <DoneIcon fontSize="small"/>
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => handleAddClick(user)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    )
                } />
            ))}
        </div>
    )
}

export default React.forwardRef(Users)
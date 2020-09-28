import React, { useContext } from "react"
import { Typography, Button as MuiButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { AppContext } from "../../../App.js"

const useStyles = makeStyles(theme => ({
    myProfileElements: {
        margin: theme.spacing(2),
        marginBottom: 0
    },

    title: {
        marginBottom: theme.spacing(1)
    },

    button: {
        marginBottom: theme.spacing(1)
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
            { children}
        </MuiButton>
    )
}

function MyProfileElements() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const dispatch = (name) => () => context.event.dispatchEvent(new CustomEvent(name))

    return (
        <div className={classes.myProfileElements}>
            <Typography variant="h6" className={classes.title}>Friends</Typography>

            <Button onClick={dispatch("openAddFriendsDialog")}>Add Friends</Button>

            <Button onClick={dispatch("openMyFriendsDialog")}>My Friends</Button>
        </div>
    )
}

export default MyProfileElements
import React from "react"
import { useHistory } from "react-router-dom"
import { IconButton } from "@material-ui/core"
import AvatarIcon from "@material-ui/icons/AccountCircle"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    menuButton: {
        position: "absolute",
        top: theme.spacing(1),
        left: theme.spacing(1)
    }
}))

function MenuButton() {
    const history = useHistory()

    const classes = useStyles()
    
    const handleClick = () => {
        history.push("/profile")
    }

    return (
        <IconButton className={classes.menuButton} onClick={handleClick}>
            <AvatarIcon/>
        </IconButton>
    )
}

export default MenuButton
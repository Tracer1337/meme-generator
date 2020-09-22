import React from "react"
import { useHistory } from "react-router-dom"
import { IconButton } from "@material-ui/core"
import SwitchIcon from "@material-ui/icons/Close"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    menuButton: {
        position: "absolute",
        top: theme.spacing(.5),
        left: theme.spacing(.5)
    }
}))

function MenuButton() {
    const history = useHistory()

    const classes = useStyles()
    
    const handleClick = () => {
        history.push("/feed")
    }

    return (
        <IconButton className={classes.menuButton} onClick={handleClick}>
            <SwitchIcon/>
        </IconButton>
    )
}

export default MenuButton
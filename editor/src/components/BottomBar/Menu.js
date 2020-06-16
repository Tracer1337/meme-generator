import React, { useContext } from "react"
import { Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import BorderOuterIcon from "@material-ui/icons/BorderOuter"
import GridIcon from "@material-ui/icons/GridOn"
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"

import { AppContext } from "../../App.js"

const useStyles = makeStyles(theme => ({
    icon: {
        minWidth: theme.spacing(4)
    }
}))

function Menu({ open, anchorEl, onClose }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const dispatchEvent = (name) => () => {
        context.event.dispatchEvent(new CustomEvent(name))
        onClose()
    } 

    return (
        <MuiMenu
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
        >
            <MenuItem onClick={dispatchEvent("setBorder")}>
                <ListItemIcon className={classes.icon}>
                    <BorderOuterIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Border"/>
            </MenuItem>

            <MenuItem onClick={dispatchEvent("setGrid")}>
                <ListItemIcon className={classes.icon}>
                    <GridIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Grid"/>
            </MenuItem>

            <MenuItem onClick={dispatchEvent("addImage")}>
                <ListItemIcon className={classes.icon}>
                    <AddPhotoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add Image" />
            </MenuItem>

            <MenuItem onClick={dispatchEvent("importImage")}>
                <ListItemIcon className={classes.icon}>
                    <PhotoLibraryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={context.image ? "Replace Meme" : "Import Meme"} />
            </MenuItem>
        </MuiMenu>
    )
}

export default Menu
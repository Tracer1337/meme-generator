import React, { useContext } from "react"
import { Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import BorderOuterIcon from "@material-ui/icons/BorderOuter"
import GridIcon from "@material-ui/icons/GridOn"
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import RectangleIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import EditIcon from "@material-ui/icons/Edit"

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
            {/* Draw */}
            <MenuItem onClick={dispatchEvent("toggleDrawing")}>
                <ListItemIcon className={classes.icon}>
                    <EditIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary={!context.drawing.enabled ? "Enable Drawing" : "Disable Drawing"}/>
            </MenuItem>
            
            {/* Rectangle */}
            <MenuItem onClick={dispatchEvent("addRectangle")}>
                <ListItemIcon className={classes.icon}>
                    <RectangleIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Add Rectangle"/>
            </MenuItem>

            {/* Border */}
            <MenuItem onClick={dispatchEvent("setBorder")}>
                <ListItemIcon className={classes.icon}>
                    <BorderOuterIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Set Border"/>
            </MenuItem>

            {/* Grid */}
            <MenuItem onClick={dispatchEvent("setGrid")}>
                <ListItemIcon className={classes.icon}>
                    <GridIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Set Grid"/>
            </MenuItem>

            {/* Import Sticker */}
            <MenuItem onClick={dispatchEvent("importSticker")}>
                <ListItemIcon className={classes.icon}>
                    <AddPhotoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Import Sticker" />
            </MenuItem>

            {/* Import Meme */}
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
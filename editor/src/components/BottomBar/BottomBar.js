import React, { useContext, useState, useRef } from "react"
import { AppBar, Toolbar, Fab, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import Menu from "./Menu.js"

import { AppContext } from "../../App.js"

const useStyles = makeStyles(theme => ({
    appBar: {
        top: "auto",
        bottom: 0,
        backgroundColor: theme.palette.background.paper
    },

    fabButton: {
        position: "absolute",
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto"
    },

    spacer: {
        flexGrow: 1
    }
}))

function BottomBar() {
    const context = useContext(AppContext)
    
    const classes = useStyles()

    const openMenuButton = useRef()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleMoreClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuClose = () => {
        setIsMenuOpen(false)
    }

    const dispatchEvent = (name) => () => {
        context.event.dispatchEvent(new CustomEvent(name))
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <div className={classes.spacer}/>

                <Fab color="primary" className={classes.fabButton} onClick={dispatchEvent("generateImage")}>
                    <DoneIcon/>
                </Fab>

                <IconButton onClick={dispatchEvent("addTextField")}>
                    <TextFieldsIcon/>
                </IconButton>

                <IconButton onClick={dispatchEvent("importImage")}>
                    <PhotoLibraryIcon/>
                </IconButton>

                <IconButton onClick={handleMoreClick} ref={openMenuButton}>
                    <MoreVertIcon/>
                </IconButton>

                <Menu open={isMenuOpen} anchorEl={openMenuButton.current} onClose={handleMenuClose}/>
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar
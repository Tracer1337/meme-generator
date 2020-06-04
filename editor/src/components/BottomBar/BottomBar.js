import React, { useContext, useState, useRef } from "react"
import { AppBar, Toolbar, Fab, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import Menu from "./Menu.js"

import importFile, { fileToImage } from "../../utils/importFile.js"
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

    const handleImageImportClick = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)
        context.setImage(base64Image)
    }

    const handleTextFieldsClick = () => {
        context.event.dispatchEvent(new CustomEvent("addTextField"))
    }

    const handleDoneClick = () => {
        context.event.dispatchEvent(new CustomEvent("generateImage"))
    }

    const handleMoreClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuClose = () => {
        setIsMenuOpen(false)
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <div className={classes.spacer}/>

                <Fab color="primary" className={classes.fabButton} onClick={handleDoneClick}>
                    <DoneIcon/>
                </Fab>

                <IconButton onClick={handleTextFieldsClick}>
                    <TextFieldsIcon/>
                </IconButton>

                <IconButton onClick={handleImageImportClick}>
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
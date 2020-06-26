import React, { useContext, useState, useRef, useEffect } from "react"
import { AppBar, Toolbar, Fab, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import HelpIcon from "@material-ui/icons/Help"
import UndoIcon from "@material-ui/icons/Undo"

import Menu from "./Menu.js"
import TemplatesDialog from "../Dialogs/TemplatesDialog.js"
import HelpDialog from "../Dialogs/HelpDialog.js"
import AuthDialog from "../Dialogs/AuthDialog.js"

import { AppContext } from "../../App.js"
import { LONG_PRESS_DURATION } from "../../config/constants.js"

const useStyles = makeStyles(theme => ({
    appBar: {
        position: "absolute",
        top: "unset",
        bottom: 0,
        left: 0,
        right: "unset",
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
    const helpButtonTimer = useRef()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

    const handleMoreClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuClose = () => {
        setIsMenuOpen(false)
    }

    const handleTemplatesClick = () => {
        setIsTemplatesOpen(true)
    }

    const handleHelpClick = () => {
        setIsHelpOpen(true)
    }

    const handleTouchStart = () => {
        if(context.password) {
            return
        }

        helpButtonTimer.current = setTimeout(() => {
            setIsAuthDialogOpen(true)
        }, LONG_PRESS_DURATION)
    }

    const handleTouchEnd = () => {
        clearTimeout(helpButtonTimer.current)
    }

    const dispatchEvent = (name) => () => {
        context.event.dispatchEvent(new CustomEvent(name))
    }

    useEffect(() => {
        context.event.addEventListener("openTemplatesDialog", handleTemplatesClick)
        
        return () => {
            context.event.removeEventListener("openTemplatesDialog", handleTemplatesClick)
        }
    })

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton onClick={handleHelpClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd}>
                    <HelpIcon/>
                </IconButton>

                <IconButton onClick={handleTemplatesClick} id="templates-button">
                    <CloudDownloadIcon/>
                </IconButton>

                <div className={classes.spacer}/>

                <Fab color="primary" className={classes.fabButton} onClick={dispatchEvent("generateImage")} disabled={!context.image}>
                    <DoneIcon/>
                </Fab>

                <IconButton onClick={dispatchEvent("addTextbox")} id="textbox-button">
                    <TextFieldsIcon/>
                </IconButton>

                <IconButton onClick={dispatchEvent("undo")} id="undo-button">
                    <UndoIcon/>
                </IconButton>

                <IconButton onClick={handleMoreClick} ref={openMenuButton}>
                    <MoreVertIcon/>
                </IconButton>

                <Menu open={isMenuOpen} anchorEl={openMenuButton.current} onClose={handleMenuClose}/>

                <TemplatesDialog open={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)}/>
                <HelpDialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)}/>
                <AuthDialog open={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)}/>
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar
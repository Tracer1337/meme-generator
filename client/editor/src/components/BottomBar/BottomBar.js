import React, { useContext, useState, useRef, useEffect } from "react"
import { AppBar, Toolbar, Fab, IconButton, Snackbar, Zoom, Fade as MuiFade } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import HelpIcon from "@material-ui/icons/Help"
import UndoIcon from "@material-ui/icons/Undo"
import CloseIcon from "@material-ui/icons/Close"

import Menu from "./Menu.js"
import TemplatesDialog from "../Dialogs/TemplatesDialog.js"
import HelpDialog from "../Dialogs/HelpDialog.js"
import AuthDialog from "../Dialogs/AuthDialog.js"
import DrawingActions from "./DrawingActions.js"

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
    },

    elementRight: {
        position: "absolute",
        right: theme.spacing(2)
    },

    snackbarClose: {
        color: theme.palette.primary.variant
    },

    fade: {
        transitionDuration: "0ms !important"
    }
}))

function Fade({ children }) {
    const context = useContext(AppContext)
    const classes = useStyles()

    const hasDrawingStateChanged = useRef(false)

    if (context.drawing.enabled && !hasDrawingStateChanged.current) {
        hasDrawingStateChanged.current = true
    }

    return <MuiFade in={!context.drawing.enabled} className={!hasDrawingStateChanged.current && classes.fade}>{children}</MuiFade>
}

function BottomBar() {
    const context = useContext(AppContext)
    
    const classes = useStyles()

    const openMenuButton = useRef()
    const helpButtonTimer = useRef()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
    const [isLoggedOutSnackbarOpen, setIsLoggedOutSnackbarOpen] = useState(false)

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

    const handleDisableDrawingClick = () => {
        context.set({
            drawing: {
                ...context.drawing,
                enabled: false
            }
        })
    }

    const handleTouchStart = () => {
        helpButtonTimer.current = setTimeout(() => {
            if (!context.password) {
                setIsAuthDialogOpen(true)
            } else {
                context.setPassword(null)
                setIsLoggedOutSnackbarOpen(true)
            }
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
                {/* Left */}

                <IconButton onClick={handleHelpClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd}>
                    <HelpIcon/>
                </IconButton>

                <IconButton onClick={handleTemplatesClick} id="templates-button">
                    <CloudDownloadIcon/>
                </IconButton>

                {/* Center */}

                <div className={classes.spacer}/>

                <Fab color="primary" className={classes.fabButton} onClick={dispatchEvent("generateImage")} disabled={!context.image}>
                    <DoneIcon/>
                </Fab>

                {/* Right */}

                <div className={classes.elementRight}>
                    <Fade>
                        <IconButton onClick={dispatchEvent("addTextbox")} id="textbox-button">
                            <TextFieldsIcon />
                        </IconButton>
                    </Fade>

                    <IconButton onClick={dispatchEvent("undo")} id="undo-button">
                        <UndoIcon />
                    </IconButton>

                    <Fade>
                        <IconButton onClick={handleMoreClick} ref={openMenuButton}>
                            <MoreVertIcon />
                        </IconButton>
                    </Fade>
                </div>

                <Zoom in={context.drawing.enabled}>
                    <IconButton onClick={handleDisableDrawingClick} className={classes.elementRight}>
                        <CloseIcon />
                    </IconButton>
                </Zoom>

                {/* Off-Layout */}

                <DrawingActions/>

                <Menu open={isMenuOpen} anchorEl={openMenuButton.current} onClose={handleMenuClose}/>

                <TemplatesDialog open={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)}/>
                <HelpDialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)}/>
                <AuthDialog open={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)}/>

                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                    open={isLoggedOutSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setIsLoggedOutSnackbarOpen(false)}
                    message="Logged Out"
                    action={
                        <IconButton onClick={() => setIsLoggedOutSnackbarOpen(false)} className={classes.snackbarClose}>
                            <CloseIcon />
                        </IconButton>
                    }
                />
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar
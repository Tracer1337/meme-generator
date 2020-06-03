import React, { useContext } from "react"
import { AppBar, Toolbar, Fab, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DoneIcon from "@material-ui/icons/Done"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import TextFieldsIcon from "@material-ui/icons/TextFields"

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
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar
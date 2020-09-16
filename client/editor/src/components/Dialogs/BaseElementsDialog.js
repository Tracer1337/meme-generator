import React, { useContext } from "react"
import { Dialog, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import BlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { importFile, fileToImage } from "../../utils"
import BaseElement from "../../Models/BaseElement.js"
import { BASE_ELEMENT_TYPES } from "../../config/constants.js"

const useStyles = makeStyles(theme => ({
    listItem: {
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`
    }
}))

function BaseElementsDialog({ onClose, open, onCreateBaseElement }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const dispatchEvent = (name) => () => {
        onClose()
        context.event.dispatchEvent(new CustomEvent(name))
    }

    const handleImportImage = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)

        onCreateBaseElement(new BaseElement({
            type: BASE_ELEMENT_TYPES["IMAGE"],
            image: base64Image
        }))
    }

    const handleCreateBaseBlank = () => {
        onCreateBaseElement(new BaseElement({
            type: BASE_ELEMENT_TYPES["BLANK"]
        }))
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <List>
                <ListItem button onClick={dispatchEvent("openTemplatesDialog")} className={classes.listItem}>
                    <ListItemIcon>
                        <CloudDownloadIcon/>
                    </ListItemIcon>
                    
                    <ListItemText primary="Template"/>
                </ListItem>

                <ListItem button onClick={handleImportImage} className={classes.listItem}>
                    <ListItemIcon>
                        <PhotoLibraryIcon/>
                    </ListItemIcon>

                    <ListItemText primary="Import"/>
                </ListItem>

                <ListItem button onClick={handleCreateBaseBlank} className={classes.listItem}>
                    <ListItemIcon>
                        <BlankIcon/>
                    </ListItemIcon>

                    <ListItemText primary="Blank"/>
                </ListItem>
            </List>
        </Dialog>
    )
}

export default withBackButtonSupport(BaseElementsDialog, "base-elements")
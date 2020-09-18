import React, { useContext } from "react"
import { Dialog, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import CloudDownloadIcon from "@material-ui/icons/CloudDownload"
import BlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"

const useStyles = makeStyles(theme => ({
    listItem: {
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`
    }
}))

<<<<<<< HEAD
function BaseElementsDialog({ onClose, open, onImportImage, onCreateBaseBlank }) {
=======
function BaseElementsDialog({ onClose, open, onCreateBaseElement }) {
>>>>>>> parent of bbf0428... Remove templates from base elements dialog
    const context = useContext(AppContext)

    const classes = useStyles()

    const dispatchEvent = (name) => () => {
        onClose()
        context.event.dispatchEvent(new CustomEvent(name))
    }

    const call = (fn) => () => {
        onClose()
        fn()
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

                <ListItem button onClick={call(onImportImage)} className={classes.listItem}>
                    <ListItemIcon>
                        <PhotoLibraryIcon/>
                    </ListItemIcon>

                    <ListItemText primary="Import"/>
                </ListItem>

                <ListItem button onClick={call(onCreateBaseBlank)} className={classes.listItem}>
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
import React, { useState } from "react"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import SettingsIcon from "@material-ui/icons/Settings"

import SettingsDialog from "../Dialogs/SettingsDialog.js"

const useStyles = makeStyles(theme => ({
    button: {
        position: "absolute",
        top: theme.spacing(1),
        left: theme.spacing(1)
    }
}))

function Settings() {
    const classes = useStyles()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <IconButton className={classes.button} onClick={() => setIsDialogOpen(true)}>
                <SettingsIcon/>
            </IconButton>

            <SettingsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    )
}

export default Settings
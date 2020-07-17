import React, { useState, useEffect } from "react"
import { Snackbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles(theme => ({
    snackbarClose: {
        color: theme.palette.primary.variant
    }
}))

function OfflineUseAlerts() {
    const classes = useStyles()

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarText, setSnackbarText] = useState("")

    useEffect(() => {
        const channel = new BroadcastChannel("sw-0")
    
        channel.addEventListener("message", function ({ data: message }) {
            if(message === "content-cached") {
                setIsSnackbarOpen(true)
                setSnackbarText("The app is cached for offline use")

            } else if (message === "content-available") {
                setIsSnackbarOpen(true)
                setSnackbarText("A new version is available. Restart the app to see it")

            }
        })

        return () => channel.close()
    }, [])

    return ( 
        <>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={isSnackbarOpen}
                autoHideDuration={6000}
                message={snackbarText}
                onClose={() => setIsSnackbarOpen(false)}
                action={
                    <IconButton onClick={() => setIsSnackbarOpen(false)} className={classes.snackbarClose}>
                        <CloseIcon/>
                    </IconButton>
                }
            />
        </>
    )
}

export default OfflineUseAlerts
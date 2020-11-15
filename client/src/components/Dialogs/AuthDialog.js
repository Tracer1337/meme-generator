import React from "react"
import { Dialog, Typography } from "@material-ui/core"

function AuthDialog({ onClose, open }) {
    return (
        <Dialog onClose={onClose} open={open}>
            <Typography>Auth Dialog</Typography>
        </Dialog>
    )
}

export default AuthDialog
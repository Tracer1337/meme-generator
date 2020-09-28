import React from "react"
import { Dialog } from "@material-ui/core"

import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import BaseElements from "./components/BaseElements.js"

function BaseElementsDialog({ onClose, open, onBaseElementCreate }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <BaseElements onClose={onClose} onBaseElementCreate={onBaseElementCreate}/>
        </Dialog>
    )
}

export default withBackButtonSupport(BaseElementsDialog, "base-elements")
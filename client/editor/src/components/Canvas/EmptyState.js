import React, { useContext } from "react"
import { IconButton } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import { AppContext } from "../../App.js"

function EmptyState() {
    const context = useContext(AppContext)

    return (
        <IconButton onClick={() => context.event.dispatchEvent(new CustomEvent("openBaseSelection"))}>
            <AddIcon fontSize="large"/>
        </IconButton>
    )
}

export default EmptyState
import React, { useState, useContext } from "react"
import { Dialog, AppBar, Toolbar, IconButton, Slide, Tabs, Tab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import Templates from "./components/Templates.js"
import Stickers from "./components/Stickers.js"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"

const useStyles = makeStyles(theme => ({
    body: {
        marginTop: theme.mixins.toolbar.minHeight
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>
})

function TemplatesDialog({ onClose, open }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const [currentTab, setCurrentTab] = useState(0)

    const handleClose = () => {
        onClose()
    }

    const handleTemplateLoad = (template) => {
        context.event.dispatchEvent(new CustomEvent("loadTemplate", { detail: { template } }))
        handleClose()
    }

    const handleStickerLoad = (sticker) => {
        context.event.dispatchEvent(new CustomEvent("loadSticker", { detail: { sticker } }))
        handleClose()
    }

    const handleTabChange = (event, index) => {
        setCurrentTab(index)
    }

    return (
        <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>

                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Templates"/>
                        <Tab label="Stickers"/>
                    </Tabs>
                </Toolbar>
            </AppBar>

            <div className={classes.body} hidden={currentTab !== 0}>
                <Templates onLoad={handleTemplateLoad} />
            </div>

            <div className={classes.body} hidden={currentTab !== 1}>
                <Stickers onLoad={handleStickerLoad}/>
            </div>
        </Dialog>
    )
}

export default withBackButtonSupport(TemplatesDialog, "templates")
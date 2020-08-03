import React, { useState, useContext } from "react"
import { Dialog, AppBar, Toolbar, IconButton, Slide, Tabs, Tab } from "@material-ui/core"
import SwipeableViews from "react-swipeable-views"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import Templates from "./components/Templates.js"
import Stickers from "./components/Stickers.js"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"

const useStyles = makeStyles(theme => ({
    dialog: {
        width: props => props.width,
        left: "50% !important",
        transform: "translateX(-50%)"
    },

    appBar: {
        position: "absolute"
    },

    toolbar: {
        minHeight: 46
    },

    body: {
        marginTop: 46
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>
})

function TemplatesDialog({ onClose, open }) {
    const context = useContext(AppContext)

    const classes = useStyles({
        width: context.width
    })

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

    const scrollToTop = () => {
        document.getElementById("templates-dialog-inner-container").scrollTo(0, 0)
    }

    const handleTabChange = (event, index) => {
        setCurrentTab(index)
        scrollToTop()
    }

    const handleChangeIndex = (index) => {
        setCurrentTab(index)
        scrollToTop()
    }

    return (
        <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition} className={classes.dialog}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>

                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Templates"/>
                        <Tab label="Stickers"/>
                    </Tabs>
                </Toolbar>
            </AppBar>

            <SwipeableViews index={currentTab} onChangeIndex={handleChangeIndex} axis="x" id="templates-dialog-inner-container" disableLazyLoading>
                <div className={classes.body}>
                    <Templates onLoad={handleTemplateLoad} active={currentTab === 0}/>
                </div>

                <div className={classes.body}>
                    <Stickers onLoad={handleStickerLoad} active={currentTab === 1}/>
                </div>
            </SwipeableViews>
        </Dialog>
    )
}

export default withBackButtonSupport(TemplatesDialog, "templates")
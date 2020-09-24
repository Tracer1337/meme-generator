import React, { useState, useContext, useEffect, useRef } from "react"
import { Dialog, AppBar, Toolbar, IconButton, Slide, Tabs, Tab } from "@material-ui/core"
import SwipeableViews from "react-swipeable-views"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/ExpandMore"
import ReloadIcon from "@material-ui/icons/Cached"

import Templates from "./components/Templates.js"
import Stickers from "./components/Stickers.js"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { IS_OFFLINE } from "../../config/constants.js"
import { createListeners } from "../../utils"

const useStyles = makeStyles(theme => ({
    toolbar: {
        minHeight: 46,
        display: "flex",
        justifyContent: "space-between"
    },
    
    toolbarItem: {
        display: "flex"
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

    const templatesRef = useRef()
    const stickersRef = useRef()

    const classes = useStyles({
        width: context.width
    })

    const [currentTab, setCurrentTab] = useState(0)

    const handleReload = () => {
        templatesRef.current.reload()
        stickersRef.current.reload()
    }

    const handleStickerLoad = (sticker) => {
        context.event.dispatchEvent(new CustomEvent("loadSticker", { detail: { sticker } }))
        onClose()
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

    useEffect(() => {
        return createListeners(context.event, [
            ["loadTemplate", onClose]
        ])
    })

    return (
        <Dialog fullScreen onClose={onClose} open={open} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.toolbarItem}>
                        <IconButton edge="start" color="inherit" onClick={onClose}>
                            <CloseIcon/>
                        </IconButton>

                        <Tabs value={currentTab} onChange={handleTabChange}>
                            <Tab label="Templates"/>
                            <Tab label="Stickers"/>
                        </Tabs>
                    </div>
                    
                    <div className={classes.toolbarItem}>
                        {!IS_OFFLINE && (
                            <IconButton edge="end" color="inherit" onClick={handleReload}>
                                <ReloadIcon fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            <SwipeableViews index={currentTab} onChangeIndex={handleChangeIndex} axis="x" id="templates-dialog-inner-container" disableLazyLoading>
                <div className={classes.body}>
                    <Templates active={currentTab === 0} ref={templatesRef}/>
                </div>

                <div className={classes.body}>
                    <Stickers onLoad={handleStickerLoad} active={currentTab === 1} ref={stickersRef}/>
                </div>
            </SwipeableViews>
        </Dialog>
    )
}

export default withBackButtonSupport(TemplatesDialog, "templates")
import React from "react"
import { SwipeableDrawer, IconButton, DialogTitle } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import WhatsAppIcon from "../../../assets/images/WhatsApp.svg"
import TwitterIcon from "../../../assets/images/Twitter.png"
import FacebookIcon from "../../../assets/images/Facebook.png"
import GmailIcon from "../../../assets/images/Gmail.png"
import TelegramIcon from "../../../assets/images/Telegram.png"
import PinterestIcon from "../../../assets/images/Pinterest.png"
import RedditIcon from "../../../assets/images/Reddit.png"
import TumblrIcon from "../../../assets/images/Tumblr.png"
import SkypeIcon from "../../../assets/images/Skype.png"
import FBMessengerIcon from "../../../assets/images/FBMessenger.png"

const useStyles = makeStyles(theme => ({
    innerDrawer: {
        borderRadius: "16px 16px 0 0"
    },

    title: {
        paddingBottom: theme.spacing(1)
    },

    iconsContainer: {
        display: "flex",
        padding: `0 ${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
        overflow: "scroll"
    },

    icon: {
        width: 40
    }
}))

function ShareDialog({ open, link, onClose, onOpen }) {
    link = encodeURIComponent(link)
    
    const classes = useStyles()

    const bindLink = href => () => window.open(href.replace(/{}/g, link))

    return (
        <SwipeableDrawer
            disableDiscovery
            disableSwipeToOpen
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            anchor="bottom"
            PaperProps={{ className: classes.innerDrawer }}
        >
            <DialogTitle className={classes.title}>Share Link</DialogTitle>

            <div className={classes.iconsContainer}>
                <IconButton onClick={bindLink("whatsapp://send?text={}")}>
                    <img src={WhatsAppIcon} alt="WhatsApp" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://www.facebook.com/sharer/sharer.php?u={}")}>
                    <img src={FacebookIcon} alt="Facebook" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("http://twitter.com/intent/tweet?text={}")}>
                    <img src={TwitterIcon} alt="Twitter" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://telegram.me/share?url={}")}>
                    <img src={TelegramIcon} alt="Telegram" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://web.skype.com/share?url={}")}>
                    <img src={SkypeIcon} alt="Skype" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("fb-messenger://share?link={}")}>
                    <img src={FBMessengerIcon} alt="Messenger" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://www.pinterest.com/pin/create/button?url={}")}>
                    <img src={PinterestIcon} alt="Pinterest" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://www.reddit.com/submit?url={}")}>
                    <img src={RedditIcon} alt="Reddit" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("https://www.tumblr.com/widgets/share/tool?posttype=link&canonicalUrl={}")}>
                    <img src={TumblrIcon} alt="Tumblr" className={classes.icon}/>
                </IconButton>

                <IconButton onClick={bindLink("mailto:?body={}")}>
                    <img src={GmailIcon} alt="Email" className={classes.icon}/>
                </IconButton>
            </div>
        </SwipeableDrawer>
    )
}

export default ShareDialog

/*

https://www.tumblr.com/widgets/share/tool?
posttype=link&
canonicalUrl=https%3A%2F%2Ftoppng.com%2Freddit-logo-reddit-icon-PNG-free-PNG-Images_164895&
title=reddit%20logo%20-%20reddit%20icon%20PNG%20image%20with%20transparent%20background&
caption=

*/

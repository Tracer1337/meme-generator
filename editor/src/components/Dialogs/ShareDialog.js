import React from "react"
import { SwipeableDrawer, IconButton, DialogTitle } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import WhatsAppIcon from "../../assets/images/icons/WhatsApp.svg"
import TwitterIcon from "../../assets/images/icons/Twitter.png"
import FacebookIcon from "../../assets/images/icons/Facebook.png"
import GmailIcon from "../../assets/images/icons/Gmail.png"
import TelegramIcon from "../../assets/images/icons/Telegram.png"
import PinterestIcon from "../../assets/images/icons/Pinterest.png"
import RedditIcon from "../../assets/images/icons/Reddit.png"
import TumblrIcon from "../../assets/images/icons/Tumblr.png"
import SkypeIcon from "../../assets/images/icons/Skype.png"
import FBMessengerIcon from "../../assets/images/icons/FBMessenger.png"

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
import React, { useState, useRef, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    innerDialog: {
        "& p": {
            color: theme.palette.text.primary
        }
    },

    link: {
        color: theme.palette.text.secondary
    }
}))

function UploadTermsDialog({ open, onAccept, onReject }) {
    const dialogRef = useRef()
    
    const classes = useStyles()

    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

    useEffect(() => {
        if (!open) {
            return
        }

        (async () => {
            await new Promise(requestAnimationFrame)

            if (!dialogRef.current) {
                return
            }

            const content = dialogRef.current.querySelector("." + classes.innerDialog)

            const handleScroll = () => {
                if (content.getBoundingClientRect().height + content.scrollTop >= content.scrollHeight) {
                    console.log("Scrolling")
                    setHasScrolledToBottom(true)
                    content.removeEventListener("scroll", handleScroll)
                }
            }

            content.addEventListener("scroll", handleScroll)

            handleScroll()
        })()
    }, [open])

    const handleClose = () => {
        setHasScrolledToBottom(false)
        onReject()
    }
    
    return (
        <Dialog open={open} onClose={handleClose} ref={ref => dialogRef.current = ref}>
            <DialogTitle>Terms and conditions</DialogTitle>

            <DialogContent className={classes.innerDialog}>
                <DialogContentText>
                    By creating a link for your image, it will be uploaded to our servers and 
                    therefor be listed in our <a href="/archive" target="_blank" className={classes.link}>archive</a>.
                    We will store you IP address and are allowed to hand it to third-parties if you violate against these terms and conditions.
                </DialogContentText>

                <DialogContentText>
                    Your image must meet the following terms and conditions:
                </DialogContentText>

                <DialogContentText>
                    Only upload images that are relevant and appropriate to the product and that meet intellectual property, privacy, and other applicable laws.
                </DialogContentText>

                <DialogContentText>
                    You must hold the copyright of the images that you are uploading.
                    Images that are considered to infringe the copyright or trademarks of other individuals, organizations or companies will not be permitted and will be removed.
                    You must acknowledge that you have sufficient written permission (if necessary) of any recognizable locations or people appearing in the image to be able 
                    to grant us permission to use it on our website. If you think that your copyright to an image on our website has been infringed, please contact us.
                </DialogContentText>

                <DialogContentText>
                    You must not upload photographs that contain objectionable content, including but not limited to nudity, violence, and other offensive, illegal or
                    inappropriate images. Also, images cannot contain advertisement or links.
                </DialogContentText>

                <DialogContentText>
                    By uploading an image to easymeme69.com, you permit us, the unrestricted, perpetual, worldwide,
                    non-transferable, royalty-free right and license to display, exhibit, transmit, reproduce, record, digitize, modify, alter, adapt,
                    create derivative works, exploit and otherwise use and permit others to use in connection with the image uploaded, in all languages and all media,
                    whether now known or hereinafter devised, including without limitation on the Internet, 
                    on mobile platforms and/or devices, in printed materials, and in the advertising, publicity and promotion thereof.
                </DialogContentText>

                <DialogContentText>
                    You should bear in mind that by uploading an image to our website, you agree to indemnify us from any liability resulting from breaches
                    of copyright of the image existing online on our website in digital form.
                </DialogContentText>

                <DialogContentText>
                    You also understand and agree that nothing in this agreement obligates easymeme69.com to display your images.
                    Images must be relevant and appropriate.
                </DialogContentText>

                <DialogContentText>
                    easymeme69.com reserves the right in its sole and absolute discretion to alter these terms at any time for any reason without prior notice,
                    or to terminate the image upload service for any reason at any time without prior notice.
                </DialogContentText>

                <DialogContentText>
                    easymeme69.com also reserves the right to reject and remove any uploaded image from display on its website, for any reason, at any time, without prior notice.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button color="primary" onClick={handleClose} disabled={!hasScrolledToBottom}>
                    decline
                </Button>

                <Button color="primary" onClick={onAccept} disabled={!hasScrolledToBottom}>
                    agree
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UploadTermsDialog
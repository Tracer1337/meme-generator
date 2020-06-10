import React, { useState, useEffect } from "react"
import { Dialog, Button, CircularProgress, Paper, Typography, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from "@material-ui/icons/GetApp"
import LinkIcon from "@material-ui/icons/Link"
import ShareIcon from "@material-ui/icons/Share"

import ShareDialog from "./ShareDialog.js"

import downloadImageFromSrc from "../../utils/downloadImageFromSrc.js"
import dataURLToFile from "../../utils/dataURLToFile.js"
import uploadImage from "../../utils/uploadImage.js"

const useStyles = makeStyles(theme => {
    const button = {
        margin: theme.spacing(2),
        marginTop: 0
    }

    return {
        button,

        title: {
            textAlign: "center"
        },

        innerDialog: {
            margin: theme.spacing(1),
            width: props => !props.imageData && "100%",
            height: props => !props.imageData && "50%",
            display: props => !props.imageData && "flex",
            justifyContent: props => !props.imageData && "center",
            alignItems: props => !props.imageData && "center"
        },

        image: {
            width: "90%",
            margin: `${theme.spacing(2)}px auto`
        },

        uploadButtonWrapper: {
            ...button,
            position: "relative"
        },
        
        buttonLoader: {
            position: "absolute",
            top: "50%", left: "50%",
            margin: "-12px 0 0 -12px"
        },

        linkWrapper: {
            margin: theme.spacing(2),
            marginTop: 0,
            padding: `0 ${theme.spacing(1)}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },

        link: {
            overflowX: "scroll",
            padding: `${theme.spacing(1)}px 0`
        },

        shareButton: {
            padding: theme.spacing(1)
        }
    }
})

function ImageDialog({ open, onClose, imageData }) {
    const classes = useStyles({ imageData })

    const [link, setLink] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

    const handleDownloadClick = () => {
        downloadImageFromSrc(imageData)
    }

    const handleUploadClick = async () => {
        setIsUploading(true)

        const file = dataURLToFile(imageData, "image.png")
        const link = await uploadImage(file)

        setIsUploading(false)
        setLink(link)
    }

    const handleShareClick = () => {
        setIsShareDialogOpen(true)
    }

    useEffect(() => {
        if(!open) {
            // Reset link when dialog closes
            setLink(null)
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.innerDialog }}>
            {!imageData ? (
                <CircularProgress/>
            ) : (
                <>
                    <img alt = "" src = { imageData } className = {classes.image}/>

                    <Paper variant="outlined" className={classes.linkWrapper} style={{ display: !link && "none" }}>
                        <Typography variant="body1" className={classes.link}>
                            {link}
                        </Typography>

                        <IconButton className={classes.shareButton} onClick={handleShareClick}>
                            <ShareIcon />
                        </IconButton>
                    </Paper>

                    {!link && (
                        <div className={classes.uploadButtonWrapper}>
                            <Button
                                startIcon={<LinkIcon />}
                                color="primary"
                                variant="outlined"
                                onClick={handleUploadClick}
                                disabled={isUploading}
                                style={{ width: "100%" }}
                            >
                                Create Link
                        </Button>

                            {isUploading && <CircularProgress size={24} className={classes.buttonLoader} />}
                        </div>
                    )}

                    <Button
                        startIcon={<DownloadIcon />}
                        color="primary"
                        variant="outlined"
                        className={classes.button}
                        onClick={handleDownloadClick}
                    >
                        Download
                    </Button>

                    <ShareDialog
                        open={isShareDialogOpen}
                        link={link}
                        onOpen={handleShareClick}
                        onClose={() => setIsShareDialogOpen(false)}
                    />
                </>
            )}
        </Dialog>
    )
}

export default ImageDialog
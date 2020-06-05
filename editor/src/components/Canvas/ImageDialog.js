import React, { useState, useEffect } from "react"
import { Dialog, Button, CircularProgress, Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from "@material-ui/icons/GetApp"
import LinkIcon from "@material-ui/icons/Link"

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
            margin: theme.spacing(1)
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

        link: {
            margin: theme.spacing(2),
            marginTop: 0,
            padding: theme.spacing(1)
        }
    }
})

function ImageDialog({ open, onClose, imageData }) {
    const classes = useStyles()

    const [link, setLink] = useState()
    const [isUploading, setIsUploading] = useState(false)

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

    useEffect(() => {
        if(!open) {
            // Reset link when dialog closes
            setLink(null)
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.innerDialog }}>
            <img alt="" src={imageData} className={classes.image}/>

            <Paper variant="outlined" className={classes.link} style={{ display: !link && "none" }}>
                <Typography variant="body1">
                    {link}
                </Typography>
            </Paper>

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

                {isUploading && <CircularProgress size={24} className={classes.buttonLoader}/>}
            </div>

            <Button
                startIcon={<DownloadIcon/>}
                color="primary"
                variant="outlined"
                className={classes.button}
                onClick={handleDownloadClick}
            >
                Download
            </Button>
        </Dialog>
    )
}

export default ImageDialog
import React, { useState, useEffect, useContext, useRef } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Button, CircularProgress, Paper, Typography, IconButton, TextField, Snackbar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from "@material-ui/icons/GetApp"
import LinkIcon from "@material-ui/icons/Link"
import ShareIcon from "@material-ui/icons/Share"
import PublishIcon from "@material-ui/icons/Publish"
import CloseIcon from "@material-ui/icons/Close"

import ShareDialog from "./ShareDialog.js"
import UploadTermsDialog from "./UploadTermsDialog.js"

import { AppContext } from "../../App.js"
import downloadImageFromSrc from "../../utils/downloadImageFromSrc.js"
import dataURLToFile from "../../utils/dataURLToFile.js"
import uploadImage from "../../utils/uploadImage.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { uploadTemplate, registerTemplateUse, registerStickerUse } from "../../utils/API.js"

const useStyles = makeStyles(theme => {
    const spacing = {
        margin: theme.spacing(2),
        marginTop: 0
    }

    return {
        spacing,

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
            ...spacing,
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
            overflowX: "overlay",
            padding: `${theme.spacing(1)}px 0`
        },

        shareButton: {
            padding: theme.spacing(1)
        },

        snackbarClose: {
            color: theme.palette.primary.variant
        }
    }
})

function ImageDialog({ open, onClose, imageData, elements }) {
    const context = useContext(AppContext)

    const classes = useStyles({ imageData })
    
    const { register, getValues } = useForm()

    // Increase the usage-counter only once
    const isRegistered = useRef(false)
    const onAccept = useRef()
    const onReject = useRef()

    const [link, setLink] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [isUploadTermsDialogOpen, setIsUploadTermsDialogOpen] = useState(false)
    const [isUploadSnackbarOpen, setIsUploadSnackbarOpen] = useState(false)
    const [hasCreatedTemplate, setHasCreatedTemplate] = useState(false)

    const dispatchEvent = (name, detail) => context.event.dispatchEvent(new CustomEvent(name, { detail }))

    const registerUsage = async () => {
        // Register template usage
        if(context.currentTemplate) {
            if (!isRegistered.current) {
                await registerTemplateUse(context.currentTemplate.id)
            }
        }

        // Register sticker usage
        for(let element of elements) {
            if (element.type === "sticker" && element.data.id !== undefined) {
                await registerStickerUse(element.data.id)
            }
        }

        isRegistered.current = true
    }

    const handleClose = () => {
        isRegistered.current = false
        setHasCreatedTemplate(false)
        onClose()
    }

    const handleDownloadClick = () => {
        downloadImageFromSrc(imageData)
        registerUsage()
        dispatchEvent("downloadImage")
    }

    const handleUploadClick = () => {
        setIsUploadTermsDialogOpen(true)

        new Promise((resolve, reject) => {
            onAccept.current = resolve
            onReject.current = reject
        })

        .then(async () => {
            setIsUploadTermsDialogOpen(false)
            setIsUploading(true)

            const file = dataURLToFile(imageData, "image.png")
            const link = await uploadImage(file)

            setIsUploading(false)
            setLink(link)
            registerUsage()
            dispatchEvent("uploadImage", { link })
        })

        .catch(() => {
            setIsUploadTermsDialogOpen(false)
        })
    }

    const handleShareClick = () => {
        setIsShareDialogOpen(true)
        dispatchEvent("openShareModal")
    }

    const handleTemplateClick = async () => {
        if(!getValues("label")) {
            return
        }

        // Collect image data
        const label = getValues("label")
        const image = dataURLToFile(context.image, "image.png")
        const metaData = {
            textboxes: window.getTextboxes(),
            border: window.getBorder()
        }

        // Create form data
        const formData = new FormData()
        formData.append("password", context.password)
        formData.append("image", image)
        formData.append("label", label)
        formData.append("meta_data", JSON.stringify(metaData))

        // Upload data
        uploadTemplate(formData).then(res => {
            if(res.ok) {
                setHasCreatedTemplate(true)
                setIsUploadSnackbarOpen(true)
            }
        })
    }

    useEffect(() => {
        if(!open) {
            // Reset link when dialog closes
            setLink(null)
        }
    }, [open])

    return (
        <>
            <Dialog open={open} onClose={handleClose} PaperProps={{ className: classes.innerDialog }}>
                {!imageData ? (
                    <CircularProgress/>
                ) : (
                    <>
                        <img alt="" src={imageData} className={classes.image}/>

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
                            className={classes.spacing}
                            onClick={handleDownloadClick}
                        >
                            Download
                        </Button>

                        {context.password && !context.currentTemplate && !hasCreatedTemplate && (
                            <>
                                <TextField
                                    inputRef={register()}
                                    name="label"
                                    label="Label"
                                    className={classes.spacing}
                                    variant="outlined"
                                    defaultValue={context.label}
                                />
                                <Button
                                    startIcon={<PublishIcon />}
                                    color="primary"
                                    variant="outlined"
                                    className={classes.spacing}
                                    onClick={handleTemplateClick}
                                >
                                    Publish Template
                                </Button>
                            </>
                        )}

                        <ShareDialog
                            open={isShareDialogOpen}
                            link={link}
                            onOpen={handleShareClick}
                            onClose={() => setIsShareDialogOpen(false)}
                        />
                    </>
                )}
            </Dialog>

            <UploadTermsDialog
                open={isUploadTermsDialogOpen}
                onAccept={onAccept.current}
                onReject={onReject.current}
            />

            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={isUploadSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setIsUploadSnackbarOpen(false)}
                message="Uploaded"
                action={
                    <IconButton onClick={() => setIsUploadSnackbarOpen(false)} className={classes.snackbarClose}>
                        <CloseIcon/>
                    </IconButton>
                }
            />
        </>
    )
}

export default withBackButtonSupport(ImageDialog, "image")
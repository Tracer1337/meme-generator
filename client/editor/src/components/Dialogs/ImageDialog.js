import React, { useState, useEffect, useContext, useRef } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Button, CircularProgress, Paper, Typography, IconButton, TextField, Snackbar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from "@material-ui/icons/GetApp"
import SaveIcon from "@material-ui/icons/Save"
import LinkIcon from "@material-ui/icons/Link"
import ShareIcon from "@material-ui/icons/Share"
import PublishIcon from "@material-ui/icons/Publish"
import CloseIcon from "@material-ui/icons/Close"

import ShareDialog from "./ShareDialog.js"
import UploadTermsDialog from "./UploadTermsDialog.js"

import { AppContext } from "../../App.js"
import { dataURLToFile } from "../../utils"
import downloadDataURI from "../../utils/downloadDataURI.js"
import uploadImage from "../../utils/uploadImage.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { uploadTemplate, editTemplate, registerTemplateUse, registerStickerUse } from "../../config/api.js"
import { IS_CORDOVA, BASE_ELEMENT_TYPES } from "../../config/constants.js"

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

function ImageDialog({ open, onClose, imageData }) {
    const context = useContext(AppContext)

    const classes = useStyles({ imageData })
    
    const { register, getValues } = useForm()

    // Increase the usage-counter only once
    const isRegistered = useRef(false)
    const onAccept = useRef()
    const onReject = useRef()

    const [link, setLink] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [isUploadTermsDialogOpen, setIsUploadTermsDialogOpen] = useState(false)
    const [isUploadSnackbarOpen, setIsUploadSnackbarOpen] = useState(false)
    const [isStoredSnackbarOpen, setIsStoredSnackbarOpen] = useState(false)
    const [hasCreatedTemplate, setHasCreatedTemplate] = useState(false)
    const [hasStoredImage, setHasStoredImage] = useState(false)

    const isEditingTemplate = !!context.currentTemplate

    const dispatchEvent = (name, detail) => context.event.dispatchEvent(new CustomEvent(name, { detail }))

    const registerUsage = async () => {
        // Register template usage
        if(context.currentTemplate) {
            if (!isRegistered.current) {
                await registerTemplateUse(context.currentTemplate.id)
            }
        }

        // Register sticker usage
        for(let element of context.elements) {
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

    const handleDownloadClick = async () => {
        await downloadDataURI(imageData)

        if (IS_CORDOVA) {
            setIsStoredSnackbarOpen(true)
            setHasStoredImage(true)
        }
        
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

    const handlePublishTemplateClick = async () => {
        if (!getValues("label") || context.rootElement.type !== BASE_ELEMENT_TYPES["IMAGE"]) {
            return
        }

        setIsPublishing(true)

        // Collect image data
        const label = getValues("label")
        const image = dataURLToFile(context.rootElement.image, "image.png")
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
            if(res.status === 200) {
                setHasCreatedTemplate(true)
                setIsUploadSnackbarOpen(true)
            }
        }).finally(() => {
            setIsPublishing(false)
        })
    }

    const handleEditTemplateClick = async () => {
        if(!getValues("label")) {
            return
        }

        setIsPublishing(true)

        // Collect image data
        const label = getValues("label")
        const metaData = {
            textboxes: window.getTextboxes(),
            border: window.getBorder()
        }

        // Create body object
        const body = {
            id: context.currentTemplate.id,
            label,
            meta_data: metaData
        }

        // Upload data
        editTemplate(body).then(res => {
            if (res.status === 200) {
                setHasCreatedTemplate(true)
                setIsUploadSnackbarOpen(true)
            }
        }).finally(() => {
            setIsPublishing(false)
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
                                    fullWidth
                                >
                                    Create Link
                                </Button>

                                {isUploading && <CircularProgress size={24} className={classes.buttonLoader} />}
                            </div>
                        )}

                        {!hasStoredImage && (
                                <Button
                                    startIcon={!IS_CORDOVA ? <DownloadIcon /> : <SaveIcon />}
                                    color="primary"
                                    variant="outlined"
                                    className={classes.spacing}
                                    onClick={handleDownloadClick}
                                >
                                    {!IS_CORDOVA ? "Download" : "Save Image"}
                                </Button>
                        )}

                        {context.password && !hasCreatedTemplate && (
                            <>
                                <TextField
                                    inputRef={register()}
                                    name="label"
                                    label="Label"
                                    className={classes.spacing}
                                    variant="outlined"
                                    defaultValue={context.rootElement.label}
                                />
                                
                                <div className={classes.uploadButtonWrapper}>
                                    <Button
                                        startIcon={<PublishIcon />}
                                        color="primary"
                                        variant="outlined"
                                        onClick={!isEditingTemplate ? handlePublishTemplateClick : handleEditTemplateClick}
                                        disabled={isPublishing}
                                        fullWidth
                                    >
                                        { !isEditingTemplate ? "Publish" : "Update" } Template
                                    </Button>

                                    {isPublishing && <CircularProgress size={24} className={classes.buttonLoader} />}
                                </div>
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

            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={isStoredSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setIsStoredSnackbarOpen(false)}
                message="Stored in gallery"
                action={
                    <IconButton onClick={() => setIsStoredSnackbarOpen(false)} className={classes.snackbarClose}>
                        <CloseIcon />
                    </IconButton>
                }
            />
        </>
    )
}

export default withBackButtonSupport(ImageDialog, "image")
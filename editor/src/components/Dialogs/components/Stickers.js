import React, { useState, useContext, useEffect, useRef } from "react"
import { IconButton, GridList, GridListTile, CircularProgress, Fab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import CloseIcon from "@material-ui/icons/Close"
import AddIcon from "@material-ui/icons/Add"

import { AppContext } from "../../../App.js"
import ConfirmDialog from "../ConfirmDialog.js"

import { getStickers, deleteSticker, uploadSticker } from "../../../utils/API.js"
import importFile from "../../../utils/importFile.js"

const useStyles = makeStyles(theme => ({
    listWrapper: {
        display: "flex",
        justifyContent: "center",
        overflow: "hidden"
    },

    list: {
        maxWidth: 400,
        paddingTop: theme.spacing(1),
        width: "100%"
    },

    tile: {
        cursor: "pointer",
        
        "& div": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    },

    deleteButton: {
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0
    },

    addButton: {
        position: "fixed",
        right: theme.spacing(2),
        bottom: theme.spacing(2)
    }
}))

function InnerTile({ sticker, onDelete }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const image = useRef()

    useEffect(() => {
        if (!image.current) {
            return
        }

        image.current.onload = () => {
            if(!image.current) {
                return
            }

            // Set image dimensions
            if (image.current.naturalWidth >= image.current.naturalHeight) {
                image.current.style.width = "100%"
            } else if (image.current.naturalHeight > image.current.naturalWidth) {
                image.current.style.height = "100%"
            }
        }
    }, [image])
 
    return (
        <>
            <img src={sticker.image_url} alt="Sticker" loading="lazy" ref={image}/>

            {context.password && (
                <IconButton onClick={() => onDelete(sticker)} className={classes.deleteButton}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </>
    )
}

function Stickers({ onLoad }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const currentSticker = useRef({})

    const [stickers, setStickers] = useState()
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const fetchStickers = () => {
        getStickers()
            .then(data => setStickers(data))
    }

    const handleDelete = (sticker) => {
        currentSticker.current = sticker
        setIsConfirmDialogOpen(true)
    }

    const handleConfirmDialogClose = (shouldDelete) => {
        setIsConfirmDialogOpen(false)

        if (shouldDelete) {
            deleteSticker(context.password, currentSticker.current.id)
                .then(fetchStickers)
        }
    }

    const handleClick = (event, sticker) => {
        // Prevent loading when delete icon got clicked
        if (event.target.tagName === "DIV" || event.target.tagName === "IMG") {
            onLoad(sticker)
        }
    }

    const handleAddSticker = async () => {
        // Import image
        const image = await importFile("image/*")

        // Create form data
        const formData = new FormData()
        formData.append("image", image)
        formData.append("password", context.password)

        // Upload image
        await uploadSticker(formData)
        fetchStickers()
    }

    useEffect(() => {
        fetchStickers()
    }, [])

    if (!stickers) {
        return <CircularProgress />
    }

    // Sort by usage => Push most used stickers to the top
    stickers.sort((a, b) => b.amount_uses - a.amount_uses)

    return (
        <div className={classes.listWrapper}>
            <GridList className={classes.list} cols={3}>
                {stickers.map((sticker, i) => (
                    <GridListTile className={classes.tile} onClick={e => handleClick(e, sticker)} key={i}>
                        <InnerTile sticker={sticker} onDelete={handleDelete}/>
                    </GridListTile>    
                ))}
            </GridList>

            <ConfirmDialog
                open={isConfirmDialogOpen}
                onClose={handleConfirmDialogClose}
                content={`Sticker ${currentSticker.current.id} will be deleted`}
            />
            
            <Fab color="secondary" className={classes.addButton} onClick={handleAddSticker}>
                <AddIcon/>
            </Fab>
        </div>
    )
}

export default Stickers
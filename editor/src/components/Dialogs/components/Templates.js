import React, { useState, useContext, useEffect, useRef } from "react"
import { IconButton, GridList, GridListTile, GridListTileBar, CircularProgress, InputBase, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import CloseIcon from "@material-ui/icons/Close"

import { AppContext } from "../../../App.js"
import ConfirmDialog from "../ConfirmDialog.js"

import { getTemplates, deleteTemplate } from "../../../utils/API.js"

const useStyles = makeStyles(theme => ({
    spacer: {
        height: theme.spacing(2)
    },

    searchWrapper: {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
        marginTop: 0,
        padding: "2px 4px",
        display: "flex"
    },

    search: {
        marginLeft: theme.spacing(1),
        flex: 1
    },

    searchClear: {
        padding: theme.spacing(1)
    },
    
    listWrapper: {
        display: "flex",
        justifyContent: "center",
        overflow: "hidden"
    },

    list: {
        maxWidth: 400,
        width: "100%"
    },

    tile: {
        cursor: "pointer"
    },

    tilebar: {
        height: 56
    },

    deleteButton: {
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0
    }
}))

const getSubtitle = (count) => {
    if (count === 1) {
        return "1 Meme Created"
    } else {
        return count + " Memes Created"
    }
}

function Templates({ onLoad }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const currentTemplate = useRef({})

    const [templates, setTemplates] = useState()
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [search, setSearch] = useState("")

    const fetchTemplates = () => {
        getTemplates()
            .then(data => setTemplates(data))
    }

    const handleDeleteClick = (template) => {
        currentTemplate.current = template
        setIsConfirmDialogOpen(true)
    }

    const handleConfirmDialogClose = (shouldDelete) => {
        setIsConfirmDialogOpen(false)

        if (shouldDelete) {
            deleteTemplate(context.password, currentTemplate.current.id)
                .then(fetchTemplates)
        }
    }

    const handleClick = (event, template) => {
        // Prevent loading when delete icon got clicked
        if (event.target.tagName === "DIV" || event.target.tagName === "IMG") {
            onLoad(template)
        }
    }

    const handleSearchChange = event => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    if (!templates) {
        return <CircularProgress />
    }

    // Filter by search string
    const renderTemplates = templates.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase()))

    // Sort by usage => Push most used memes to the top
    renderTemplates.sort((a, b) => b.amount_uses - a.amount_uses)

    return (
        <>
            <div className={classes.spacer}/>

            <Paper variant="outlined" className={classes.searchWrapper}>
                <InputBase value={search} onChange={handleSearchChange} placeholder="Search" className={classes.search} />

                <IconButton onClick={() => setSearch("")} className={classes.searchClear}>
                    <CloseIcon />
                </IconButton>
            </Paper>

            <div className={classes.listWrapper}>
                <GridList cellHeight={150} className={classes.list}>
                    {renderTemplates.map((template, i) => (
                        <GridListTile key={i} className={classes.tile} onClick={e => handleClick(e, template)}>
                            <img src={template.image_url} alt={template.label} loading="lazy" />

                            <GridListTileBar title={template.label} subtitle={getSubtitle(template.amount_uses)} className={classes.tilebar} />

                            {context.password && (
                                <IconButton onClick={() => handleDeleteClick(template)} className={classes.deleteButton}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </GridListTile>
                    ))}
                </GridList>

                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    onClose={handleConfirmDialogClose}
                    content={`The template "${currentTemplate.current.label}" will be deleted`}
                />
            </div>
        </>
    )
}

export default Templates
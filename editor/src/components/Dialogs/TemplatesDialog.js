import React, { useState, useContext, useEffect } from "react"
import { Dialog, AppBar, Toolbar, Typography, IconButton, Slide, GridList, GridListTile, GridListTileBar, InputBase, Paper, CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import { AppContext } from "../../App.js"
import withBackButtonSupport from "../../utils/withBackButtonSupport.js"
import { getTemplates } from "../../utils/API.js"

const useStyles = makeStyles(theme => ({
    body: {
        marginTop: theme.mixins.toolbar.minHeight
    },

    searchWrapper: {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
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
    }
}))

function Templates({ onLoad, search }) {
    const classes = useStyles()

    const [templates, setTemplates] = useState()

    useEffect(() => {
        getTemplates()
            .then(data => setTemplates(data))
    }, [])

    if(!templates) {
        return <CircularProgress/>
    }

    const renderTemplates = templates.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className={classes.listWrapper}>
            <GridList cellHeight={150} className={classes.list}>
                {renderTemplates.map((template, i) => (
                    <GridListTile key={i} onClick={() => onLoad(template)} className={classes.tile}>
                        <img src={template.image_url} alt="Preview" loading="lazy"/>

                        <GridListTileBar title={template.label}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>
})

function TemplatesDialog({ onClose, open }) {
    const context = useContext(AppContext)

    const classes = useStyles()

    const [search, setSearch] = useState("")

    const handleClose = () => {
        setSearch("")
        onClose()
    }

    const handleLoad = template => {
        context.event.dispatchEvent(new CustomEvent("loadTemplate", { detail: { template } }))
        handleClose()
    }

    const handleSearchChange = event => {
        setSearch(event.target.value)
    }

    return (
        <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>

                    <Typography variant="h6">
                        Templates
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className={classes.body}>
                <Paper variant="outlined" className={classes.searchWrapper}>
                    <InputBase value={search} onChange={handleSearchChange} placeholder="Search" className={classes.search}/>

                    <IconButton onClick={() => setSearch("")} className={classes.searchClear}>
                        <CloseIcon/>
                    </IconButton>
                </Paper>

                <Templates onLoad={handleLoad} search={search}/>
            </div>
        </Dialog>
    )
}

export default withBackButtonSupport(TemplatesDialog, "templates")
import React, { useContext } from "react"
import { Dialog, AppBar, Toolbar, Typography, IconButton, Slide, GridList, GridListTile, GridListTileBar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import { AppContext } from "../../App.js"
import templates from "../../config/templates.json"

// Format templates
templates.forEach(template => {
    template.image = require("../../assets/images/templates/" + template.image)
})

const useStyles = makeStyles(theme => ({
    listWrapper: {
        marginTop: theme.mixins.toolbar.minHeight,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden"
    },

    list: {
        maxWidth: 400
    },

    tile: {
        cursor: "pointer"
    }
}))

function Templates({ onLoad }) {
    const classes = useStyles()

    return (
        <div className={classes.listWrapper}>
            <GridList cellHeight={150} className={classes.list}>
                {templates.map((template, i) => (
                    <GridListTile key={i} onClick={() => onLoad(template)} className={classes.tile}>
                        <img src={template.image} alt="Preview" />

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

    const handleLoad = template => {
        context.event.dispatchEvent(new CustomEvent("loadTemplate", { detail: { template } }))
        onClose()
    }

    return (
        <Dialog fullScreen onClose={onClose} open={open} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>

                    <Typography variant="h6">
                        Templates
                    </Typography>
                </Toolbar>
            </AppBar>

            <Templates onLoad={handleLoad}/>
        </Dialog>
    )
}

export default TemplatesDialog
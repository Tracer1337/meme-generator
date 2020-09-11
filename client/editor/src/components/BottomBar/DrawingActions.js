import React, { useContext, useState } from "react"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
import PaletteIcon from "@material-ui/icons/Palette"

import { AppContext } from "../../App.js"
import settingsOptions from "../../config/settings-options.json"

const useStyles = makeStyles(theme => ({
    drawingActions: {
        position: "absolute",
        bottom: theme.mixins.toolbar.minHeight + theme.spacing(2),
        right: theme.spacing(2)
    },

    fab: {
        transition: theme.transitions.create() + " !important"
    }
}))

function DrawingActions() {
    const context = useContext(AppContext)

    const classes = useStyles(context.drawing)

    const [isPaletteOpen, setIsPaletteOpen] = useState(false)

    const handlePaletteOpen = () => {
        setIsPaletteOpen(true)
    }

    const handlePaletteClose = () => {
        setIsPaletteOpen(false)
    }

    const handleColorClick = (color) => {
        context.set({
            drawing: {
                ...context.drawing,
                color
            }
        })

        handlePaletteClose()
    }
    
    return (
        <div className={classes.drawingActions}>
            <SpeedDial
                ariaLabel="Palette"
                hidden={!context.drawing.enabled}
                open={isPaletteOpen}
                icon={<PaletteIcon />}
                onOpen={handlePaletteOpen}
                onClose={handlePaletteClose}
                direction="up"
                classes={{ fab: classes.fab }}
                FabProps={{
                    style: { backgroundColor: context.drawing.color }
                }}
            >
                {Object.entries(settingsOptions.colors).reverse().map(([label, color], i) => (
                    <SpeedDialAction
                        key={i}
                        tooltipTitle={label}
                        icon={<></>}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorClick(color)}
                        FabProps={{
                            style: { backgroundColor: color }
                        }}
                    />
                ))}
            </SpeedDial>
        </div>
    )
}

export default DrawingActions
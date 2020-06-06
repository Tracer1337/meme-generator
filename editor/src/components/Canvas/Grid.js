import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core"

function line(context, x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
}

const useStyles = makeStyles(theme => ({
    canvas: {
        position: "absolute",
        pointerEvents: "none",
        touchAction: "none"
    }
}))

function Grid({ config, canvas, image, border }) {
    const classes = useStyles()

    const grid = useRef()

    const setDimensions = () => {
        const canvasRect = canvas.getBoundingClientRect()

        grid.current.width = canvasRect.width
        grid.current.height = canvasRect.height
    }

    const renderGrid = () => {
        const context = grid.current.getContext("2d")

        context.strokeStyle = config.color

        for(let x = 0; x < grid.current.width; x += config.spacing) {
            line(context, x, 0, x, grid.current.height)
        }

        for(let y = 0; y < grid.current.height; y += config.spacing) {
            line(context, 0, y, grid.current.width, y)
        }
    }

    useEffect(() => {
        if(!canvas) {
            return
        }

        setDimensions()

        renderGrid()
    }, [canvas, config, image, border])

    return (
        <canvas
            ref={grid}
            style={{ display: !config.enabled && "none" }}
            className={classes.canvas}
        />
    )
}

export default Grid
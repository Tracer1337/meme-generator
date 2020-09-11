import React, { useState, useEffect, useRef, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"

import { AppContext } from "../../../App.js"
import useSnapshots from "../../../utils/useSnapshots.js"
import Path from "./Path.js"

const useStyles = makeStyles(theme => ({
    drawingCanvas: {
        position: "absolute",
        top: 0,
        pointerEvents: props => !props.enabled && "none",
        zIndex: 1000
    }
}))

function DrawingCanvas({ canvas, border }) {
    const context = useContext(AppContext)
    
    const classes = useStyles(context.drawing)

    const drawingCanvasRef = useRef()
    const renderContext = useRef()
    const paths = useRef([])
    const currentPath = useRef(new Path())

    const [isDrawing, setIsDrawing] = useState(false)

    const addSnapshot = useSnapshots({
        createSnapshot: () => ({ paths: [...paths.current] }),

        applySnapshot: (snapshot) => {
            paths.current = snapshot.paths
            draw()
        }
    })

    const setDimensions = () => {
        const canvasRect = canvas.getBoundingClientRect()

        drawingCanvasRef.current.width = canvasRect.width
        drawingCanvasRef.current.height = canvasRect.height
    }

    const handleTouchMove = (event) => {
        handleMouseMove(event.touches[0])
    }

    const handleMouseMove = ({ clientX, clientY }) => {
        if (!isDrawing) {
            return
        }

        const canvasRect = canvas.getBoundingClientRect()
        const x = clientX - canvasRect.x
        const y = clientY - canvasRect.y

        currentPath.current.addPoint([x, y])
        draw()
    }

    const handleDrawStart = () => {
        setIsDrawing(true)
        addSnapshot()
    }
    
    const handleDrawEnd = () => {
        paths.current.push(currentPath.current)
        currentPath.current = new Path({ color: context.drawing.color })

        setIsDrawing(false)
    }

    const clearCanvas = () => {
        renderContext.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height)
    }

    const drawPath = () => {
        const context = renderContext.current

        for (let path of paths.current.concat([currentPath.current])) {
            context.beginPath()

            for (let i = 0; i < path.points.length; i++) {
                const [x, y] = path.points[i]

                if (i === 0) {
                    context.moveTo(x, y)
                }

                context.lineTo(x, y)
            }

            context.strokeStyle = path.color
            context.lineWidth = path.width
            context.stroke()
        }
    }

    const draw = () => {
        clearCanvas()
        drawPath()
    }

    useEffect(() => {
        if (!canvas) {
            return
        }
        
        setDimensions()
        draw()

        // eslint-disable-next-line
    }, [canvas?.clientWidth, canvas?.clientHeight, border])

    useEffect(() => {
        currentPath.current.color = context.drawing.color
    }, [context.drawing])

    useEffect(() => {
        const drawingCanvas = drawingCanvasRef.current

        renderContext.current = drawingCanvas.getContext("2d")

        drawingCanvas.addEventListener("touchstart", handleDrawStart)
        drawingCanvas.addEventListener("touchend", handleDrawEnd)
        drawingCanvas.addEventListener("touchcancel", handleDrawEnd)
        drawingCanvas.addEventListener("touchmove", handleTouchMove)
        
        drawingCanvas.addEventListener("mousedown", handleDrawStart)
        drawingCanvas.addEventListener("mouseup", handleDrawEnd)
        drawingCanvas.addEventListener("mousemove", handleMouseMove)
        
        return () => {
            drawingCanvas.removeEventListener("touchstart", handleDrawStart)
            drawingCanvas.removeEventListener("touchmove", handleTouchMove)
            drawingCanvas.removeEventListener("touchend", handleDrawEnd)
            drawingCanvas.removeEventListener("touchcancel", handleDrawEnd)

            drawingCanvas.removeEventListener("mousedown", handleDrawStart)
            drawingCanvas.removeEventListener("mouseup", handleDrawEnd)
            drawingCanvas.removeEventListener("mousemove", handleMouseMove)
        }
    })

    return (
        <canvas
            ref={drawingCanvasRef}
            className={classes.drawingCanvas}
        />
    )
}

export default DrawingCanvas
import React, { useState, useRef, useMemo, useEffect, useContext } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"
import EditIcon from "@material-ui/icons/Edit"

import { AppContext } from "../../../App.js"

import { MAX_SNAPSHOTS } from "../../../config/constants.js"

const padding = 6

const useStyles = makeStyles(theme => {
    const highlight = {
        backgroundColor: "rgba(255, 255, 255, .5)",
        border: "1px solid black",
        borderRadius: theme.shape.borderRadius,
        display: props => props.capture && "none"
    }

    const handle = {
        ...highlight,
        zIndex: 20,
        height: 24,
        position: "absolute",
        cursor: "pointer"
    }

    return {
        container: {
            position: "absolute",
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10
        },

        rotationHandle: {
            ...highlight,
            cursor: "pointer"
        },

        button: {
            ...highlight,
            padding: 0,
            marginLeft: theme.spacing(1),
            color: "black"
        },

        action: {
            position: "absolute",
            transform: "translateY(-100%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: 24
        },

        resizeHandles: {
            position: "absolute",
            height: "100%",
            width: "100%"
        },

        vertical: {
            ...handle,
            top: "100%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },

        horizontal: {
            ...handle,
            top: "50%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
        },

        diagonal: {
            ...handle,
            top: "100%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
        }
    }
})

function makeElement({
    controls,
    defaultValues,
    Child
}) {
    return function Element({ onRemove, handle, grid, canvas, template, id, ...props }) {
        const context = useContext(AppContext)

        const lastRotation = useRef(template?.rotation || 0)
        const container = useRef()
        const childRef = useRef()
        // Store states to be applied on undo
        const snapshots = useRef([])

        const [position, setPosition] = useState({ x: template?.x || 0, y: template?.y || 0 })
        const [rotation, setRotation] = useState(template?.rotation || 0)
        const [height, setHeight] = useState((template?.height && template.height - padding * 2) || defaultValues.height)
        const [width, setWidth] = useState((template?.width && template.width - padding * 2) || defaultValues.width)
        const [capture, setCapture] = useState(false)
        const [isFocused, setIsFocused] = useState(false)
        const [shouldMove, setShouldMove] = useState(true)

        const classes = useStyles({ capture })

        // Set grid for movement drag
        const dragGrid = useMemo(() => {
            if (grid.enabled) {
                if (grid.fixedSize) {
                    // Fixed size
                    return [grid.spacing, grid.spacing]
                } else {
                    // Relative size
                    const cellWidth = canvas.clientWidth / grid.columns
                    const cellHeight = canvas.clientHeight / grid.rows
                    return [cellWidth, cellHeight]
                }
            }
        }, [grid, context.image])
        
        const addSnapshot = () => {
            // Create the new snapshot object
            const newSnapshot = { width, height, position, rotation }
            snapshots.current.push(newSnapshot)

            // Apply size constraint
            if(snapshots.current.length > MAX_SNAPSHOTS) {
                snapshots.current.shift()
            }
        }

        const applySnapshot = (snapshot) => {
            setWidth(snapshot.width)
            setHeight(snapshot.height)
            setPosition(snapshot.position)
            setRotation(snapshot.rotation)
        }

        const handleUndo = () => {
            if(snapshots.current.length === 0) {
                // Remove element if does not come from template
                if(!template) {
                    onRemove(id)
                }
                return
            }

            // Apply snapshot
            const snapshot = snapshots.current.pop()
            applySnapshot(snapshot)
        }

        const getRotationAngle = (event, data) => {
            // Get child center position
            const childRect = childRef.current.getBoundingClientRect()
            const childCenter = {
                x: childRect.x + childRect.width / 2,
                y: childRect.y + childRect.height / 2
            }

            // Calculate new rotation
            const childToMouse = Math.atan2(childCenter.y - data.y, childCenter.x - data.x)
            let newRotation = childToMouse - lastRotation.current

            // Snap to 45°
            if (grid.enabled) {
                newRotation -= newRotation % (Math.PI / 4)
            }

            return newRotation
        }

        const handleRotationStart = (event, data) => {
            lastRotation.current = getRotationAngle(event, data)
        }

        const handleRotationEnd = (event, data) => {
            lastRotation.current = getRotationAngle(event, data)
        }

        const handleRotationDrag = (event, data) => {
            setRotation(getRotationAngle(event, data))
        }

        const calcNewHeight = (data) => {
            // Calculate new delta-y with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
            const angle = -rotation
            const dy = data.deltaX * Math.sin(angle) + data.deltaY * Math.cos(angle)
            const newHeight = height + dy
            setHeight(newHeight)

            if(handle.aspectRatio) {
                const newWidth = newHeight * (1 / handle.aspectRatio)
                setWidth(newWidth)
            }
        }

        const calcNewWidth = (data) => {
            // Calculate new delta-x with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
            const angle = -rotation
            const dx = data.deltaX * Math.cos(angle) - data.deltaY * Math.sin(angle)
            const newWidth = width + dx
            setWidth(width + dx)

            if(handle.aspectRatio) {
                const newHeight = newWidth * handle.aspectRatio
                setHeight(newHeight)
            }
        }

        const handleVerticalDrag = (event, data) => {
            calcNewHeight(data)
        }

        const handleHorizontalDrag = (event, data) => {
            calcNewWidth(data)
        }

        const handleDiagonalDrag = (event, data) => {
            calcNewWidth(data)
            calcNewHeight(data)
        }

        const handleMovementDrag = (event, data) => {
            if (!isFocused) {
                return
            }

            setPosition({
                x: position.x + data.deltaX,
                y: position.y + data.deltaY
            })
        }

        const handleRemoveClicked = () => {
            onRemove(id)
        }

        const handleFocus = () => {
            setIsFocused(true)
        }

        const handleBlur = () => {
            setIsFocused(false)
        }

        const handleToggleMovement = (state = true) => {
            setShouldMove(state)
        }

        const beforeCapturing = () => {
            setCapture(true)
        }

        const afterCapturing = () => {
            setCapture(false)
        }

        const emitAddSnapshot = () => {
            context.event.dispatchEvent(new CustomEvent("addSnapshot"))
        }

        // Expose methods to parent
        if (handle) {
            handle.beforeCapturing = beforeCapturing
            handle.afterCapturing = afterCapturing
        }

        useEffect(() => {
            if (grid.enabled) {
                // Init position in grid
                setPosition({
                    x: position.x - position.x % dragGrid[0],
                    y: position.y - position.y % dragGrid[1]
                })

                // Init width in grid
                const newWidth = width - (width + padding * 2) % dragGrid[0]
                setWidth(newWidth)

                // Init height in grid
                const newHeight = height - (height + padding * 2) % dragGrid[1]
                setHeight(newHeight)
            }
        }, [grid])

        useEffect(() => {
            // Handle click-away event
            const handleClick = (event) => {
                if (isFocused && !container.current.contains(event.target)) {
                    handleBlur()
                }
            }

            window.addEventListener("click", handleClick)
            window.addEventListener("touchstart", handleClick)
            context.event.addEventListener("undo", handleUndo)
            context.event.addEventListener("addSnapshot", addSnapshot)
            
            return () => {
                window.removeEventListener("click", handleClick)
                window.removeEventListener("touchstart", handleClick)
                context.event.removeEventListener("undo", handleUndo)
                context.event.removeEventListener("addSnapshot", addSnapshot)
            }
        })

        useEffect(() => {
            (async () => {
                // Wait until handle received all props
                await new Promise(requestAnimationFrame)

                // Init dimensions
                if (handle.aspectRatio) {
                    if (width) {
                        setHeight(width * handle.aspectRatio)
                    } else if (height) {
                        setWidth(height * (1 / handle.aspectRatio))
                    }
                }
            })()
        }, [])

        return (
            <DraggableCore onDrag={handleMovementDrag} onStart={emitAddSnapshot} grid={dragGrid} handle={`#element-${id}`} disabled={!shouldMove}>
                <div
                    className={classes.container}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`,
                        transformOrigin: `center center`,
                        zIndex: defaultValues.zIndex || 0
                    }}
                    ref={container}
                >
                    <Child
                        id={id}
                        handle={handle}
                        template={template}
                        onFocus={handleFocus}
                        isFocused={isFocused}
                        toggleMovement={handleToggleMovement}
                        dimensions={{ width, height, ...position, rotation }}
                        padding={padding}
                        ref={childRef}
                        {...props}
                    />

                    {isFocused && (
                        // Render controls if the element is focused
                        <>
                            {controls.includes("resize") && (
                                <div className={classes.resizeHandles}>
                                    <DraggableCore onDrag={handleVerticalDrag} onStart={emitAddSnapshot} grid={dragGrid}>
                                        <div className={classes.vertical}>
                                            <HeightIcon />
                                        </div>
                                    </DraggableCore>

                                    <DraggableCore onDrag={handleHorizontalDrag} onStart={emitAddSnapshot} grid={dragGrid}>
                                        <div className={classes.horizontal}>
                                            <HeightIcon />
                                        </div>
                                    </DraggableCore>

                                    <DraggableCore onDrag={handleDiagonalDrag} onStart={emitAddSnapshot} grid={dragGrid}>
                                        <div className={classes.diagonal}>
                                            <HeightIcon />
                                        </div>
                                    </DraggableCore>
                                </div>
                            )}

                            <div className={classes.action}>
                                {controls.includes("rotate") && (
                                    <DraggableCore onStart={(...args) => {
                                        handleRotationStart(...args)
                                        emitAddSnapshot()
                                    }} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                                        <RotateLeftIcon className={classes.rotationHandle} />
                                    </DraggableCore>
                                )}

                                {controls.includes("edit") && (
                                    <IconButton className={classes.button} onClick={handle.onEditClicked}>
                                        <EditIcon />
                                    </IconButton>
                                )}

                                {controls.includes("settings") && (
                                    <IconButton className={classes.button} onClick={handle.onSettingsClicked}>
                                        <SettingsIcon />
                                    </IconButton>
                                )}

                                {controls.includes("remove") && (
                                    <IconButton className={classes.button} onClick={handleRemoveClicked}>
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DraggableCore>
        )
    }
}

export default makeElement
import React, { useState, useRef, useMemo, useEffect } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"
import EditIcon from "@material-ui/icons/Edit"
import CloneIcon from "@material-ui/icons/LibraryAddOutlined"
import FlipToBackIcon from "@material-ui/icons/FlipToBack"
import FlipToFrontIcon from "@material-ui/icons/FlipToFront"

import useSnapshots from "../../../utils/useSnapshots.js"
import { TEXTBOX_PADDING } from "../../../config/constants.js"

const useStyles = makeStyles(theme => {
    const highlight = {
        backgroundColor: theme.palette.common.white,
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
            cursor: "ns-resize"
        },

        horizontal: {
            ...handle,
            top: "50%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            cursor: "ew-resize"
        },

        diagonal: {
            ...handle,
            top: "100%",
            left: "100%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            cursor: "nwse-resize"
        }
    }
})

function makeElement({
    controls,
    defaultValues,
    Child
}) {
    return function Element({ onRemove, onTemporaryRemove, onUndoRemove, onClone, onToFront, onToBack, handle, grid, canvas, data, id, ...props }) {
        const lastRotation = useRef(data.defaultValues?.rotation || 0)
        const container = useRef()
        const childRef = useRef()
        const hasCreatedSnapshot = useRef(false)
        const removedSinceCounter = useRef(0)

        const [position, setPosition] = useState({ x: data.defaultValues?.x || 0, y: data.defaultValues?.y || 0 })
        const [rotation, setRotation] = useState(data.defaultValues?.rotation || 0)
        const [height, setHeight] = useState((data.defaultValues?.height && data.defaultValues.height - TEXTBOX_PADDING * 2) || defaultValues.height)
        const [width, setWidth] = useState((data.defaultValues?.width && data.defaultValues.width - TEXTBOX_PADDING * 2) || defaultValues.width)
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
        }, [grid, canvas.clientWidth, canvas.clientHeight])

        const addSnapshot = useSnapshots({
            createSnapshot: () => {
                if (data.isRemoved) {
                    removedSinceCounter.current++
                }

                return { width, height, position, rotation }
            },

            applySnapshot: (snapshot) => {
                setWidth(snapshot.width)
                setHeight(snapshot.height)
                setPosition(snapshot.position)
                setRotation(snapshot.rotation)

                if (data.isRemoved && removedSinceCounter.current-- === 0) {
                    onUndoRemove(id)
                    removedSinceCounter.current = 0
                }
            },

            onSnapshotsEmpty: () => {
                // Remove element if it does not come from template
                if (!data.fromTemplate && !data.isRemoved) {
                    onRemove(id)
                }
            }
        })

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
            
        const emitResize = () => {
            if(handle.onResize) {
                handle.onResize()
            }
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
            emitResize()
        }

        const handleHorizontalDrag = (event, data) => {
            calcNewWidth(data)
            emitResize()
        }

        const handleDiagonalDrag = (event, data) => {
            calcNewWidth(data)
            calcNewHeight(data)
            emitResize()
        }

        const handleMovementDrag = (event, data) => {
            if(!isFocused) {
                return
            }

            // Add snapshot when dragging starts
            if(!hasCreatedSnapshot.current) {
                addSnapshot()
                hasCreatedSnapshot.current = true
            }

            setPosition({
                x: position.x + data.deltaX,
                y: position.y + data.deltaY
            })
        }

        const handleMovementStop = () => {
            hasCreatedSnapshot.current = false
        }

        const handleTemporaryRemove = () => {
            addSnapshot()
            onTemporaryRemove(id)
        }

        // Expose methods to parent
        if (handle) {
            handle.beforeCapturing = () => setCapture(true)
            handle.afterCapturing = () => setCapture(false)
        }

        useEffect(() => {
            if (grid.enabled) {
                // Init position in grid
                setPosition({
                    x: position.x - position.x % dragGrid[0],
                    y: position.y - position.y % dragGrid[1]
                })

                // Init width in grid
                const newWidth = width - (width + TEXTBOX_PADDING * 2) % dragGrid[0]
                setWidth(newWidth)

                // Init height in grid
                const newHeight = height - (height + TEXTBOX_PADDING * 2) % dragGrid[1]
                setHeight(newHeight)
            }

            // eslint-disable-next-line
        }, [grid])

        useEffect(() => {
            // Handle click-away event
            const handleClick = (event) => {
                if (isFocused && !container.current.contains(event.target)) {
                    setIsFocused(false)
                }
            }

            window.addEventListener("click", handleClick)
            window.addEventListener("touchstart", handleClick)
            
            return () => {
                window.removeEventListener("click", handleClick)
                window.removeEventListener("touchstart", handleClick)
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

            // eslint-disable-next-line
        }, [])

        return (
            <DraggableCore onDrag={handleMovementDrag} onStop={handleMovementStop} grid={dragGrid} handle={`#element-${id}`} disabled={!shouldMove}>
                <div
                    className={`${classes.container} element`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`,
                        transformOrigin: `center center`,
                        display: data.isRemoved && "none"
                    }}
                    ref={container}
                    data-id={id}
                >
                    <Child
                        id={id}
                        handle={handle}
                        onFocus={() => setIsFocused(true)}
                        isFocused={isFocused}
                        toggleMovement={(state = true) => setShouldMove(state)}
                        dimensions={{ width, height, ...position, rotation }}
                        ref={childRef}
                        capture={capture}
                        data={data}
                        {...props}
                    />

                    {isFocused && (
                        // Render controls if the element is focused
                        <>
                            {controls.includes("resize") && (
                                <div className={classes.resizeHandles}>
                                    <DraggableCore onDrag={handleVerticalDrag} onStart={addSnapshot} grid={dragGrid}>
                                        <div className={classes.vertical}>
                                            <HeightIcon />
                                        </div>
                                    </DraggableCore>

                                    <DraggableCore onDrag={handleHorizontalDrag} onStart={addSnapshot} grid={dragGrid}>
                                        <div className={classes.horizontal}>
                                            <HeightIcon />
                                        </div>
                                    </DraggableCore>

                                    <DraggableCore onDrag={handleDiagonalDrag} onStart={addSnapshot} grid={dragGrid}>
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
                                        addSnapshot()
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

                                {controls.includes("clone") && (
                                    <IconButton className={classes.button} onClick={() => onClone(id)}>
                                        <CloneIcon fontSize="small"/>
                                    </IconButton>
                                )}

                                {controls.includes("layers") && (
                                    <IconButton className={classes.button} onClick={() => onToBack(id)}>
                                        <FlipToBackIcon fontSize="small"/>
                                    </IconButton>
                                )}

                                {controls.includes("layers") && (
                                    <IconButton className={classes.button} onClick={() => onToFront(id)}>
                                        <FlipToFrontIcon fontSize="small"/>
                                    </IconButton>
                                )}

                                {controls.includes("remove") && (
                                    <IconButton className={classes.button} onClick={() => handleTemporaryRemove(id)}>
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
import React, { useState, useRef, useMemo, useEffect, useContext } from "react"
import { DraggableCore } from "react-draggable"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RotateLeftIcon from "@material-ui/icons/RotateLeft"
import SettingsIcon from "@material-ui/icons/Settings"
import CloseIcon from "@material-ui/icons/Close"
import HeightIcon from "@material-ui/icons/Height"
import EditIcon from "@material-ui/icons/Edit"

import SettingsDialog from "../Dialogs/SettingsDialog.js"

import { AppContext } from "../../App.js"
import fitText from "../../utils/fitText.js"

const padding = 6
const placeholder = "Enter Text..."

const globalDefaultSettings = {
    color: "black",
    textAlign: "center",
    fontFamily: "'Impact', fantasy",
    backgroundColor: "transparent",
    verticalTextAlign: "center",
    bold: false,
    caps: true
}

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

        input: {
            background: "none",
            border: "none",
            outline: props => !props.capture && props.isFocused ? "1px dashed gray" : "none",
            fontSize: 24,
            color: "white",
            fontFamily: theme.typography.fontFamily,
            textTransform: props => props.settings.caps && "uppercase",
            resize: "none",
            whiteSpace: "pre",
            zIndex: 10,
            padding,
            display: "flex",
            flexDirection: "column",
            justifyContent: props => (
                props.settings.verticalTextAlign === "top" ? "flex-start" :
                props.settings.verticalTextAlign === "bottom" ? "flex-end" :
                props.settings.verticalTextAlign === "center" ? "center" :
                null
            ),

            "&::placeholder": {
                color: "white"
            }
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

function Textbox({ id, onRemove, handle, grid, template, canvas }) {
    const defaultSettings = {...globalDefaultSettings}

    if(template?.settings) {
        for(let key in defaultSettings) {
            if(template.settings[key]) {
                defaultSettings[key] = template.settings[key]
            }
        }
    }

    const context = useContext(AppContext)

    const lastRotation = useRef(template?.rotation || 0)
    const container = useRef()
    const textboxRef = useRef()

    const [value, setValue] = useState(placeholder)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [settings, setSettings] = useState(defaultSettings)
    const [position, setPosition] = useState({ x: template?.x || 0, y: template?.y || 0 })
    const [rotation, setRotation] = useState(template?.rotation || 0)
    const [height, setHeight] = useState((template?.height && template.height - padding * 2) || 24)
    const [width, setWidth] = useState((template?.width && template.width - padding * 2) || 160)
    const [capture, setCapture] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const classes = useStyles({ capture, settings, isFocused })

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

    const getRotationAngle = (event, data) => {
        // Get textbox center position
        const textbox = textboxRef.current.getBoundingClientRect()
        const textboxCenter = {
            x: textbox.x + textbox.width / 2,
            y: textbox.y + textbox.height / 2
        }

        // Calculate new rotation
        const textboxToMouse = Math.atan2(textboxCenter.y - data.y, textboxCenter.x - data.x)
        let newRotation = textboxToMouse - lastRotation.current

        // Snap to 45°
        if(grid.enabled) {
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
        setHeight(height + dy)
    }

    const calcNewWidth = (data) => {
        // Calculate new delta-x with the following rotation matrix: https://en.wikipedia.org/wiki/Rotation_matrix
        const angle = -rotation
        const dx = data.deltaX * Math.cos(angle) - data.deltaY * Math.sin(angle)
        setWidth(width + dx)
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
        if(!isFocused) {
            return
        }
        
        setPosition({
            x: position.x + data.deltaX,
            y: position.y + data.deltaY
        })
    }

    const handleSettingsClicked = () => {
        setDialogOpen(true)
    }

    const handleSettingsApply = values => {
        if(values) {
            setSettings(values)
        }
        setDialogOpen(false)
    }

    const handleRemoveClicked = () => {
        onRemove(id)
    }

    const handleEditClicked = () => {
        const handleFocusOut = () => {
            setIsEditing(false)
            textboxRef.current.removeEventListener("focusout", handleFocusOut)
        }
        textboxRef.current.addEventListener("focusout", handleFocusOut)

        textboxRef.current.focus()
        setIsEditing(true)


        // Clear the placeholder
        if(value.toLowerCase() === placeholder.toLowerCase()) {
            textboxRef.current.textContent = ""
            setValue("")
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)

        // Insert placeholder if textbox is empty
        if(!value) {
            setValue(placeholder)
            textboxRef.current.textContent = placeholder
        }
    }

    const handleValueChange = (event) => {
        const newValue = event.target.textContent
        setValue(newValue)
    }

    const beforeCapturing = () => {
        setCapture(true)
    }

    const afterCapturing = () => {
        setCapture(false)
    }

    const toObject = ({ image }) => {
        const toPercentage = (value, useWidth = false) => value / (useWidth ? image.clientWidth : image.clientHeight) * 100 + "%"

        const changedSettings = {}
        for(let key in settings) {
            if(settings[key] !== defaultSettings[key]) {
                changedSettings[key] = settings[key]
            }
        }

        return {
            width: toPercentage(width + padding * 2, true),
            height: toPercentage(height + padding * 2),
            x: toPercentage(position.x, true),
            y: toPercentage(position.y),
            rotation,
            settings: changedSettings
        }
    }

    // Expose methods for parent
    if(handle) {
        handle.beforeCapturing = beforeCapturing
        handle.afterCapturing = afterCapturing
        handle.toObject = toObject
    }

    // Generate stylings for textbox
    const styles = useMemo(() => ({
        ...settings,
        width: width + "px",
        height: height + "px",
        fontSize: fitText({ width, height, styles: settings, text: value }),
        fontWeight: settings.bold ? "bold" : null
    }), [value, settings, height, width])

    useEffect(() => {
        if(grid.enabled) {
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
            if(isFocused && !container.current.contains(event.target)) {
                handleBlur()
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
        // Set initial value
        textboxRef.current.textContent = value
    }, [])

    return (
        <DraggableCore onDrag={handleMovementDrag} grid={dragGrid} handle={`#textbox-${id}`} disabled={isEditing}>
            <div 
                className={classes.container}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}rad)`,
                    transformOrigin: `center center`
                }}
                ref={container}
            >
                <div
                    contentEditable
                    id={`textbox-${id}`}
                    className={classes.input}
                    style={styles}
                    ref={textboxRef}
                    onClick={handleFocus}
                    onTouchStart={handleFocus}
                    onInput={handleValueChange}
                />

                {isFocused && (
                    // Render controls if the textbox is focused
                    <>
                        <div className={classes.resizeHandles}>
                            <DraggableCore onDrag={handleVerticalDrag} grid={dragGrid}>
                                <div className={classes.vertical}>
                                    <HeightIcon />
                                </div>
                            </DraggableCore>

                            <DraggableCore onDrag={handleHorizontalDrag} grid={dragGrid}>
                                <div className={classes.horizontal}>
                                    <HeightIcon />
                                </div>
                            </DraggableCore>

                            <DraggableCore onDrag={handleDiagonalDrag} grid={dragGrid}>
                                <div className={classes.diagonal}>
                                    <HeightIcon />
                                </div>
                            </DraggableCore>
                        </div>

                        <div className={classes.action}>
                            <DraggableCore onStart={handleRotationStart} onStop={handleRotationEnd} onDrag={handleRotationDrag}>
                                <RotateLeftIcon className={classes.rotationHandle} />
                            </DraggableCore>

                            <IconButton className={classes.button} onClick={handleEditClicked}>
                                <EditIcon />
                            </IconButton>

                            <IconButton className={classes.button} onClick={handleSettingsClicked}>
                                <SettingsIcon />
                            </IconButton>

                            <IconButton className={classes.button} onClick={handleRemoveClicked}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </>
                )}

                <SettingsDialog open={dialogOpen} onClose={handleSettingsApply} values={settings} text={value}/>
            </div>
        </DraggableCore>
    )
}

export default Textbox
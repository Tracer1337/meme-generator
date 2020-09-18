import React, { useState, useEffect, useRef, useContext } from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"

import Image from "./Image.js"
import Blank from "./Blank.js"
import BaseElementsDialog from "../../Dialogs/BaseElementsDialog.js"
import { AppContext } from "../../../App.js"
import { BASE_ELEMENT_TYPES } from "../../../config/constants.js"

const HANDLE_WIDTH = 16

const elementsMap = {
    [BASE_ELEMENT_TYPES["IMAGE"]]: Image,
    [BASE_ELEMENT_TYPES["BLANK"]]: Blank
}

const useStyles = makeStyles(theme => {
    const handle = {
        backgroundColor: theme.palette.common.white,
        position: "absolute",
        opacity: .5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
    }

    const child = {
        position: "absolute"
    }

    return {
        baseElement: {
            position: "relative"
        },

        handles: {
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%"
        },

        handleIcon: {
            fontSize: HANDLE_WIDTH
        },

        handleTop: {
            ...handle,
            width: "100%", height: HANDLE_WIDTH,
            left: 0, top: -HANDLE_WIDTH
        },

        handleRight: {
            ...handle,
            width: HANDLE_WIDTH, height: "100%",
            right: -HANDLE_WIDTH, top: 0
        },

        handleBottom: {
            ...handle,
            width: "100%", height: HANDLE_WIDTH,
            left: 0, bottom: -HANDLE_WIDTH
        },

        handleLeft: {
            ...handle,
            width: HANDLE_WIDTH, height: "100%",
            left: -HANDLE_WIDTH, top: 0
        },

        child0: {
            ...child,
            left: 0, top: 0,
            transform: "translateY(-100%)"
        },
        
        child1: {
            ...child,
            right: 0, top: 0,
            transform: "translateX(100%)"
        },

        child2: {
            ...child,
            left: 0, bottom: 0,
            transform: "translateY(100%)"
        },

        child3: {
            ...child,
            left: 0, top: 0,
            transform: "translatex(-100%)"
        }
    }
})

function Element({ className, baseElement, handle }) {
    const context = useContext(AppContext)

    const onReceiveBaseElement = useRef(() => {})
    const onDialogClose = useRef(() => {})
    const containerRef = useRef()
    const elementRef = useRef()
    const childHandles = useRef({})

    for (let index in baseElement.childElements) {
        childHandles.current[index] = {}
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const classes = useStyles()

    const handleCreateBaseElement = async (index) => {
        let newBaseElement

        try {
            await new Promise((resolve, reject) => {
                onReceiveBaseElement.current = (element) => {
                    newBaseElement = element
                    resolve()
                }

                onDialogClose.current = () => {
                    setIsDialogOpen(false)
                    reject()
                }

                setIsDialogOpen(true)
            })
        } catch {
            return
        }

        baseElement.setChildElement(newBaseElement, index)
        newBaseElement.setParent(baseElement, index)

        context.set({ rootElement: context.rootElement })
        
        context.event.dispatchEvent(new CustomEvent("resetBaseDimensions"))

        setIsDialogOpen(false)
    }

    const handleGetPath = (side = 0) => {
        const path = [{ side, element: baseElement }]

        for (let index in childHandles.current) {
            const ref = childHandles.current[index]
            path.push(ref.getPath(parseInt(index)))
        }

        return path.flat()
    }

    useEffect(() => {
        const setDimensions = () => {
            baseElement.setDimensions({
                r: elementRef.current.getRatio()
            })
        }

        const { element } = elementRef.current

        if (element.tagName === "IMG") {
            if (element.complete) {
                setDimensions()
            }

            element.addEventListener("load", setDimensions, { once: true })
        } else {
            setDimensions()
        }
    }, [baseElement, elementRef])

    useEffect(() => {
        if (handle) {
            Object.assign(handle, elementRef.current)
            handle.getPath = handleGetPath
            handle.setDimensions = ({ width, height }) => {
                containerRef.current.style.width = width + "px"
                containerRef.current.style.height = height + "px"
                elementRef.current.element.style.width = width + "px"
                elementRef.current.element.style.height = height + "px"
            }
            handle.transform = ({ x, y }) => {
                containerRef.current.style.transform = `translate(${x}px, ${y}px)`
            }
        }
    })

    useEffect(() => {
        baseElement.handle = handle
    })

    return (
        <div className={clsx(classes.baseElement, className)} ref={containerRef}>
            { React.createElement(elementsMap[baseElement.type], {
                ref: elementRef,
                className: "base-element",
                draggable: "false",
                baseElement
            }) }

            <div className={classes.handles} data-hide-on-capture>
                {!baseElement.hasConnection(0) && (
                    <div className={classes.handleTop} onClick={() => handleCreateBaseElement(0)}>
                        <AddIcon className={classes.handleIcon} />
                    </div>
                )}

                {!baseElement.hasConnection(1) && (
                    <div className={classes.handleRight} onClick={() => handleCreateBaseElement(1)}>
                        <AddIcon className={classes.handleIcon} />
                    </div>
                )}

                {!baseElement.hasConnection(2) && (
                    <div className={classes.handleBottom} onClick={() => handleCreateBaseElement(2)}>
                        <AddIcon className={classes.handleIcon} />
                    </div>
                )}

                {!baseElement.hasConnection(3) && (
                    <div className={classes.handleLeft} onClick={() => handleCreateBaseElement(3)}>
                        <AddIcon className={classes.handleIcon} />
                    </div>
                )}
            </div>

            <div>
                { Object.entries(baseElement.childElements).map(([index, childElement]) => (
                    <Element
                        key={index}
                        baseElement={childElement}
                        handle={childHandles.current[index]}
                        className={classes["child" + index]}
                    />
                )) }
            </div>

            <BaseElementsDialog
                open={isDialogOpen}
                onClose={onDialogClose.current}
                onCreateBaseElement={onReceiveBaseElement.current}
            />
        </div>
    )
}

export default Element
import React, { useState, useRef, useContext } from "react"
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

const useStyles = makeStyles(theme => ({
    baseElement: {
        position: "relative"
    },

    handles: {
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%",

        "& > div": {
            backgroundColor: theme.palette.common.white,
            position: "absolute",
            opacity: .5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer"
        }
    },

    handleIcon: {
        fontSize: HANDLE_WIDTH
    },

    handleTop: {
        width: "100%", height: HANDLE_WIDTH,
        left: 0, top: -HANDLE_WIDTH
    },

    handleRight: {
        width: HANDLE_WIDTH, height: "100%",
        right: -HANDLE_WIDTH, top: 0
    },

    handleBottom: {
        width: "100%", height: HANDLE_WIDTH,
        left: 0, bottom: -HANDLE_WIDTH
    },

    handleLeft: {
        width: HANDLE_WIDTH, height: "100%",
        left: -HANDLE_WIDTH, top: 0
    },
}))

function Element({ baseElement, handle }) {
    const context = useContext(AppContext)

    const onReceiveBaseElement = useRef(() => {})
    const onDialogClose = useRef(() => {})
    const childRefs = useRef({})

    for (let index in baseElement.childElements) {
        childRefs.current[index] = {}
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
        
        context.rootElement.findElement(baseElement).setChildElement(index, newBaseElement)
        context.set({ rootElement: context.rootElement })
        setIsDialogOpen(false)
    }

    return (
        <div className={classes.baseElement}>
            { React.createElement(elementsMap[baseElement.type], {
                handle,
                className: "base-element",
                draggable: "false",
                baseElement
            }) }

            <div className={classes.handles}>
                <div className={classes.handleTop} onClick={() => handleCreateBaseElement(0)}>
                    <AddIcon className={classes.handleIcon}/>
                </div>

                <div className={classes.handleRight} onClick={() => handleCreateBaseElement(1)}>
                    <AddIcon className={classes.handleIcon}/>
                </div>

                <div className={classes.handleBottom} onClick={() => handleCreateBaseElement(2)}>
                    <AddIcon className={classes.handleIcon}/>
                </div>

                <div className={classes.handleLeft} onClick={() => handleCreateBaseElement(3)}>
                    <AddIcon className={classes.handleIcon}/>
                </div>
            </div>

            <div>
                { Object.entries(baseElement.childElements).map(([index, childElement]) => (
                    <div data-index={index} key={index}>
                        <Element baseElement={childElement} handle={childRefs[index]} />
                    </div>
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
import React, { useState, useEffect, useContext } from "react"
import { Paper } from "@material-ui/core"

import { AppContext } from "../../App.js"
import BaseElements from "../Dialogs/components/BaseElements.js"
import BaseElementsDialog from "../Dialogs/BaseElementsDialog.js"
import BaseElement from "../../Models/BaseElement.js"
import { BASE_ELEMENT_TYPES } from "../../config/constants.js"
import { createListeners } from "../../utils"

function Base(props, ref) {
    const context = useContext(AppContext)

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleBaseElementCreate = (baseElement) => {
        context.event.dispatchEvent(new CustomEvent("resetCanvas"))

        context.set({
            currentTemplate: null,
            isEmptyState: false,
            elements: [],
            rootElement: baseElement
        })
    }

    useEffect(() => {
        return createListeners(context.event, [
            ["openBaseSelection", () => setIsDialogOpen(true)]
        ])
    })

    useEffect(() => {
        // Handle image injection from chrome extension
        const handleMessage = (message) => {
            if (message.data.image) {
                handleBaseElementCreate(new BaseElement({
                    type: BASE_ELEMENT_TYPES["IMAGE"],
                    image: message.data.image,
                    label: message.data.label
                }))
            }
        }

        return createListeners(window, [
            ["message", handleMessage]
        ])
    })

    const sharedProps = {
        ref,
        className: "base-element",
        draggable: "false"
    }
    
    let baseElement

    if (context.rootElement?.type === BASE_ELEMENT_TYPES["IMAGE"]) {
        baseElement = (
            <img
                alt=""
                src={context.rootElement.image}
                {...sharedProps}
            />
        )
    } else if (context.rootElement?.type === BASE_ELEMENT_TYPES["BLANK"]) {
        baseElement = (
            <div
                {...sharedProps}
            />
        )
    } else {
        baseElement = (
            <Paper>
                <BaseElements onBaseElementCreate={handleBaseElementCreate} />
            </Paper>
        )
    }

    return (
        <>
            { baseElement }

            <BaseElementsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onBaseElementCreate={handleBaseElementCreate}
            />
        </>
    )
}

export default React.forwardRef(Base)
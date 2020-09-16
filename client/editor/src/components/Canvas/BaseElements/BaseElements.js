import React, { useState, useEffect, useRef, useContext, useImperativeHandle } from "react"

import EmptyState from "../EmptyState.js"
import Element from "./Element.js"
import BaseElementsDialog from "../../Dialogs/BaseElementsDialog.js"

import { AppContext } from "../../../App.js"
import BaseElement from "../../../Models/BaseElement.js"
import { BASE_ELEMENT_TYPES } from "../../../config/constants.js"
import { createListeners } from "../../../utils"

function Base(props, ref) {
    const context = useContext(AppContext)

    const rootHandle = useRef({})

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const setRootElement = (baseElement) => {
        context.set({
            currentTemplate: null,
            isEmptyState: false,
            elements: [],
            rootElement: baseElement
        })
    }

    const handleCreateBaseElement = (baseElement) => {
        context.event.dispatchEvent(new CustomEvent("resetCanvas"))
        setRootElement(baseElement)
        setIsDialogOpen(false)
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
                setRootElement(new BaseElement({
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

    useImperativeHandle(ref, () => rootHandle.current)

    return (
        <>
            { context.rootElement ? <Element baseElement={context.rootElement} handle={rootHandle} /> : <EmptyState/> }

            <BaseElementsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCreateBaseElement={handleCreateBaseElement}
            />
        </>
    )
}

export default React.forwardRef(Base)
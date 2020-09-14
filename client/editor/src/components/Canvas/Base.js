import React, { useState, useEffect, useContext } from "react"

import EmptyState from "./EmptyState.js"
import BaseElementsDialog from "../Dialogs/BaseElementsDialog.js"

import { AppContext } from "../../App.js"
import BaseElement from "../../Models/BaseElement.js"
import { BASE_ELEMENT_TYPES } from "../../config/constants.js"
import { createListeners, importFile, fileToImage } from "../../utils"

function Base(props, ref) {
    const context = useContext(AppContext)

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleImportImage = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)

        context.event.dispatchEvent(new CustomEvent("resetCanvas"))

        context.set({
            currentTemplate: null,
            isEmptyState: false,
            rootElement: new BaseElement({
                type: BASE_ELEMENT_TYPES["IMAGE"],
                image: base64Image
            })
        })
    }

    const handleCreateBaseBlank = () => {
        context.event.dispatchEvent(new CustomEvent("resetCanvas"))
        
        context.set({
            currentTemplate: null,
            isEmptyState: false,
            rootElement: new BaseElement({
                type: BASE_ELEMENT_TYPES["BLANK"]
            })
        })
    }
    
    useEffect(() => {
        return createListeners(context.event, [
            ["openBaseSelection", () => setIsDialogOpen(true)]
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
        baseElement = <EmptyState/>
    }

    return (
        <>
            { baseElement }

            <BaseElementsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onImportImage={handleImportImage}
                onCreateBaseBlank={handleCreateBaseBlank}
            />
        </>
    )
}

export default React.forwardRef(Base)
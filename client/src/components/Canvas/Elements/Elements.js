import React, { useEffect, useRef, useContext, useImperativeHandle } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Textbox from "./Textbox.js"
import Sticker from "./Sticker.js"
import Rectangle from "./Rectangle.js"
import Element from "../../../Models/Element.js"
import { ELEMENT_TYPES } from "../../../config/constants.js"
import { createListeners, fileToImage, importFile } from "../../../utils"
import { AppContext } from "../../../App.js"
import useSnapshots from "../../../utils/useSnapshots.js"

const useStyles = makeStyles(theme => ({
    elements: {
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: props => props.context.editor.isEmptyState && "none"
    }
}))

function Elements({ base, grid, canvas }, ref) {
    const context = useContext(AppContext)

    const classes = useStyles({ context })

    const idCounter = useRef(0)
    const elementRefs = useRef({})

    elementRefs.current = {}
    for (let element of context.editor.model.elements) {
        elementRefs.current[element.id] = {}
    }

    const addSnapshot = useSnapshots({
        createSnapshot: () => ({ elements: [...context.editor.model.elements] }),

        applySnapshot: (snapshot) => {
            context.set({ editor: { model: { elements: snapshot.elements } } })
        }
    })

    const addElement = (element) => {
        context.set({ editor: { model: { elements: [...context.editor.model.elements, element] } } })
    }

    const setElements = (elements) => {
        context.set({ editor: { model: { elements } } })
    }

    const handleRemoveElement = (elementId) => {
        const newElements = context.editor.model.elements.filter(({ id }) => id !== elementId)
        setElements(newElements)
    }

    const handleTemporaryRemoveElement = (elementId) => {
        const element = context.editor.model.elements.find(({ id }) => id === elementId)
        element.data.isRemoved = true
        setElements([...context.editor.model.elements])
    }

    const handleUndoRemoveElement = (elementId) => {
        const element = context.editor.model.elements.find(({ id }) => id === elementId)
        element.data.isRemoved = false
        setElements([...context.editor.model.elements])
    }

    const handleCloneElement = (elementId) => {
        const element = context.editor.model.elements.find(({ id }) => id === elementId)

        const newElement = createNewElement(element.type, {
            defaultValues: elementRefs.current[element.id].getValues()
        })

        context.set({
            editor: {
                focus: { element: newElement },
                model: { elements: [...context.editor.model.elements, newElement] }
            }
        })
    }

    const handleToFront = (elementId) => {
        addSnapshot()
        const index = context.editor.model.elements.findIndex(({ id }) => id === elementId)
        const element = context.editor.model.elements.splice(index, 1)[0]
        setElements([...context.editor.model.elements, element])
    }
    
    const handleToBack = (elementId) => {
        addSnapshot()
        const index = context.editor.model.elements.findIndex(({ id }) => id === elementId)
        const element = context.editor.model.elements.splice(index, 1)[0]
        setElements([element, ...context.editor.model.elements])
    }

    const handleFocus = (elementId) => {
        const element = context.editor.model.elements.find(({ id }) => id === elementId)
        const controls = elementRefs.current[elementId].getControls()
        
        context.set({ editor: { focus: { element, controls } } })
    }

    const handleBlur = () => {
        context.set({ editor: { focus: null } })
    }

    const createNewElement = (type, data = {}) => {
        const newElement = new Element({
            type,
            data,
            id: idCounter.current++
        })

        return newElement
    }

    const handleAddTextbox = ({ data }) => {
        addElement(createNewElement(ELEMENT_TYPES["TEXTBOX"], data))
    }

    const handleAddRectangle = () => {
        addElement(createNewElement(ELEMENT_TYPES["RECTANGLE"]))
    }

    const addSticker = (src, id) => {
        addElement(createNewElement(ELEMENT_TYPES["STICKER"], { src, id }))
    }

    const handleImportSticker = async () => {
        const file = await importFile("image/*")
        const base64Image = await fileToImage(file)
        addSticker(base64Image)
    }

    const handleLoadSticker = ({ sticker }) => {
        addSticker(sticker.image_url, sticker.id)
    }

    const handleAccessElements = () => {
        context.editor.model.elements.forEach(element => {
            Object.assign(element.data, elementRefs.current[element.id].toObject({ image: base }))
        })
    }

    const beforeCapturing = () => {
        Object.values(elementRefs.current).forEach(element => element.beforeCapturing())
    }

    const afterCapturing = () => {
        Object.values(elementRefs.current).forEach(element => element.afterCapturing())
    }

    useEffect(() => {
        return createListeners(context, [
            ["importSticker", handleImportSticker],
            ["addTextbox", handleAddTextbox],
            ["addRectangle", handleAddRectangle],
            ["loadSticker", handleLoadSticker],
            ["accessElements", handleAccessElements]
        ])
    })

    useImperativeHandle(ref, () => ({
        createId: () => idCounter.current++,
        beforeCapturing,
        afterCapturing
    }))

    return (
        <div className={classes.elements}>
            {context.editor.model.elements.map(({ type, id, data }) => {
                const props = {
                    key: id, id, data, grid, canvas,
                    onRemove: handleRemoveElement,
                    onTemporaryRemove: handleTemporaryRemoveElement,
                    onUndoRemove: handleUndoRemoveElement,
                    onClone: handleCloneElement,
                    onToFront: handleToFront,
                    onToBack: handleToBack,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    isFocused: context.editor.focus?.element.id === id,
                    handle: elementRefs.current[id]
                }

                if (type === ELEMENT_TYPES["TEXTBOX"]) {
                    return (
                        <Textbox {...props} />
                    )
                } else if (type === ELEMENT_TYPES["STICKER"]) {
                    return (
                        <Sticker {...props} />
                    )
                } else if (type === ELEMENT_TYPES["RECTANGLE"]) {
                    return (
                        <Rectangle {...props} />
                    )
                } else {
                    return null
                }
            })}
        </div>
    )
}

export default React.forwardRef(Elements)
import React, { useState, useEffect, useRef, useContext, useImperativeHandle } from "react"

import EmptyState from "../EmptyState.js"
import Element from "./Element.js"
import BaseElementsDialog from "../../Dialogs/BaseElementsDialog.js"

import { AppContext } from "../../../App.js"
import BaseElement from "../../../Models/BaseElement.js"
import { BASE_ELEMENT_TYPES } from "../../../config/constants.js"
import { createListeners } from "../../../utils"

function Base({ canvas }, ref) {
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

    const getNormalizedSize = () => {
        const path = rootHandle.current.getPath()
        
        let minX = 0, maxX = 0
        let minY = 0, maxY = 0

        for (let i = 0; i < path.length; i++) {
            const { side, element } = path[i]

            if (i === 0) {
                maxX = element.x + element.width
                maxY = element.y + element.height
                continue
            }

            switch (side) {
                case 0:
                    const newMinY = element.y
                    if (newMinY < minY) {
                        minY = newMinY
                    }
                    break

                case 1:
                    const newMaxX = element.x + element.width
                    if (newMaxX > maxX) {
                        maxX = newMaxX
                    }
                    break

                case 2:
                    const newMaxY = element.y + element.height
                    if (newMaxY > maxY) {
                        maxY = newMaxY
                    }
                    break

                case 3:
                    const newMinX = element.x
                    if (newMinX < minX) {
                        minX = newMinX
                    }
                    break

                default: break
            }
        }

        const width = maxX - minX
        const height = maxY - minY

        return { width, height }
    }

    const getRectangle = () => {
        if (!canvas) {
            return
        }
        
        const nodes = Array.from(document.querySelectorAll(".base-element"))
        const canvasRect = canvas.getBoundingClientRect()

        let minX = 0, maxX = 0, minY = 0, maxY = 0

        for (let node of nodes) {
            const rect = node.getBoundingClientRect()

            const x = rect.x - canvasRect.x
            const y = rect.y - canvasRect.y

            if (x < minX) minX = x
            if (x + rect.width > maxX) maxX = x + rect.width
            if (y < minY) minY = y
            if (y + rect.height > maxY) maxY = y + rect.height
        }

        return { minX, maxX, minY, maxY }
    }

    const getBoundingClientRect = () => {
        const normalizedSize = getNormalizedSize()
        const rectangle = getRectangle()

        const width = rectangle.maxX - rectangle.minX
        const height = rectangle.maxY - rectangle.minY

        return {
            normalizedWidth: normalizedSize.width,
            normalizedHeight: normalizedSize.height,
            width, height, 
            ...rectangle
        }
    }

    const handleGetRatio = () => {
        if (!rootHandle.current.getPath) {
            return
        }
        
        const { width, height } = getNormalizedSize()

        const ratio = width / height

        return ratio
    }

    const handleSetDimensions = (newDimensions) => {
        const rect = getBoundingClientRect()

        for (let { element } of rootHandle.current.getPath()) {
            const newWidth = element.width / rect.normalizedWidth * newDimensions.width
            const newHeight = element.height / rect.normalizedHeight * newDimensions.height
            element.handle.setDimensions({ width: newWidth, height: newHeight })    
        }

        rootHandle.current.transform({ x: -rect.minX, y: -rect.minY })
    }

    useEffect(() => {
        return createListeners(context.event, [
            ["openBaseSelection", () => setIsDialogOpen(true)]
        ])
    })

    // Handle image injection from chrome extension
    useEffect(() => {
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

    useEffect(() => {
        context.event.dispatchEvent(new CustomEvent("resetBaseDimensions"))
    })

    useEffect(() => {
        if (context.rootElement) {
            context.rootElement.handle = rootHandle.current
        }
    }, [rootHandle, context.rootElement])

    useImperativeHandle(ref, () => ({
        getRatio: handleGetRatio,
        setDimensions: handleSetDimensions,
        rootElement: rootHandle.current.element,
        get ready() {
            return !!rootHandle.current.element
        }
    }))

    return (
        <>
            { context.rootElement ? <Element baseElement={context.rootElement} handle={rootHandle.current} /> : <EmptyState/> }

            <BaseElementsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCreateBaseElement={handleCreateBaseElement}
            />
        </>
    )
}

export default React.forwardRef(Base)
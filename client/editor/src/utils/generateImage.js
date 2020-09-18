import html2canvas from "html2canvas"

import { TEXTBOX_PADDING } from "../config/constants.js"

function beforeCapturing(clonedDocument) {
    /**
     * Compensate down shifting
     */
    const textboxes = clonedDocument.querySelectorAll(".textbox")
    const padding = TEXTBOX_PADDING

    textboxes.forEach(textbox => {
        const shiftOffset = Math.min(textbox.offsetHeight / 18, padding)
        textbox.style.padding = `${padding - shiftOffset}px ${padding}px ${padding + shiftOffset}px`
    })

    /**
     * Compensate font error
     */
    textboxes.forEach(textbox => {
        textbox.style.fontFeatureSettings = '"liga" 0'
    })

    /**
     * Reverse order of elements
     */
    const elements = Array.from(clonedDocument.querySelectorAll(".element"))
    if (elements.length > 0) {
        const parent = elements[0].parentNode
        elements
            .map(node => parent.removeChild(node))
            .reverse()
            .map(node => parent.appendChild(node))
    }

    /**
     * Remove white border
     */
    const image = clonedDocument.querySelector(".base-element")
    image.style.minWidth = (image.clientWidth + 1) + "px"
    image.style.minHeight = (image.clientHeight + 1) + "px"

    /**
     * Hide tagged elements
     */
    const hiddenElements = Array.from(clonedDocument.querySelectorAll("[data-hide-on-capture]"))
    hiddenElements.forEach(element => element.style.display = "hidden")
}

async function generateImage(container) {
    const canvas = await html2canvas(container, {
        useCORS: true,
        onclone: beforeCapturing
    })

    return canvas.toDataURL()
}

export default generateImage
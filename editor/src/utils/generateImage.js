import html2canvas from "html2canvas"

import { TEXTBOX_PADDING } from "../config/constants.js"

function compensateError(clonedDocument) {
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
     * Reverse order of elements
     */
    const elements = Array.from(clonedDocument.querySelectorAll(".element"))
    const parent = elements[0].parentNode
    elements
        .map(node => parent.removeChild(node))
        .reverse()
        .map(node => parent.appendChild(node))
}

async function generateImage(container) {
    const canvas = await html2canvas(container, {
        useCORS: true,
        onclone: compensateError
    })

    return canvas.toDataURL()
}

export default generateImage
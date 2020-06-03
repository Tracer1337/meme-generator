function renderCanvasInNewWindow(canvas) {
    const newWindow = window.open("", "canvas", `width=${canvas.width + 20},height=${canvas.height + 20}`)
    newWindow.document.body.appendChild(canvas)
}

export default function generateImage({ imageElement, textboxes }) {
    // Get image size
    const imageRect = imageElement.getBoundingClientRect()
    const width = imageRect.width
    const height = imageRect.height

    // Create canvas
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")

    // Draw image
    context.drawImage(imageElement, 0, 0, width, height)

    // Draw texts on image
    for(let textbox of textboxes) {
        context.font = `${textbox.fontSize} Roboto`
        context.fillStyle = textbox.color
        context.fillText(textbox.content, textbox.position.x, textbox.position.y)
    }
    
    // Return result as image
    return new Promise(resolve => {
        const result = new Image(width, height)
        result.onload = () => resolve(result)
        result.src = canvas.toDataURL()
    })
}
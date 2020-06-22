async function format({ dimensions, textboxes, stickers }) {
    const percentageToPixel = (percentage, attribute = "width") => {
        return parseFloat(percentage) / 100 * dimensions[attribute]
    }

    // Format textboxes
    textboxes.forEach(textbox => {
        // Convert percentages to pixel values
        textbox.width = percentageToPixel(textbox.width, "width")
        textbox.height = percentageToPixel(textbox.height, "height")
        textbox.x = percentageToPixel(textbox.x, "width")
        textbox.y = percentageToPixel(textbox.y, "height")
        textbox.settings.fontSize = percentageToPixel(textbox.settings.fontSize, "width")

        if(textbox.settings.caps) {
            textbox.value = textbox.value.toUpperCase()
        }
    })
}

module.exports = format
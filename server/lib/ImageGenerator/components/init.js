const sharp = require("sharp")

async function init(svg, { image, textboxes }) {
    const percentageToPixel = (percentage, attribute = "width") => {
        return parseFloat(percentage) / 100 * svg[attribute]
    }

    const { width, height } = await sharp(image.path).metadata()
    
    svg
        .setWidth(width)
        .setHeight(height)
        .openDefs()
        .addFont({
            name: "Comic Sans",
            src: "C:/Users/Merlin/Desktop/projects/meme-generator/editor/src/assets/fonts/comic-sans.ttf"
        })
        .closeDefs()

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

module.exports = init
const SVG = require("../../SVG.js")

const fs = require("fs")

function createTextboxes({ textboxes }) {
    const images = []

    for(let textbox of textboxes) {
        const svg = new SVG()

        svg.setWidth(textbox.width)
        svg.setHeight(textbox.height)

        svg.addTextbox({
            value: textbox.value,
            width: textbox.width,
            height: textbox.height,
            color: textbox.settings.color,
            fontSize: textbox.settings.fontSize,
            fontFamily: textbox.settings.fontFamily,
            backgroundColor: textbox.settings.backgroundColor
        })
        svg.close()

        images.push({
            input: Buffer.from(svg.toString()),
            left: textbox.x,
            top: textbox.y
        })
        
        fs.writeFileSync("./textbox.svg", svg.toString())
    }

    return images
}

module.exports = createTextboxes
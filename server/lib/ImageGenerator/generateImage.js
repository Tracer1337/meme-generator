const addTextboxes = require("./components/addTextboxes.js")
const addImage = require("./components/addImage.js")
const addStickers = require("./components/addStickers.js")
const init = require("./components/init.js")
const SVG = require("../SVG.js")

async function generateImage(args) {
    const svg = new SVG()

    await init(svg, args)
    await addImage(svg, args)
    await addTextboxes(svg, args)
    await addStickers(svg, args)
    
    svg.close()

    return svg
}

module.exports = generateImage
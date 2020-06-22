const fs = require("fs")
const path = require("path")
const SVG = require("../lib/SVG.js")

const svg = new SVG(512, 512)
    .openDefs()
    .addFont("Comic Sans", "C:/Users/Merlin/Desktop/projects/meme-generator/editor/src/assets/fonts/comic-sans.ttf")
    .closeDefs()
    .addText("Test", {
        x: 10,
        y: 100,
        fontFamily: "Comic Sans",
        fontSize: 48,
        fill: "black"
    })
    .close()
    .toString()

fs.writeFileSync(path.join(__dirname, "test.svg"), svg)

console.log(svg)
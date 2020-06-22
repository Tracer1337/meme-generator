const fs = require("fs")

const text = ({ x, y, fontFamily, fontSize, color, value }) => `
    <text font-family="${fontFamily}" font-size="${fontSize}" fill="${color}" x="${x}" y="${y}" dominant-baseline="middle" text-anchor="middle">${value}</text>
`

const font = ({ name, src }) => `
    <style type="text/css">
        @font-face {
            font-family: "${name}";
            src: url("${src}");
        }
    </style>
`

const image = ({ base64, mimetype, width, height }) => `<image href="data:${mimetype};base64,${base64}" width="${width}" height="${height}"/>`

const textbox = ({ x, y, width, height, backgroundColor, ...args }) => `
    <g transform="translate(${x}, ${y})">
        <rect width="${width}" height="${height}" fill="${backgroundColor || "transparent"}"/>
        <svg width="${width}" height="${height}">
            ${text({ ...args, x: "50%", y: "50%" })}
        </svg>
    </g>
`

const createMethodsFromFunctions = [text, textbox, font]

class SVG {
    constructor() {
        this.width = null
        this.height = null
        this.svg = `<svg width="%WIDTH%" height="%HEIGHT%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`

        // Dynamically create methods (text => addText)
        createMethodsFromFunctions.forEach(fn => {
            const name = "add" + fn.name.slice(0, 1).toUpperCase() + fn.name.slice(1)
            this[name] = args => this.add(fn(args))
        })
    }

    setWidth(width) {
        this.svg = this.svg.replace("%WIDTH%", width)
        this.width = width
        return this
    }

    setHeight(height) {
        this.svg = this.svg.replace("%HEIGHT%", height)
        this.height = height
        return this
    }

    add(text) {
        this.svg += text
        return this
    }

    close() {
        return this.add("</svg>")
    }

    toString() {
        return this.svg
    }

    openDefs() {
        return this.add("<defs>")
    }

    closeDefs() {
        return this.add("</defs>")
    }

    addImage({ path, ...args }) {
        const base64 = fs.readFileSync(path, "base64")
        return this.add(image({ ...args, base64 }))
    }
}

module.exports = SVG
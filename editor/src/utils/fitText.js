import textfit from "textfit"

function getNewFontsize(div) {
    textfit(div)
    const span = div.querySelector("span")
    const fontSize = getComputedStyle(span).fontSize
    return parseInt(fontSize)
}

function fitText({ width, height, text, styles }) {
    width = Math.floor(width)
    height = Math.floor(height)

    if(width <= 0 || height <= 0) {
        return 0
    }

    const div = document.createElement("div")

    div.style.visibility = "hidden"
    div.style.position = "absolute"
    div.style.width = width + "px"
    div.style.height = height + "px"
    div.style.whiteSpace = "pre"

    Object.assign(div.style, styles)

    div.textContent = text

    document.body.appendChild(div)

    const fontSize = getNewFontsize(div)

    document.body.removeChild(div)

    return fontSize
}

export default fitText
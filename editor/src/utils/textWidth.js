export default function textWidth(text, _styles) {
    const styles = {..._styles}

    const pixel = key => styles[key] ? styles[key] = styles[key] + "px" : null

    // Set units for provided stylings
    pixel("fontSize")

    const div = document.createElement("div")

    div.style.visibility = "hidden"
    div.style.position = "absolute"
    div.style.width = "auto"
    div.style.height = "auto"
    div.style.whiteSpace = "pre-wrap"

    Object.assign(div.style, styles)
    
    div.textContent = text

    document.body.appendChild(div)

    const width = div.clientWidth + 1

    document.body.removeChild(div)
    
    return width
}
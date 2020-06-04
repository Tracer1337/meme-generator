export default function textWidth({ text, fontSize = 12 }) {
    const div = document.createElement("div")

    div.style.visibility = "hidden"
    div.style.position = "absolute"
    div.style.fontSize = fontSize + "px"
    div.style.width = "auto"
    div.style.height = "auto"
    div.style.whiteSpace = "pre-wrap"
    
    div.textContent = text

    document.body.appendChild(div)

    const width = div.clientWidth + 1

    document.body.removeChild(div)
    
    return width
}
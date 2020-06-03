export default function textWidth({ text, fontSize = 12 }) {
    const div = document.createElement("div")

    div.style.visibility = "hidden"
    div.style.position = "absolute"
    div.style.fontSize = fontSize + "px"
    div.style.width = "auto"
    div.style.height = "auto"
    
    div.textContent = text

    document.body.appendChild(div)

    const width = div.clientWidth + (text[text.length - 1] === " " ? 8 : 0)
    
    document.body.removeChild(div)

    return width
}
async function addTextboxes(svg, { textboxes }) {

    for(let textbox of textboxes) {
        svg.addTextbox({
            value: textbox.value,
            width: textbox.width,
            height: textbox.height,
            x: textbox.x,
            y: textbox.y,
            color: textbox.settings.color,
            fontSize: textbox.settings.fontSize,
            fontFamily: textbox.settings.fontFamily
        })
    }

}

module.exports = addTextboxes
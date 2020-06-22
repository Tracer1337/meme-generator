async function addImage(svg, { image }) {
    svg.addImage({
        path: image.path,
        mimetype: image.mimetype,
        width: svg.width,
        height: svg.height
    })
}

module.exports = addImage
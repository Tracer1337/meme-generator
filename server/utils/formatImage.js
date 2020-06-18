const sharp = require("sharp")

async function formatImage(path) {
    const image = sharp(path)
    const newImage = await image
        .metadata()
        .then((metadata) => image
            .resize(metadata.width <= 512 ? metadata.width : 512)
            .jpeg()
            .toBuffer())

    return newImage
}

module.exports = formatImage
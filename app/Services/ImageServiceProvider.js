const sharp = require("sharp")

const config = require("../../config")

/**
 * Resize image and convert it to specified format
 */
async function formatImage(path, format = config.defaultImageFormat) {
    const image = sharp(path)
    const newImage = await image
        .metadata()
        .then(async (metadata) => {
            const resized = await image
                .resize(metadata.width <= config.maxImageWidth ? metadata.width : config.maxImageWidth)

            return resized[format]().toBuffer()
        })

    return newImage
}

module.exports = { formatImage }
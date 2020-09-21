const sharp = require("sharp")

const config = require("../../config")

/**
 * Call formatImage with base64 string
 */
function formatBase64Image(base64) {
    const uri = base64.split(";base64,")[1]
    const buffer = Buffer.from(uri, "base64")
    return formatImage(buffer)
}

/**
 * Resize image and convert it to specified format
 */
async function formatImage(data, format = config.defaultImageFormat) {
    const image = sharp(data)
    const newImage = await image
        .metadata()
        .then(async (metadata) => {
            const resized = await image
                .resize(metadata.width <= config.maxImageWidth ? metadata.width : config.maxImageWidth)

            return resized[format]().toBuffer()
        })

    return newImage
}

module.exports = { formatImage, formatBase64Image }
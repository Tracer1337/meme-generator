const fs = require("fs")
const sharp = require("sharp")

const config = require("../../config")

/**
 * Resize image and convert it to specified format
 */
async function formatImage({ path, base64 }, options = {}) {
    options = {
        format: config.defaultImageFormat,
        maxWidth: config.maxImageWidth,
        aspectRatio: null,
        ...options
    }

    let data

    if (base64) {
        const uri = base64.split(";base64,")[1]
        data = Buffer.from(uri, "base64")
    } else {
        data = path
    }

    const image = sharp(data)
    const newImage = await image
        .metadata()
        .then(async (metadata) => {
            const newWidth = metadata.width <= options.maxWidth ? metadata.width : options.maxWidth
            const newHeight = options.aspectRatio ? newWidth * options.aspectRatio : null

            const resized = await image
                .resize(newWidth, newHeight)

            return resized[options.format]().toBuffer()
        })

    if (path) {
        await fs.promises.writeFile(path, newImage)
    }

    return newImage
}

module.exports = { formatImage }
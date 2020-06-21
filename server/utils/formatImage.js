const sharp = require("sharp")

async function formatImage(path, format = "jpeg") {
    const image = sharp(path)
    const newImage = await image
        .metadata()
        .then(async (metadata) => {
            const resized = await image
                .resize(metadata.width <= 512 ? metadata.width : 512)
            
            if(format === "jpeg") {
                return resized.jpeg().toBuffer()
            } else if (format === "png") {
                return resized.png().toBuffer()
            }
        })

    return newImage
}

module.exports = formatImage
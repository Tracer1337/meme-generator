const sharp = require("sharp")

const createTextboxes = require("./components/createTextboxes.js")
const createStickers = require("./components/createStickers.js")
const format = require("./components/format.js")

function generateImage({ image, textboxes, sticker_images, stickers }) {
    const composedImage = sharp(image.path)

    return new Promise((resolve) => {
        composedImage
            .metadata()
            .then(({ width, height }) => {
                format({
                    dimensions: { width, height },
                    textboxes,
                    stickers
                })

                composedImage
                    .composite([
                        ...createTextboxes({ textboxes }),
                        ...createStickers({ stickers, sticker_images })
                    ])
                    .normalise()
                    .png()
                    .toBuffer()
                    .then((data) => resolve(data))
            })
    })
}

module.exports = generateImage
const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Sticker = require("../../app/Models/Sticker.js")
const { randomFileName, getFileExtension } = require("../../app/utils")

const STICKERS_DIR = path.join(__dirname, "stickers")

module.exports = {
    table: "stickers",

    run: async () => {
        // Get images from stickers/
        const stickers = fs.readdirSync(STICKERS_DIR)

        await Promise.all(stickers.map(async (sticker) => {
            // Store image in local storage
            const filename = randomFileName() + getFileExtension(sticker)
            await StorageFacade.uploadFileLocal(path.join(STICKERS_DIR, sticker), filename)

            // Create database entry
            const model = new Sticker({
                image_url: "/storage/" + filename,
            })

            await model.store()
        }))
    }
}
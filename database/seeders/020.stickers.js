const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Sticker = require("../../app/Models/Sticker.js")
const { randomFileName, getFileExtension } = require("../../app/utils")

const STICKERS_DIR = path.join(__dirname, "..", "..", "prod_database")

module.exports = {
    table: "stickers",

    run: async () => {
        // Get images from stickers/
        const stickers = JSON.parse(fs.readFileSync(path.join(STICKERS_DIR, "stickers.json"), "utf-8"))

        await Promise.all(stickers.map(async (sticker) => {
            // Create database entry
            const model = new Sticker(sticker)

            await model.store()
        }))
    }
}
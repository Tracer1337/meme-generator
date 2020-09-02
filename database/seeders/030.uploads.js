const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Upload = require("../../app/Models/Upload.js")

const UPLOADS_DIR = path.join(__dirname, "uploads")

module.exports = {
    table: "uploads",

    run: async () => {
        // Get images from uploads/
        const uploads = fs.readdirSync(UPLOADS_DIR)

        await Promise.all(uploads.map(async (filename) => {
            // Store image in local storage
            await StorageFacade.uploadFile(path.join(UPLOADS_DIR, filename), filename)

            // Create database entry
            const model = new Upload({
                filename,
                request_ip_address: "127.0.0.1"
            })

            await model.store()
        }))
    }
}
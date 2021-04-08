const fs = require("fs")

const StorageFacade = require("../Facades/StorageFacade")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const UploadServiceProvider = require("../Services/UploadServiceProvider.js")
const { changeExtension, hasExtension } = require("../utils")

/**
 * Get upload by filename - Render embed or send file directly
 */
async function getByFilename(req, res) {
    // Render embed-page if not file extension is given
    if (!hasExtension(req.params.file)) {
        return res.render("image", {
            imagePath: `/nudes/${req.params.file}.jpg`,
            title: "Created with Meme Bros"
        })
    }

    // Simulate server delay for development mode
    if (process.env.NODE_ENV === "development") {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const buffer = StorageFacade.getFile(req.params.file)

    // Check if Storage returned the buffer from cache, or a promise
    if (Buffer.isBuffer(buffer)) {
        res.header("X-From-Cache", true).end(buffer)
    } else {
        try {
            res.end(await buffer)
        } catch (error) {
            console.error(error)
            res.status(404).end()
        }
    }
}

/**
 * Create new upload
 */
async function store(req, res) {
    // Format image and override uploaded one
    await ImageServiceProvider.formatImage({ path: req.file.path })

    const newFilename = changeExtension(req.file.filename, "jpg")

    try {
        const upload = await UploadServiceProvider.uploadFile(req, req.file.path, newFilename)

        await upload.store()

        res.send({ path: upload.toJSON().altEmbedUrl })
    } catch(error) {
        console.error(error)
        res.status(500).end()
    } finally {
        await fs.promises.unlink(req.file.path)
    }
}

module.exports = {
    getByFilename,
    store,
}

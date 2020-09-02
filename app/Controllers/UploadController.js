const fs = require("fs")

const StorageFacade = require("../Facades/StorageFacade")
const AuthServiceProvider = require("../Services/AuthServiceProvider")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const Upload = require("../Models/Upload.js")
const { changeExtension, removeExtension, hasExtension } = require("../utils")

/**
 * Get all uploads
 */
async function getAll(req, res) {
    const isAuthorized = AuthServiceProvider.authorize(req)

    const uploads = !isAuthorized ? await Upload.findAllBy("is_hidden", "0") : await Upload.getAll()

    if (!isAuthorized) {
        uploads.forEach(upload => delete upload.is_hidden)
    }

    res.send(uploads)
}

/**
 * Get upload by filename - Render embed or send file directly
 */
async function getByFilename(req, res) {
    // Render embed-page if not file extension is given
    if (!hasExtension(req.params.file)) {
        return res.render("image", {
            imagePath: `/nudes/${req.params.file}.jpg`,
            title: "Created with easymeme69.com"
        })
    }

    // Simulate server delay for development mode
    if (process.env.NODE_ENV === "development") {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const buffer = StorageFacade.getFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + req.params.file)

    // Check if Storage returned the buffer from cache, or a promise
    if (Buffer.isBuffer(buffer)) {
        res.header("X-From-Cache", true).end(buffer)
    } else {
        try {
            res.end(await buffer)
        } catch (error) {
            res.status(404).end()
        }
    }
}

/**
 * Get random upload
 */
async function getRandom(req, res) {
    const uploads = await Upload.findAllBy("is_hidden", "0")

    const random = uploads[Math.floor(Math.random() * uploads.length)]

    res.send(random)
}

/**
 * Create new upload
 */
async function store(req, res) {
    // Format image and override uploaded one
    const newImage = await ImageServiceProvider.formatImage(req.file.path)
    await fs.promises.writeFile(req.file.path, newImage)

    const newFilename = changeExtension(req.file.filename, "jpg")

    try {
        // Create new model and store it's image
        await StorageFacade.uploadFile(req.file.path, process.env.AWS_BUCKET_PUBLIC_DIR + "/" + newFilename)

        const requestIPAddress = req.header("x-forwarded-for") || req.connection.remoteAddress

        const upload = new Upload({
            filename: newFilename,
            request_ip_address: requestIPAddress
        })

        await upload.store()

        res.send({
            path: "/nudes/" + removeExtension(newFilename)
        })
    } catch(error) {
        console.error(error)
        res.status(500).end()
    } finally {
        await fs.promises.unlink(req.file.path)
    }
}

/**
 * Update upload (is_hidden)
 */
async function edit(req, res) {
    if (![0, 1].includes(+req.body.is_hidden)) {
        return res.status(400).end()
    }

    const upload = await Upload.findBy("filename", req.params.file)

    if (!upload) {
        return res.status(404).end()
    }

    upload.is_hidden = req.body.is_hidden

    await upload.update()

    res.send(upload)
}

module.exports = {
    getAll,
    getByFilename,
    getRandom,
    store,
    edit
}
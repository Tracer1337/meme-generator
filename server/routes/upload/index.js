const express = require("express")
const fs = require("fs")
const router = express.Router()

const StorageFacade = require("../../facades/StorageFacade.js")
const upload = require("../../utils/upload.js")
const formatImage = require("../../utils/formatImage.js")
const { db } = require("../../utils/connectToDB")
const authorize = require("../../utils/authorize.js")

// Get file from Storage
router.get("/:file", async (req, res) => {
    // Render HTML page if no file extension is provided
    if (!/[^.]*\..*/.test(req.params.file)) {
        return res.render("image", {
            imagePath: `/nudes/${req.params.file}.jpg`,
            title: "Created with easymeme69.com"
        })
    }
    
    const buffer = StorageFacade.getFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + req.params.file)

    if (Buffer.isBuffer(buffer)) {
        res.header("X-From-Cache", true).end(buffer)
    } else {
        try {
            res.end(await buffer)
        } catch {
            res.status(404).end()
        } 
    }
})

// Upload file to storage
router.post("/", upload.single("file"), async (req, res) => {
    // Format image like templates and stickers
    const formattedImage = await formatImage(req.file.path)

    // Get new filename
    const newFilename = req.file.filename.replace(".png", ".jpg")

    // Replace uploaded image with formatted image
    fs.writeFileSync(req.file.path, formattedImage)

    try {
        // Upload file to storage
        await StorageFacade.uploadFile(req.file.path, process.env.AWS_BUCKET_PUBLIC_DIR + "/" + newFilename)

        // Store file in database
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const sql = `INSERT INTO uploads (filename, request_ip_address) VALUES ('${newFilename}', '${ip}')`

        db.query(sql, (error) => {
            if (error) {
                return void console.error(error)
            }
            
            // Send file path
            res.send({
                path: "/nudes/" + newFilename.replace(/\..*/, "")
            })
        })
    } catch (error) {
        console.error(error)
        res.status(500).end()
    } finally {
        // Delete temp file
        fs.unlinkSync(req.file.path)
    }
})

// Change removed-state of file
router.post("/:file", async (req, res) => {
    if (!authorize(req)) {
        return res.status(401).end()
    }

    if (![0, 1].includes(+req.body.is_hidden)) {
        return res.status(400).end()
    }

    try {
        const query = `UPDATE uploads SET is_hidden = ${req.body.is_hidden} WHERE filename = '${req.params.file}'`

        await new Promise((resolve, reject) => db.query(query, (error) => {
            if (error) reject(error)
            resolve()
        }))

        res.end()
    } catch {
        res.status(404).end()
    }
})

module.exports = router
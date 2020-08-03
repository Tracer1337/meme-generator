const express = require("express")
const fs = require("fs")
const router = express.Router()

const StorageFacade = require("../../facades/StorageFacade.js")
const upload = require("../../utils/upload.js")
const formatImage = require("../../utils/formatImage.js")
const { db } = require("../../utils/connectToDB")

// Get file from Storage
router.get("/:file", async (req, res) => {
    // Render HTML page if no file extension is provided
    if (!/[^.]*\..*/.test(req.params.file)) {
        return void res.render("image", {
            imagePath: `/nudes/${req.params.file}.png`,
            title: "Created with https://easymeme69.com/"
        })
    }
    
    const stream = StorageFacade.getFileStream(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + req.params.file)
    
    stream.on("error", (error) => {
        res.status(error.statusCode).end()
    })

    try {
        // Pipe storage file-stream to response
        stream.pipe(res)
            .on("error", (error) => {
                console.error(error)
                res.status(500).end()
            })
            .on("close", () => res.end())
    } catch { }
})

// Upload file to storage
router.post("/", upload.single("file"), async (req, res) => {
    // Format image like templates and stickers
    const formattedImage = await formatImage(req.file.path, "png")

    // Replace uploaded image with formatted image
    fs.writeFileSync(req.file.path, formattedImage)

    try {
        // Upload file to storage
        await StorageFacade.uploadFile(req.file.path, process.env.AWS_BUCKET_PUBLIC_DIR + "/" + req.file.filename)

        // Store file in database
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const sql = `INSERT INTO uploads (filename, request_ip_address) VALUES ('${req.file.filename}', '${ip}')`

        db.query(sql, (error, data) => {
            if (error) {
                return void console.error(error)
            }
            
            // Send file path
            res.send({
                path: "/nudes/" + req.file.filename.replace(/\..*/, "")
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

module.exports = router
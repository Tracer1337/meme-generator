const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

const { db } = require("../../utils/connectToDB.js")
const Sticker = require("../../models/Sticker.js")
const authorize = require("../../utils/authorize.js")
const upload = require("../../utils/upload.js")
const formatImage = require("../../utils/formatImage.js")

const ROOT_DIR = path.join(__dirname, "..", "..", "..")

// Get all stickers
router.get("/", (req, res) => {
    const sql = "SELECT * FROM stickers"
    db.query(sql, (error, result) => {
        if(error) throw error

        res.send(result)
    })
})

// Store a sticker
router.post("/", upload.single("image"), async (req, res) => {
    // Authorize request
    if(!authorize(req)) {
        res.status(403)
        res.end()
        fs.unlinkSync(req.file.path)
        return
    }

    // Create new image
    const newImage = await formatImage(req.file.path, "png")

    // Store new image
    const newFileName = req.file.filename.replace(/\.\w+/, ".png")
    fs.writeFileSync(path.join(ROOT_DIR, "storage", newFileName), newImage)
    fs.unlinkSync(req.file.path)

    // Build Sticker Model
    const newSticker = new Sticker({
        image_url: "/storage/" + newFileName,
        amount_uses: 0
    })

    // Store new sticker
    const sql = "INSERT INTO stickers SET ?"
    db.query(sql, newSticker.toObject(), (error) => {
        if(error) throw error
        res.send(newSticker.toObject())
    })
})

// Delete sticker
router.post("/delete/:id", async (req, res) => {
    // Authorize request
    if(!authorize(req)) {
        res.status(403)
        res.end()
        return
    }

    const stickerId = req.params.id

    // Query requested sticker
    const sticker = await new Promise((resolve) => {
        const sql = "SELECT * FROM stickers WHERE id = " + stickerId
        db.query(sql, (error, results) => {
            if(error) throw error
            resolve(results[0])
        })
    })

    // Remove image from storage
    fs.unlinkSync(path.join(ROOT_DIR, sticker.image_url))

    // Remove sticker from database
    const sql = "DELETE FROM stickers WHERE id = " + stickerId
    db.query(sql, (error) => {
        if(error) throw error
        res.end()
    })
})

// Register sticker use
router.post("/register-use", (req, res) => {
    // Validate input
    if(!req.body.id) {
        res.status(400)
        res.end
        return
    }

    // Increase amount_uses by 1
    const sql = "UPDATE stickers SET amount_uses = amount_uses + 1 WHERE id = " + req.body.id
    db.query(sql, (error) => {
        if(error) throw error
        res.end()
    })
})

module.exports = router
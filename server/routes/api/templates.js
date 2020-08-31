const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

const formatImage = require("../../utils/formatImage.js")
const upload = require("../../utils/upload.js")
const { db } = require("../../utils/connectToDB.js")
const authorize = require("../../utils/authorize.js")
const Template = require("../../models/Template.js")

const ROOT_DIR = path.join(__dirname, "..", "..", "..")

// Store template
router.post("/", upload.single("image"), async (req, res) => {
    // Remove temporary image
    const deleteTemp = () => {
        fs.unlinkSync(req.file.path)
    }

    // Check the password
    if (!authorize(req)) {
        res.status(403)
        res.end()
        deleteTemp()
        return
    }

    // Format image
    const newImage = await formatImage(req.file.path)

    // Store formatted image
    const newFileName = req.file.filename.replace(/\.\w+/, ".jpeg")
    fs.writeFileSync(path.join(ROOT_DIR, "storage", newFileName), newImage)
    deleteTemp()

    // Build new template
    const template = new Template({
        label: req.body.label,
        image_url: `/storage/${newFileName}`,
        meta_data: req.body.meta_data,
        amount_uses: 0
    })

    const sql = "INSERT INTO templates SET ?"

    // Store template
    db.query(sql, template.toObject(), (error) => {
        if (error) throw error
        res.send(template.toObject())
    })
})

// Edit template
router.put("/", async (req, res) => {
    // Authorize
    if (!authorize(req)) {
        return res.status(403).end()
    }

    const values = {
        label: req.body.label,
        meta_data: JSON.stringify(req.body.meta_data)
    }

    // Update values in database
    db.query(`UPDATE templates SET ? WHERE id = ${req.body.id}`, values, (error, results) => {
        if (error) throw error

        res.send()
    })
})

// Delete template
router.post("/delete/:id", async (req, res) => {
    // Authorize
    if (!authorize(req)) {
        res.status(403)
        res.end()
        return
    }

    const templateId = req.params.id

    // Query requested template
    const template = await new Promise(resolve => {
        const sql = `SELECT * FROM templates WHERE id = ${templateId}`
        db.query(sql, (error, results) => {
            if(error) throw error
            resolve(results[0])
        })
    })

    // Delete image file
    fs.unlinkSync(path.join(ROOT_DIR, template.image_url))

    const sql = "DELETE FROM templates WHERE id = " + templateId

    db.query(sql, (error, result) => {
        if (error) throw error
        res.end()
    })
})

// Register template use
router.post("/register-use", (req, res) => {
    if (!req.body.id) {
        res.status(400)
        res.end()
        return
    }

    const sql = "UPDATE templates SET amount_uses = amount_uses + 1 WHERE id = " + req.body.id

    db.query(sql, (error) => {
        if (error) throw error
        res.end()
    })
})

// Get all templates
router.get("/", (req, res) => {
    const sql = "SELECT * FROM templates"

    db.query(sql, (error, data) => {
        if (error) throw error
        res.send(data)
    })
})

module.exports = router
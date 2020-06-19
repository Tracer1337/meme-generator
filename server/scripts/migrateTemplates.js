const fs = require("fs")
const path = require("path")
const createConnection = require("../utils/connectToDB.js")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })

const randomFileName = require("../utils/randomFileName.js")
const getFileExtension = require("../utils/getFileExtension.js")
const Template = require("../models/Template.js")

const TEMPLATES_DIR = path.join(__dirname, "..", "..", "templates")
const STORAGE_DIR = path.join(__dirname, "..", "..", "storage")

; (async function () {
    // Connect to database
    const db = createConnection()

    // Delete all existing templates
    fs.readdirSync(STORAGE_DIR).forEach(file => {
        fs.unlinkSync(path.join(STORAGE_DIR, file))
    })

    // Drop all entries in table "templates"
    const sql = "DELETE FROM templates"
    await new Promise(resolve => db.query(sql, (error) => {
        if (error) throw error
        resolve()
    }))

    // Get templates from templates/templates.json
    const templates = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, "templates.json"), "utf8"))

    for (let template of templates) {
        const filename = randomFileName() + getFileExtension(template.image)

        // Copy image to /storage
        fs.copyFileSync(path.join(TEMPLATES_DIR, template.image), path.join(STORAGE_DIR, filename))

        // Build new template
        const newTemplate = new Template({
            label: template.label,
            image_url: `/storage/${filename}`,
            meta_data: JSON.stringify(template.meta_data),
            amount_uses: 0
        })

        const sql = "INSERT INTO templates SET ?"

        // Store template
        await new Promise(resolve => db.query(sql, newTemplate.toObject(), (error) => {
            if (error) throw error
            resolve()
        }))
    }

    db.end()
    console.log("Done")
    process.exit()
})()
const fs = require("fs")
const path = require("path")
const createConnection = require("./connectToDB.js")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

function randomFileName() {
    return uuidv4().match(/([^-]*)/)[0]
}

function getFileExtension(filename) {
    return filename.match(/\.[0-9a-z]+$/i)[0]
}

;(async function() {
    // Connect to database
    const db = createConnection()

    // Delete all existing templates
    fs.readdirSync("../storage").forEach(file => {
        fs.unlinkSync("../storage/" + file)
    })

    // Drop all entries in table "templates"
    const sql = "DELETE FROM templates"
    await new Promise(resolve => db.query(sql, (error) => {
        if (error) throw error
        resolve()
    }))

    // Get templates from templates/templates.json
    const templates = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "templates", "templates.json"), "utf8"))

    for(let template of templates) {
        const filename = randomFileName() + getFileExtension(template.image)

        // Copy image to /storage
        fs.copyFileSync(path.join(__dirname, "..", "templates", template.image), path.join(__dirname, "..", "storage", filename))

        // Build new template
        const newTemplate = {
            label: template.label,
            image_url: `http://${process.env.HOST}:${process.env.PORT}/storage/${filename}`,
            meta_data: JSON.stringify(template.meta_data),
            amount_downloads: 0
        }

        const sql = "INSERT INTO templates SET ?"

        // Store template
        await new Promise(resolve => db.query(sql, newTemplate, (error) => {
            if (error) throw error
            resolve()
        }))
    }

    db.end()
    console.log("Done")
    process.exit()
})()
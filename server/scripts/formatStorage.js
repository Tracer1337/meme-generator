const path = require("path")
const fs = require("fs")

const createConnection = require("../utils/connectToDB.js")
const formatImage = require("../utils/formatImage.js")
const getFileExtension = require("../utils/getFileExtension.js")

const STORAGE_DIR = path.join(__dirname, "..", "..", "storage")

function getFileFromUrl(url) {
    const matches = url.match(/\w+\.\w+/g)
    return matches[matches.length - 1]
}

const db = createConnection()

db.query("SELECT * FROM templates", async (error, result) => {
    if(error) throw error

    for(let template of result) {
        const file = getFileFromUrl(template.image_url)
        const ext = getFileExtension(file)

        if(ext === ".png") {
            const originalPath = path.join(STORAGE_DIR, file)
            let newImage

            newImage = await formatImage(originalPath)

            fs.unlinkSync(originalPath)
            fs.writeFileSync(originalPath.replace(".png", ".jpeg"), newImage)

            const newUrl = template.image_url.replace(".png", ".jpeg")
            const sql = `UPDATE templates SET image_url = "${newUrl}" WHERE id = ${template.id}`

            await new Promise(resolve => db.query(sql, (error) => {
                if(error) throw error
                resolve()
            }))
        }
    }

    db.end()
})
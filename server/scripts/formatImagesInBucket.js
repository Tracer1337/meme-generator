const path = require("path")
const fs = require("fs")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })
require("../../config.js")

const { db } = require("../utils/connectToDB.js")
const formatImage = require("../utils/formatImage.js")
const StorageFacade = require("../facades/StorageFacade.js")

const TEMP_PATH = path.join(__dirname, "..", "..", "temp")

/**
 * Convert all images in storage (/public) to .jpg
 */
db.query("SELECT * FROM uploads", async (error, results) => {
    if (error) throw error

    // Create new bucket
    const { Bucket } = await StorageFacade.createBucket()

    // Convert images
    for (let row of results) {
        try {
            // Get image from storage
            const buffer = await StorageFacade.getFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + row.filename)
    
            // Convert image to jpg
            const newBuffer = await formatImage(buffer)
    
            // Create temp image
            const temp = path.join(TEMP_PATH, "temp.jpg")
            fs.writeFileSync(temp, newBuffer)
        
            // Store new image in new bucket
            const newFilename = row.filename.replace(/\..*/, ".jpg")
            await StorageFacade.uploadFile(temp, process.env.AWS_BUCKET_PUBLIC_DIR + "/" + newFilename, Bucket)
    
            // Update filename in database
            await new Promise((resolve, reject) => db.query(`UPDATE uploads SET filename = '${newFilename}' WHERE id = '${row.id}'`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            }))
        } catch (error) {
            console.log(error)
        }
    }

    db.end()
})
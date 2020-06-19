const multer = require("multer")
const path = require("path")

// Import utilities
const randomFileName = require("./randomFileName.js")
const getFileExtension = require("./getFileExtension.js")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = path.join(__dirname, "..", "..", "temp")
        callback(null, folder)
    },

    filename: (req, file, callback) => {
        const filename = randomFileName() + getFileExtension(file.originalname)
        callback(null, filename)
    }
})

const upload = multer({ storage })

module.exports = upload
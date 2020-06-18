require("dotenv").config()
const express = require("express")
const path = require("path")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const fs = require("fs")
const sharp = require("sharp")

const createConnection = require("./server/connectToDB.js")

function randomFileName() {
    return uuidv4().match(/([^-]*)/)[0]
}

function getFileExtension(filename) {
    return filename.match(/\.[0-9a-z]+$/i)[0]
}

function authorize(req) {
    return req.body.password === process.env.UPLOAD_PASSWORD
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = "temp"
        callback(null, folder)
    },

    filename: (req, file, callback) => {
        const filename = randomFileName() + getFileExtension(file.originalname)
        callback(null, filename)
    }
})

const upload = multer({ storage })

// Create database connection
const db = createConnection()

const app = express()

// Allow cors for dev
if(process.env.NODE_ENV !== "production") {
    app.use(cors())
}

// Support json
app.use(express.json())

// Support forms
app.use(express.urlencoded())

// Serve files from dist folder
app.use(express.static(path.join(__dirname, "dist")))

// Serve storage files
app.use("/storage", express.static(path.join(__dirname, "storage")))

// API: Check password
app.post("/api/authorize", (req, res) => {
    res.send(JSON.stringify(authorize(req)))
})

// API: Store template
app.post("/api/template", upload.single("image"), async (req, res) => {
    // Remove temporary image
    const deleteTemp = () => {
        fs.unlink(path.join(__dirname, req.file.destination, req.file.filename), (error) => {
            if (error) throw error
        })
    }

    // Check the password
    if(!authorize(req)) {
        res.status(403)
        res.end()
        deleteTemp()
        return
    }

    // Format image
    const image = sharp(req.file.path)
    const newImage = await image
        .metadata()
        .then((metadata) => image
            .resize(metadata.width <= 512 ? metadata.width : 512)
            .jpeg()
            .toBuffer())

    // Store formatted image
    const newFileName = req.file.filename.replace(/\.\w+/, ".jpeg")
    fs.writeFileSync("./storage/" + newFileName, newImage)
    deleteTemp()

    // Build new template
    const template = {
        label: req.body.label,
        image_url: `${req.protocol}://${process.env.HOST}:${process.env.PORT}/storage/${newFileName}`,
        meta_data: req.body.meta_data,
        amount_uses: 0
    }

    const sql = "INSERT INTO templates SET ?"

    // Store template
    db.query(sql, template, (error) => {
        if(error) throw error
        res.send(template)
    })
})

// API: Delete template
app.post("/api/template/:id", (req, res) => {
    // Check if delete flag is set
    if(!req.body.isMethodDelete) {
        res.status(404)
        res.end()
        return
    }

    // Authorize
    if(!authorize(req)) {
        res.status(403)
        res.end()
        return
    }

    const templateId = req.params.id
    const sql = "DELETE FROM templates WHERE id = " + templateId

    db.query(sql, (error) => {
        if(error) throw error
        res.end()
    })
})

// API: Register template use
app.post("/api/register-use", (req, res) => {
    if(!req.body.id) {
        res.status(400)
        res.end()
        return
    }

    const sql = "UPDATE templates SET amount_uses = amount_uses + 1 WHERE id = " + req.body.id

    db.query(sql, (error) => {
        if(error) throw error
        res.end()
    })
})

// API: Get all templates
app.get("/api/templates", (req, res) => {
    const sql = "SELECT * FROM templates"

    db.query(sql, (error, data) => {
        if(error) throw error
        res.send(data)
    })
})

// Start server
const port = process.env.PORT || 80
app.listen(port, () => {
    console.log("Server running on port", port)
})
require("dotenv").config()
const express = require("express")
const path = require("path")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const fs = require("fs")
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
        const folder = "storage"
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
app.post("/api/template", upload.single("image"), (req, res) => {
    // Check the password
    if(!authorize(req)) {
        res.status(403)
        res.end()
        
        // Delete image
        fs.unlink(path.join(__dirname, req.file.destination, req.file.filename), (error) => {
            if(error) throw error
        })
        return
    }

    // Build new template
    const template = {
        label: req.body.label,
        image_url: `${req.protocol}://${process.env.HOST}:${process.env.PORT}/storage/${req.file.filename}`,
        meta_data: req.body.meta_data,
        amount_downloads: 0
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

// API: Register template download
app.post("/api/download", (req, res) => {
    const sql = "UPDATE templates SET amount_downloads = amount_downloads + 1 WHERE id = " + req.body.id

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
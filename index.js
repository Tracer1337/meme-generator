require("dotenv").config()
const express = require("express")
const mysql = require("mysql")
const path = require("path")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

const randomFileName = () => uuidv4().match(/([^-]*)/)[0]
const getFileExtension = filename => filename.match(/\.[0-9a-z]+$/i)[0]

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = "uploads"
        callback(null, folder)
    },

    filename: (req, file, callback) => {
        const filename = randomFileName() + getFileExtension(file.originalname)
        callback(null, filename)
    }
})

const upload = multer({ storage })

// Create database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

// Establish connection
db.connect((error) => {
    if(error) {
        throw error
    }

    console.log("Database connected")
})

const app = express()

// Support json
app.use(express.json())

// Support forms
app.use(express.urlencoded())

// Serve files from dist folder
app.use(express.static(path.join(__dirname, "dist")))

// API: Store template
app.post("/api/template", upload.single("image"), (req, res) => {
    res.send(JSON.stringify(req.body))
})

// Start server
const port = process.env.PORT || 80
app.listen(port, () => {
    console.log("Server running on port", port)
})
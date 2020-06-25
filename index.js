require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()

// Allow cors for dev 
if(process.env.NODE_ENV !== "production") {
    app.use(cors())
}

// Support json
app.use(express.json())

// Support forms
app.use(express.urlencoded())

// Proxy react dev-server
if(process.env.NODE_ENV !== "production") {
    app.use("/editor", createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true
    }))
}

// Serve files from dist folder
app.use(express.static(path.join(__dirname, "dist")))

// Serve storage files
app.use("/storage", express.static(path.join(__dirname, "storage")))

// Use api routes
app.use("/api", require("./server/routes/api/index.js"))

// Start server
const port = process.env.PORT || 80
app.listen(port, () => {
    console.log("Server running on port", port)
})
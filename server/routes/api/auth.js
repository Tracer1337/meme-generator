const express = require("express")
const router = express.Router()

const authorize = require("../../utils/authorize.js")

// Check password
router.post("/authorize", (req, res) => {
    res.send(JSON.stringify(authorize(req)))
})

module.exports = router
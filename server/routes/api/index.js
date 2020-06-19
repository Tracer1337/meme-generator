const express = require("express")
const router = express.Router()

router.use("/templates", require("./templates.js"))
router.use("/auth", require("./auth.js"))

module.exports = router
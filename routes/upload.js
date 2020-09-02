const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")
const UploadMiddleware = require("../app/Middleware/UploadMiddleware.js")

const UploadController = require("../app/Controllers/UploadController.js")

const router = express.Router()

router.get("/:file", UploadController.getByFilename)
router.post("/", UploadMiddleware.single("file"), UploadController.store)
router.post("/:file", ProtectMiddleware, UploadController.edit)

module.exports = router
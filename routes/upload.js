const express = require("express")

const UploadMiddleware = require("../app/Middleware/UploadMiddleware.js")

const UploadController = require("../app/Controllers/UploadController.js")

const router = express.Router()

router.get("/:file", UploadController.getByFilename)
router.post("/", UploadMiddleware.single("file"), UploadController.store)

module.exports = router
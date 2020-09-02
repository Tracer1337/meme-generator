const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")
const UploadMiddleware = require("../app/Middleware/UploadMiddleware.js")

const TemplatesController = require("../app/Controllers/TemplatesController.js")
const StickersController = require("../app/Controllers/StickersController.js")
const UploadController = require("../app/Controllers/UploadController.js")

const router = express.Router()

router.post("/auth/authorize", (req, res) => {
    res.send(JSON.stringify(req.body.password === process.env.UPLOAD_PASSWORD))
})

router.get("/templates", TemplatesController.getAll)
router.post("/templates", ProtectMiddleware, UploadMiddleware.single("image"), TemplatesController.create)
router.put("/templates", ProtectMiddleware, TemplatesController.edit)
router.post("/templates/delete/:id", ProtectMiddleware, TemplatesController.remove)
router.post("/templates/register-use", TemplatesController.registerUse)

router.get("/stickers", StickersController.getAll)
router.post("/stickers", ProtectMiddleware, UploadMiddleware.single("image"), StickersController.create)
router.post("/stickers/delete/:id", ProtectMiddleware, StickersController.remove)
router.post("/stickers/register-use", StickersController.registerUse)

router.get("/upload/random", UploadController.getRandom)
router.get("/upload/all", UploadController.getAll)

module.exports = router
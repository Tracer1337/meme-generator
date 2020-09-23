const express = require("express")
const Validator = require("../lib/Validator.js")
const User = require("../app/Models/User.js")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")
const UploadMiddleware = require("../app/Middleware/UploadMiddleware.js")

const TemplatesController = require("../app/Controllers/TemplatesController.js")
const StickersController = require("../app/Controllers/StickersController.js")
const UploadController = require("../app/Controllers/UploadController.js")
const AuthController = require("../app/Controllers/AuthController.js")
const PostsController = require("../app/Controllers/PostsController.js")
const UserController = require("../app/Controllers/UserController.js")
const FriendsController = require("../app/Controllers/FriendsController.js")

const router = express.Router()

router.post("/auth/authorize", (req, res) => {
    res.send(JSON.stringify(req.body.password === process.env.UPLOAD_PASSWORD))
})

router.get("/templates", TemplatesController.getAll)
router.post("/templates", ProtectMiddleware, TemplatesController.create)
router.put("/templates", ProtectMiddleware, TemplatesController.edit)
router.delete("/templates/:id", ProtectMiddleware, TemplatesController.remove)
router.post("/templates/register-use/:id", TemplatesController.registerUse)

router.get("/stickers", StickersController.getAll)
router.post("/stickers", ProtectMiddleware, UploadMiddleware.single("image"), StickersController.create)
router.delete("/stickers/:id", ProtectMiddleware, StickersController.remove)
router.post("/stickers/register-use/:id", StickersController.registerUse)

router.get("/upload/random", UploadController.getRandom)
router.get("/upload/all", UploadController.getAll)

router.get("/auth/profile", ProtectMiddleware, AuthController.profile)
router.post("/auth/register", new Validator().email("email", { uniqueIn: User }).username("username", { uniqueIn: User }).password("password"), AuthController.register)
router.post("/auth/login", new Validator().email("email", { existsIn: User }).password("password"), AuthController.login)

router.get("/posts", PostsController.getAll)
router.post("/posts", ProtectMiddleware, UploadMiddleware.single("image"), PostsController.create)

router.get("/users/get/:username", ProtectMiddleware, UserController.getByUsername)
router.get("/users/find", ProtectMiddleware, UserController.getByQueryString)

router.post("/friends/:id", ProtectMiddleware, FriendsController.add)
router.delete("/friends/:id", ProtectMiddleware, FriendsController.remove)

module.exports = router
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
const ProfileController = require("../app/Controllers/ProfileController.js")

const { VISIBILITY } = require("../config/constants.js")

const router = express.Router()

router.post("/auth/authorize", (req, res) => {
    res.send(JSON.stringify(req.body.password === process.env.UPLOAD_PASSWORD))
})

router.get("/templates", TemplatesController.getAll)
router.post("/templates", new Validator().oneOf("visibility", { values: Object.values(VISIBILITY) }), ProtectMiddleware, TemplatesController.create)
router.put("/templates", ProtectMiddleware, TemplatesController.edit)
router.delete("/templates/:id", ProtectMiddleware, TemplatesController.remove)
router.post("/templates/register-use/:id", TemplatesController.registerUse)

router.get("/stickers", StickersController.getAll)
router.post("/stickers", ProtectMiddleware.Admin, UploadMiddleware.single("image"), StickersController.create)
router.delete("/stickers/:id", ProtectMiddleware.Admin, StickersController.remove)
router.post("/stickers/register-use/:id", StickersController.registerUse)

router.post("/auth/register", new Validator().email("email", { uniqueIn: User }).username("username", { uniqueIn: User }).password("password"), AuthController.register)
router.post("/auth/login", new Validator().email("email", { existsIn: User }).password("password"), AuthController.login)

router.get("/profile", ProtectMiddleware, ProfileController.getProfile)
router.post("/profile/avatar", ProtectMiddleware, UploadMiddleware.single("image"), ProfileController.uploadAvatar)

router.get("/posts", ProtectMiddleware, PostsController.getAll)
router.get("/posts/user/:id", ProtectMiddleware, PostsController.getByUser)
router.post("/posts", ProtectMiddleware, UploadMiddleware.single("image"), PostsController.create)
router.delete("/posts/:id", ProtectMiddleware, PostsController.delete)

router.get("/users/get/:username", ProtectMiddleware, UserController.getByUsername)
router.get("/users/find", ProtectMiddleware, UserController.getByQueryString)

router.post("/friends/:id", ProtectMiddleware, FriendsController.add)
router.delete("/friends/:id", ProtectMiddleware, FriendsController.remove)
router.get("/friends/posts", ProtectMiddleware, FriendsController.getPosts)

module.exports = router
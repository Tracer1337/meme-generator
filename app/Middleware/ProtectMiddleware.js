const User = require("../Models/User.js")
const AuthServiceProvider = require("../Services/AuthServiceProvider.js")

/**
 * Convert the given token to a user object
 */
async function ProtectMiddleware(req, res, next) {
    if (!req.header("Authorization")) {
        return res.sendStatus(401)
    }

    const token = req.header("Authorization").split(" ")[1]

    let userId

    try {
        userId = await AuthServiceProvider.verifyToken(token)
    } catch {
        return res.status(400).send("Invalid token")
    }

    const user = await User.findBy("id", userId)

    if (!user) {
        res.status(400).send("Invalid token")
    }

    req.user = user

    next()
}

module.exports = ProtectMiddleware 
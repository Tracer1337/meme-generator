const AuthServiceProvider = require("../Services/AuthServiceProvider.js")

/**
 * Check if the correct password is given
 */
async function ProtectMiddleware(req, res, next) {
    if (!AuthServiceProvider.authorize(req)) {
        return res.status(401).send("Not authorized")
    }

    next()
}

module.exports = ProtectMiddleware 
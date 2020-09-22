const User = require("../Models/User.js")

async function getByUsername(req, res) {
    const user = await User.findBy("username", req.params.username)

    if (!user) {
        return res.sendStatus(404)
    }

    res.send(user)
}

module.exports = { getByUsername }
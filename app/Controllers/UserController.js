const User = require("../Models/User.js")

async function getByUsername(req, res) {
    const user = await User.findBy("username", req.params.username)

    if (!user) {
        return res.sendStatus(404)
    }

    res.send(user)
}

async function getByQueryString(req, res) {
    const query = db.escape(`${req.query.q}%`)
    const users = await User.where(`username LIKE ${query}`)
    res.send(users)
}

module.exports = { getByUsername, getByQueryString }
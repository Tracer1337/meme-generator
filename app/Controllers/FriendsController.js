const User = require("../Models/User.js")

async function add(req, res) {
    const toUser = await User.findBy("id", req.params.id)

    if (!toUser) {
        return res.sendStatus(404)
    }

    if (!(await req.user.addFriend(toUser))) {
        return res.sendStatus(409)
    }

    res.sendStatus(200)
}

async function remove(req, res) {
    const toUser = await User.findBy("id", req.params.id)

    if (!toUser) {
        return res.sendStatus(404)
    }

    if (!(await req.user.removeFriend(toUser))) {
        return res.sendStatus(409)
    }

    res.sendStatus(200)
}

async function getPosts(req, res) {
    let posts = await req.user.friends.mapAsync(user => user.getPosts())
    posts.push(await req.user.getPosts())

    posts = posts.map(collection => collection.models).flat()
    posts.sort((a, b) => b.created_at - a.created_at)
    
    res.send(posts)
}

module.exports = { add, remove, getPosts }
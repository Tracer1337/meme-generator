const moment = require("moment")

const User = require("../../app/Models/User.js")
const Upload = require("../../app/Models/Upload.js")
const Post = require("../../app/Models/Post.js")

function randomTimestamp() {
    const offset = Math.random() * 1000 * 3600 * 24 * 7
    return moment(moment() - offset)
}

module.exports = {
    table: "posts",

    run: async () => {
        const uploads = await Upload.getAll()
        const users = await User.getAll()

        await uploads.mapAsync(async upload => {
            const user = users.random()

            const post = new Post({
                user_id: user.id,
                upload_id: upload.id,
                created_at: randomTimestamp()
            })
            
            await post.store()
        })
    }
}
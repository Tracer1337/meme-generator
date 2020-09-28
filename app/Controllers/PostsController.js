const fs = require("fs")

const Post = require("../Models/Post.js")
const Upload = require("../Models/Upload.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const UploadServiceProvider = require("../Services/UploadServiceProvider.js")
const { changeExtension } = require("../utils")

async function getAll(req, res) {
    const posts = await Post.where("id = id")
    posts.sort((a, b) => b.created_at - a.created_at)
    res.send(posts)
}

async function create(req, res) {
    await ImageServiceProvider.formatImage({ path: req.file.path })

    const newFilename = changeExtension(req.file.filename, "jpg")

    try {
        let upload = await UploadServiceProvider.uploadFile(req, req.file.path, newFilename)

        await upload.store()

        // Get upload model with id
        upload = await Upload.findBy("filename", upload.filename)

        const post = new Post({
            user_id: req.user.id,
            upload_id: upload.id
        })

        await post.store()

        res.send(post)

    } catch(error) {
        console.error(error)
        res.sendStatus(500)
    } finally {
        await fs.promises.unlink(req.file.path)
    }
}

async function getByUser(req, res) {
    const posts = await Post.findAllBy("user_id", req.params.id, {
        initArgs: { initUser: false }
    })

    res.send(posts)
}


async function deletePost(req, res) {
    const post = await Post.findBy("id", req.params.id)

    if (!post) {
        return res.sendStatus(404)
    }

    await post.delete()

    return res.sendStatus(200)
}

module.exports = { getAll, create, getByUser, delete: deletePost }
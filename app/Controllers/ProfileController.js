const fs = require("fs")

const StorageFacade = require("../Facades/StorageFacade.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const { changeExtension } = require("../utils")
const { VISIBILITY } = require("../../config/constants.js")

async function getProfile(req, res) {
    res.send(req.user)
}

async function getTemplates(req, res) {
    const templates = req.user.templates.filter(template => template.visibility !== VISIBILITY["GLOBAL"])
    res.send(templates)
}

async function getFriends(req, res) {
    res.send(req.user.friends)
}

async function uploadAvatar(req, res) {
    try {
        if (req.user.avatar_filename) {
            try {
                await StorageFacade.deleteFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + req.user.avatar_filename)
            } catch (error) {
                console.error(error)
            }
        }

        await ImageServiceProvider.formatImage({ path: req.file.path }, {
            format: "png",
            maxWidth: 128,
            aspectRatio: 1
        })

        const newFilename = changeExtension(req.file.filename, "png")

        await StorageFacade.uploadFile(req.file.path, process.env.AWS_BUCKET_PUBLIC_DIR + "/" + newFilename)

        req.user.avatar_filename = newFilename

        await req.user.update()

        res.send(req.user)
    } catch (error) {
        console.error(error)
    } finally {
        await fs.promises.unlink(req.file.path)
    }
}

module.exports = { getProfile, getTemplates, getFriends, uploadAvatar }
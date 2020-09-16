const fs = require("fs")

const StorageFacade = require("../Facades/StorageFacade.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const Sticker = require("../Models/Sticker.js")
const { changeExtension } = require("../utils")
const config = require("../../config")

/**
 * Get all stickers
 */
async function getAll(req, res) {
    const stickers = await Sticker.getAll()

    res.send(stickers)
}

/**
 * Create new sticker
 */
async function create(req, res) {
    // Format image and override uploaded one
    const newImage = await ImageServiceProvider.formatImage(req.file.path, "png")
    await fs.promises.writeFile(req.file.path, newImage)

    // Store new image in local storage
    const newFilename = changeExtension(req.file.filename, "png")
    await StorageFacade.uploadFileLocal(req.file.path, newFilename)

    // Create new model
    const sticker = new Sticker({
        image_url: `/${config.paths.storage}/${newFilename}`
    })
    await sticker.store()

    await fs.promises.unlink(req.file.path)

    res.send(sticker)
}

/**
 * Delete sticker
 */
async function remove(req, res) {
    const sticker = await Sticker.findBy("id", req.params.id)

    if (!sticker) {
        return res.status(404).end()
    }

    await sticker.delete()

    res.send(sticker)
}

/**
 * Increment amount_uses counter from sticker
 */
async function registerUse(req, res) {
    const sticker = await Sticker.findBy("id", req.params.id)

    if (!sticker) {
        return res.status(404).end()
    }

    sticker.amount_uses++

    await sticker.update()

    res.send(sticker)
}

module.exports = { getAll, create, remove, registerUse }
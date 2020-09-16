const fs = require("fs")

const StorageFacade = require("../Facades/StorageFacade.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const Template = require("../Models/Template.js")
const { changeExtension } = require("../utils")
const config = require("../../config")

/**
 * Get all templates
 */
async function getAll(req, res) {
    const templates = await Template.getAll()

    res.send(templates)
}

/**
 * Create new template
 */
async function create(req, res) {
    // Format image and override uploaded one
    const newImage = await ImageServiceProvider.formatImage(req.file.path)
    await fs.promises.writeFile(req.file.path, newImage)

    // Store new image in local storage
    const newFilename = changeExtension(req.file.filename, "jpeg")
    await StorageFacade.uploadFileLocal(req.file.path, newFilename)

    // Create new model
    const template = new Template({
        label: req.body.label,
        image_url: `/${config.paths.storage}/${newFilename}`,
        meta_data: req.body.meta_data
    })
    await template.store()

    await fs.promises.unlink(req.file.path)

    res.send(template)
}

/**
 * Edit  template
 */
async function edit(req, res) {
    const template = await Template.findBy("id", req.body.id)

    if (!template) {
        return res.status(404).end()
    }

    template.label = req.body.label
    template.meta_data = JSON.stringify(req.body.meta_data)

    await template.update()

    res.send(template)
}

/**
 * Delete template
 */
async function remove(req, res) {
    const template = await Template.findBy("id", req.params.id)

    if (!template) {
        return res.status(404).end()
    }

    await template.delete()

    res.send(template)
}

/**
 * Increment amount_uses counter from template
 */
async function registerUse(req, res) {
    const template = await Template.findBy("id", req.params.id)

    if (!template) {
        return res.status(404).end()
    }

    template.amount_uses++

    await template.update()

    res.send(template)
}

module.exports = { getAll, create, edit, remove, registerUse }
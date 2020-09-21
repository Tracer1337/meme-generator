const StorageFacade = require("../Facades/StorageFacade.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const Template = require("../Models/Template.js")
const { changeExtension, createTempFile } = require("../utils")
const config = require("../../config")

/**
 * Get all templates
 */
async function getAll(req, res) {
    const templates = await Template.where("user_id IS NULL")

    res.send(templates)
}

/**
 * Create new template
 */
async function create(req, res) {
    const { rootElement } = req.body.model

    // Format image and create temp file from it
    const newImage = await ImageServiceProvider.formatBase64Image(rootElement.image)
    const tempImage = await createTempFile(newImage, "png")
    delete rootElement.image

    // Store new image in local storage
    const newFilename = changeExtension(tempImage.filename, "jpeg")
    await StorageFacade.uploadFileLocal(tempImage.path, newFilename)
    await tempImage.delete()

    // Create new model
    const template = new Template({
        label: rootElement.label,
        image_url: `/${config.paths.storage}/${newFilename}`,
        model: req.body.model,
        user_id: req.user.id
    })
    await template.store()

    res.send(template)
}

/**
 * Edit template
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
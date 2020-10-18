const StorageFacade = require("../Facades/StorageFacade.js")
const ImageServiceProvider = require("../Services/ImageServiceProvider.js")
const Template = require("../Models/Template.js")
const User = require("../Models/User.js")
const { changeExtension, createTempFile, paginate } = require("../utils")
const config = require("../../config")
const { VISIBILITY } = require("../../config/constants.js")

/**
 * Get all templates
 */
async function getAll(req, res) {
    let templates = await Template.where(`visibility = ${VISIBILITY["GLOBAL"]}`)

    templates.sort((a, b) => b.amount_uses - a.amount_uses)

    res.send(templates)
}

/**
 * Create new template
 */
async function create(req, res) {
    if (req.body.visibility === VISIBILITY["GLOBAL"] && !req.user.is_admin) {
        return res.sendStatus(403)
    }
    
    const { rootElement } = req.body.model

    // Format image and create temp file from it
    const newImage = await ImageServiceProvider.formatImage({ base64: rootElement.image })
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
        user_id: req.user.id,
        visibility: req.body.visibility
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

async function getByUser(req, res) {
    const user = await User.findBy("id", req.params.id)

    if (!user) {
        return res.sendStatus(404)
    }

    const templates = await user.getTemplates()

    templates.sort((a, b) => b.amount_uses - a.amount_uses)

    res.send(templates)
}

module.exports = { getAll, create, edit, remove, registerUse, getByUser }

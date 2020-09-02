const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Template = require("../../app/Models/Template.js")
const { randomFileName, getFileExtension } = require("../../app/utils")

const TEMPLATES_DIR = path.join(__dirname, "templates")

module.exports = {
    table: "templates",

    run: async () => {
        // Get templates from templates/templates.json
        const templates = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, "templates.json"), "utf8"))

        await Promise.all(templates.map(async (template) => {
            // Store image in local storage
            const filename = randomFileName() + getFileExtension(template.image)
            await StorageFacade.uploadFileLocal(path.join(TEMPLATES_DIR, template.image), filename)

            // Create database entry
            const model = new Template({
                label: template.label,
                image_url: "/storage/" + filename,
                meta_data: JSON.stringify(template.meta_data)
            })

            await model.store()
        }))
    }
}
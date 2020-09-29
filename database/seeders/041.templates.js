const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Template = require("../../app/Models/Template.js")
const User = require("../../app/Models/User.js")
const { randomFileName, getFileExtension } = require("../../app/utils")
const { VISIBILITY } = require("../../config/constants.js")

const TEMPLATES_DIR = path.join(__dirname, "..", "..", "prod_database")

module.exports = {
    table: "templates",

    run: async () => {
        // Get templates from templates/templates.json
        const templates = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, "templates.json"), "utf8"))
        templates.forEach(template => template.meta_data = JSON.parse(template.meta_data))

        await Promise.all(templates.map(async (template) => {
            const model = {
                rootElement: {
                    type: "image",
                    label: template.label
                },
                elements: template.meta_data.textboxes.map(textbox => ({
                    type: "textbox",
                    data: {
                        ...textbox
                    }
                })),
                border: template.meta_data.border
            }

            // Create database entry
            await new Template({
                ...template,
                model: model,
                user_id: (await User.getAll())[0].id,
                visibility: VISIBILITY["GLOBAL"]
            }).store()
        }))
    }
}
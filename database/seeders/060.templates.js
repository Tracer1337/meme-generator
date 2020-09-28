const path = require("path")
const fs = require("fs")

const StorageFacade = require("../../app/Facades/StorageFacade.js")
const Template = require("../../app/Models/Template.js")
const User = require("../../app/Models/User.js")
const { randomFileName, getFileExtension } = require("../../app/utils")
const { VISIBILITY } = require("../../config/constants.js")

const TEMPLATES_DIR = path.join(__dirname, "templates")

module.exports = {
    table: "templates",

    run: async () => {
        // Get templates from templates/templates.json
        const templates = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, "templates.json"), "utf8"))

        const user = await User.findBy("username", "first_user")

        await Promise.all(templates.map(async (template) => {
            // Store image in local storage
            const filename = randomFileName() + getFileExtension(template.image)
            await StorageFacade.uploadFileLocal(path.join(TEMPLATES_DIR, template.image), filename)

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
                border: template.border
            }

            // Create database entry
            await new Template({
                label: template.label,
                image_url: "/storage/" + filename,
                user_id: user.id,
                model: model,
                visibility: VISIBILITY["GLOBAL"]
            }).store()
        }))
    }
}
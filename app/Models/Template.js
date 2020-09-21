const Model = require("../../lib/Model.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const config = require("../../config")

class Template extends Model {
    static findBy = Model.findBy.bind({ model: Template, table: "templates" })
    static findAllBy = Model.findAllBy.bind({ model: Template, table: "templates" })
    static where = Model.where.bind({ model: Template, table: "templates" })
    static getAll = Model.getAll.bind({ model: Template, table: "templates" })

    constructor(values) {
        super({
            table: "templates",
            columns: ["id", "label", "image_url", "model", "amount_uses", "user_id"],
            ...values
        })
    }

    async delete() {
        // Delete image from storage
        try {
            await StorageFacade.deleteFileLocal(this.image_url.replace(`/${config.paths.storage}/`, ""))
        } catch {}

        return super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            image_url: this.image_url,
            model: this.model,
            amount_uses: this.amount_uses,
            user_id: this.user_id
        }
    }
}

module.exports = Template
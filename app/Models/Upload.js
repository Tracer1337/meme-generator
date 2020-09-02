const Model = require("../../lib/Model.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const config = require("../../config")

class Upload extends Model {
    static findBy = Model.findBy.bind({ model: Upload, table: "uploads" })
    static findAllBy = Model.findAllBy.bind({ model: Upload, table: "uploads" })
    static where = Model.where.bind({ model: Upload, table: "uploads" })
    static getAll = Model.getAll.bind({ model: Upload, table: "uploads" })

    constructor(values) {
        super({
            table: "uploads",
            columns: ["id", "filename", "request_ip_address", "created_at", "is_hidden"],
            ...values
        })
    }

    async init() {
        // Convert buffer ([0] || [1]) to boolean
        this.is_hidden = !!this.is_hidden[0]
    }

    async delete() {
        // Delete image from storage
        try {
            await StorageFacade.deleteFileLocal(this.image_url.replace(`/${config.paths.storage}/`, ""))
        } catch { }

        return super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            filename: this.filename,
            is_hidden: this.is_hidden
        }
    }
}

module.exports = Upload
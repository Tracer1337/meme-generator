const Model = require("../../lib/Model.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const config = require("../../config")
const { removeExtension } = require("../utils")

class Upload extends Model {
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
        await StorageFacade.deleteFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + this.filename)
        
        return super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            filename: this.filename,
            is_hidden: this.is_hidden,

            url: "/upload/" + this.filename,
            embedUrl: "/upload/" + removeExtension(this.filename),
            altUrl: "/nudes/" + this.filename,
            altEmbedUrl: "/nudes/" + removeExtension(this.filename)
        }
    }
}

Model.passMethods(Upload, "uploads")

module.exports = Upload
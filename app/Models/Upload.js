const Model = require("../../lib/Model.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const config = require("../../config")
const { removeExtension } = require("../utils")

class Upload extends Model {
    constructor(values) {
        super({
            table: "uploads",
            columns: ["id", "filename", "request_ip_address", "created_at"],
            ...values
        })
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

            url: "/upload/" + this.filename,
            embedUrl: "/upload/" + removeExtension(this.filename),
            altUrl: "/nudes/" + this.filename,
            altEmbedUrl: "/nudes/" + removeExtension(this.filename)
        }
    }
}

Model.bind(Upload, "uploads")

module.exports = Upload
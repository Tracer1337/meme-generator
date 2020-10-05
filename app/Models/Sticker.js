const Model = require("../../lib/Model.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const config = require("../../config")

class Sticker extends Model {
    constructor(values) {
        super({
            table: "stickers",
            columns: ["id", "image_url", "amount_uses"],
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
            image_url: this.image_url,
            amount_uses: this.amount_uses
        }
    }
}

Model.bind(Sticker, "stickers")

module.exports = Sticker
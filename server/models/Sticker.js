const Model = require("../lib/Model.js")

class Sticker extends Model {
    constructor(args) {
        const attributes = ["image_url", "amount_uses"]
        super(attributes, args)
    }
}

module.exports = Sticker
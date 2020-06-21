const Model = require("../lib/Model.js")

class Template extends Model {
    constructor(args) {
        const attributes = ["label", "image_url", "meta_data", "amount_uses"]
        super(attributes, args)
    }
}

module.exports = Template
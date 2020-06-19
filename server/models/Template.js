class Template {
    constructor({ label, image_url, meta_data, amount_uses }) {
        this.label = label
        this.image_url = image_url
        this.meta_data = meta_data
        this.amount_uses = amount_uses
    }

    toObject() {
        return {
            label: this.label,
            image_url: this.image_url,
            meta_data: this.meta_data,
            amount_uses: this.amount_uses
        }
    }
}

module.exports = Template
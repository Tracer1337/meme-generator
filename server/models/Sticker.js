class Sticker {
    constructor({ image_url, amount_uses }) {
        this.image_url = image_url
        this.amount_uses = amount_uses
    }

    toObject() {
        return {
            image_url: this.image_url,
            amount_uses: this.amount_uses
        }
    }
}

module.exports = Sticker
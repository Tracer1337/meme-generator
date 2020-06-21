class Model {
    constructor(attributes, args) {
        this.attributes = attributes

        if(!this.attributes) {
            throw new Error("No attributes defined")
        }

        for(let name of this.attributes) {
            if(typeof args[name] === "undefined") {
                throw new Error(`The attribute ${name} is missing`)
            }

            this[name] = args[name]
        }
    }

    toObject() {
        const result = {}

        for(let name of this.attributes) {
            result[name] = this[name]
        }

        return result
    }
}

module.exports = Model
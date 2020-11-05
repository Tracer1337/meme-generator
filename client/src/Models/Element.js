class Element {
    static fromTemplate(data) {
        return new Element({
            type: data.type,
            data: {
                defaultValues: data.data,
                fromTemplate: true
            },
            id: data.id
        })
    }

    constructor({ type, data, id }) {
        this.type = type
        this.data = data
        this.id = id
    }

    toJSON() {
        const result = {...this}

        delete result.data.defaultValues
        delete result.data.fromTemplate

        return result
    }
}

export default Element
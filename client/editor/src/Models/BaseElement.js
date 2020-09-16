import { BASE_ELEMENT_TYPES } from "../config/constants.js"

let idCounter = 0

class BaseElement {
    constructor({ id, type, ...props }) {
        this.id = idCounter++
        this.type = type
        this.childElements = {}

        if (type === BASE_ELEMENT_TYPES["IMAGE"]) {
            this.image = props.image
            this.label = props.label
        }
    }

    setChildElement(index, element) {
        this.childElements[index] = element
    }

    findElement(element) {
        if (this.id === element.id) {
            return this
        }

        for (let childElement of Object.values(this.childElements)) {
            const foundElement = childElement.findElement(element)
            
            if (foundElement) {
                return foundElement
            }
        }
    }
}

export default BaseElement
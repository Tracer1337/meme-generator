import { BASE_ELEMENT_TYPES } from "../config/constants.js"

let idCounter = 0

class BaseElement {
    constructor(props) {
        this.id = idCounter++
        this.type = props.type

        this.parent = null
        this.parentConnection = null
        this.childElements = {}
        this.connections = []

        this.setDimensions({ x: 0, y: 0, r: 1 })
        
        if (props.type === BASE_ELEMENT_TYPES["IMAGE"]) {
            this.image = props.image
            this.label = props.label
        }
    }

    setParent(baseElement, parentConnectionIndex) {
        this.parent = baseElement
        this.parentConnection = (parentConnectionIndex + 2) % 4

        this.addConnection(this.parentConnection)
        
        if (this.parentConnection % 2 === 0) {
            this.x = this.parent.x
            this.y = this.parent.y + (this.parent.height * (this.parentConnection === 2 ? -1 : 1))
        } else {
            this.x = this.parent.x + (this.parent.width * (this.parentConnection === 1 ? -1 : 1))
            this.y = this.parent.y
        }
    }

    setDimensions(dimensions) {
        this.x = dimensions.x ?? this.x
        this.y = dimensions.y ?? this.y
        this.r = dimensions.r ?? this.r

        this.width = 1
        this.height = (this.width / this.r)
    }

    addConnection(index) {
        this.connections.push(index)
    }

    hasConnection(index) {
        return this.connections.includes(index)
    }

    setChildElement(element, index) {
        this.childElements[index] = element
        this.addConnection(index)
    }

    // findElement(element) {
    //     if (this.id === element.id) {
    //         return this
    //     }

    //     for (let childElement of Object.values(this.childElements)) {
    //         const foundElement = childElement.findElement(element)
            
    //         if (foundElement) {
    //             return foundElement
    //         }
    //     }
    // }
}

export default BaseElement
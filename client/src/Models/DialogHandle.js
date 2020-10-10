import Emittable from "./Emittable.js"

class DialogHandle extends Emittable {
    constructor({ element, data = {}, id, isOpen = true }) {
        super()
        
        this.element = element
        this.data = data
        this.id = id
        this.isOpen = isOpen
        this.historyKey = null
    }

    set(data) {
        Object.assign(this.data, data)
        this.dispatchEvent("update")
    }
}

export default DialogHandle
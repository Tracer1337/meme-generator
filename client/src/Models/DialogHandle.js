class DialogHandle {
    constructor({ element, data = {}, id, isOpen = true }) {
        this.element = element
        this.data = data
        this.id = id
        this.isOpen = isOpen

        this.listeners = []
    }

    addListener(event, fn) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }

        this.listeners[event].push(fn)
    }
    
    removeListener(event, fn) {
        if (this.listeners[event]) {
            const index = this.listeners[event].findIndex(listener => listener === fn)
            this.listeners[event].splice(index, 1)
        }
    }

    dispatch(event, args = []) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(fn => fn(...args))
        }
    }

    set(data) {
        Object.assign(this.data, data)
        this.dispatch("update")
    }
}

export default DialogHandle
import Emittable from "../Models/Emittable.js"
import settingsOptions from "../config/settings-options.json"

class State extends Emittable {
    constructor() {
        super()

        Object.assign(this, {
            password: localStorage.getItem("password"),

            auth: {
                user: null,
                isLoggedIn: false,
                token: localStorage.getItem("token")
            },

            isEmptyState: true,
            currentTemplate: null,
            focus: null,
            rootElement: null,
            elements: [],
            drawing: {
                enabled: false,
                color: settingsOptions.colors["Red"],
                lineWidth: settingsOptions.lineWidth[1]
            }
        })
    }
}

export default State
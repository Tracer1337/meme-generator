import Emittable from "../Models/Emittable.js"
import settingsOptions from "../config/settings-options.json"

export const defaultBorderValues = {
    size: 0,
    top: true,
    bottom: true,
    left: false,
    right: false,
    color: "white"
}

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
            
            editor: {
                isEmptyState: true,
                currentTemplate: null,
                focus: null,

                drawing: {
                    enabled: false,
                    color: settingsOptions.colors["Red"],
                    lineWidth: settingsOptions.lineWidth[1]
                },
                
                model: {
                    rootElement: null,
                    elements: [],

                    border: defaultBorderValues,
                }
            }
        })
    }
}

export default State
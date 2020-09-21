const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")
const Template = require("./Template.js")

class User extends Model {
    constructor(values) {
        super({
            table: "users",
            columns: ["id", "username", "email", "password", "created_at"],
            defaultValues: {
                id: () => uuid(),
                created_at: () => moment()
            },
            ...values
        })
    }

    async init() {
        this.templates = await Template.findAllBy("user_id", this.id)
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            created_at: this.created_at,
            templates: this.templates
        }
    }
}

Model.passMethods(User, "users")

module.exports = User
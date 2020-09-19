const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")

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

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            created_at: this.created_at
        }
    }
}

Model.passMethods(User, "users")

module.exports = User
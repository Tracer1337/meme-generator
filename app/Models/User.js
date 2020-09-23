const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")
const Template = require("./Template.js")
const { queryAsync } = require("../utils/index.js")

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

    async init({ authorized = false } = {}) {
        this.templates = await Template.findAllBy("user_id", this.id)
        
        if (authorized) {
            this.friends = await this.getFriends()
        }
    }

    async getFriends() {
        const query = `SELECT * FROM friends INNER JOIN users ON friends.to_user_id = users.id WHERE friends.from_user_id = '${this.id}'`
        const rows = await queryAsync(query)
        return User.fromRows(rows)
    }

    async addFriend(user) {
        if (this.friends.some(({ id }) => user.id === id)) {
            return false
        }
        
        const query = `INSERT INTO friends VALUES ('${uuid()}', '${this.id}', '${user.id}', '${moment()}')`
        await queryAsync(query)

        return true
    }

    async removeFriend(user) {
        if (!this.friends.some(({ id }) => user.id === id)) {
            return false
        }
        
        const query = `DELETE FROM friends WHERE from_user_id = '${this.id}' AND to_user_id = '${user.id}'`
        await queryAsync(query)

        return true
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            created_at: this.created_at,
            templates: this.templates,
            friends: this.friends
        }
    }
}

Model.passMethods(User, "users")

module.exports = User
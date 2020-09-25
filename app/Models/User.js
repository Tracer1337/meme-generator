const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")
const Template = require("./Template.js")
const Post = require("./Post.js")
const StorageFacade = require("../Facades/StorageFacade.js")
const { queryAsync } = require("../utils/index.js")

class User extends Model {
    constructor(values) {
        super({
            table: "users",
            columns: ["id", "username", "email", "password", "avatar_filename", "created_at"],
            defaultValues: {
                id: () => uuid(),
                created_at: () => moment()
            },
            ...values
        })
    }

    async init({ authorized = false } = {}) {
        this.templates = await Template.findAllBy("user_id", this.id)
        this.created_at = moment(this.created_at)
        
        if (authorized) {
            this.friends = (await this.getFriends()) || []
            await this.friends.mapAsync(user => user.init())
        }
    }

    async delete() {
        await StorageFacade.deleteFile(process.env.AWS_BUCKET_PUBLIC_DIR + "/" + this.avatar_filename)
        
        return super.delete()
    }

    async getFriends() {
        const query = `SELECT * FROM friends INNER JOIN users ON friends.to_user_id = users.id WHERE friends.from_user_id = '${this.id}'`
        const rows = await queryAsync(query)
        return User.fromRows(rows)
    }

    async getPosts() {
        return await Post.findAllBy("user_id", this.id)
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

    getColumns() {
        const values = super.getColumns()
        values.created_at = values.created_at.format()
        return values
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            created_at: this.created_at,
            templates: this.templates,
            friends: this.friends,
            avatar_url: this.avatar_filename ? "/upload/" + this.avatar_filename : null
        }
    }
}

Model.passMethods(User, "users")

module.exports = User
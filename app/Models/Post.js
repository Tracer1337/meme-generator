const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")
const Upload = require("./Upload.js")

let User

class Post extends Model {
    constructor(values) {
        super({
            table: "posts",
            columns: ["id", "user_id", "upload_id", "created_at"],
            defaultValues: {
                id: () => uuid(),
                created_at: () => moment()
            },
            ...values
        })

        User = require("./User.js")
    }

    async init() {
        this.upload = await Upload.findBy("id", this.upload_id)
        this.user = await User.findBy("id", this.user_id)
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            upload: this.upload,
            created_at: this.created_at
        }
    }
}

Model.passMethods(Post, "posts")

module.exports = Post
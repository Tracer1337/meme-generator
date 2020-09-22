const { v4: uuid } = require("uuid")
const moment = require("moment")
const Model = require("../../lib/Model.js")
const Upload = require("./Upload.js")

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
    }

    async init() {
        this.upload = await Upload.findBy("id", this.upload_id)
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            upload: this.upload,
            created_at: this.created_at
        }
    }
}

Model.passMethods(Post, "posts")

module.exports = Post
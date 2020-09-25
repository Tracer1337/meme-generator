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

    async init({ initUser = true } = {}) {
        this.upload = await Upload.findBy("id", this.upload_id)
        this.created_at = moment(this.created_at)

        if (initUser) {
            this.user = await User.findBy("id", this.user_id)
        }
    }
    
    getColumns() {
        const values = super.getColumns()
        values.created_at = values.created_at.format()
        return values
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
const from = process.argv[2]
const to = process.argv[3]

if(!from || !to) {
    throw new Error("Missing parameter")
}

const createConnection = require("../utils/connectToDB.js")

const db = createConnection()

db.query("SELECT * FROM templates", async (error, result) => {
    if (error) throw error

    for (let template of result) {
        if (template.image_url.includes(from)) {
            const newUrl = template.image_url.replace(from, to)
            const sql = `UPDATE templates SET image_url = "${newUrl}" WHERE id = ${template.id}`

            await new Promise(resolve => db.query(sql, (error) => {
                if(error) throw error
                resolve()
            }))
        }
    }

    db.end()
})
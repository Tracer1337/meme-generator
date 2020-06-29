const express = require("express")
const router = express.Router()

const { db } = require("../../utils/connectToDB.js")

function awaitQuery(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if(error) reject(error)
            else resolve(result)
        })
    })
}

// Get index page
router.get("/", async (req, res) => {
    const firstQuery = "SELECT COUNT(*) as amount_templates FROM templates WHERE id = id"
    const secondQuery = "SELECT SUM(amount_uses) as total_template_uses FROM templates WHERE id = id"

    try {
        const amountTemplates = (await awaitQuery(firstQuery))[0].amount_templates
        const totalTemplateUses = (await awaitQuery(secondQuery))[0].total_template_uses
        res.render("index", { amountTemplates, totalTemplateUses })
    } catch(error) {
        console.log(error)
        res.status(500)
        res.end()
    }
})

module.exports = router
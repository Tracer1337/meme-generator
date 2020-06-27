const express = require("express")
const router = express.Router()

const { db } = require("../../utils/connectToDB.js")

// Get index page
router.get("/", (req, res) => {
    const sql = "SELECT COUNT(*) as amount_templates FROM templates WHERE id = id"

    db.query(sql, (error, results) => {
        if(error) throw error

        if(results.length > 0) {
            res.render("index", { amount_templates: results[0].amount_templates })
        } else {
            res.status(500)
            res.end()
        }
    })
})

module.exports = router
const fs = require("fs")
const path = require("path")
const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")

const { queryAsync } = require("../app/utils")

const ROOT_DIR = path.join(__dirname, "..")

const rootRouter = express.Router()

/**
 * Serve landing page
 */
rootRouter.get("/", async (req, res) => {
    const firstQuery = "SELECT COUNT(*) as amount_templates FROM templates WHERE id = id"
    const secondQuery = "SELECT SUM(amount_uses) as total_template_uses FROM templates WHERE id = id"

    try {
        const amountTemplates = (await queryAsync(firstQuery))[0].amount_templates
        const totalTemplateUses = (await queryAsync(secondQuery))[0].total_template_uses
        res.render("index", { amountTemplates, totalTemplateUses })
    } catch (error) {
        console.log(error)
        res.status(500).end()
    }
})

/**
 * Serve static views (name.static.pug)
 */
fs.readdirSync(path.join(ROOT_DIR, "views", "static")).forEach(filename => {
    const route = filename.replace(".pug", "")

    rootRouter.get("/" + route, (req, res) => {
        res.render("static/" + route)
    })
})

/**
 * Create routes from files in current directory
 */
const routes = fs.readdirSync(__dirname)
                .filter(filename => filename !== "index.js")
                .map(filename => [filename.slice(0, -3), require("./" + filename)])

for(let [route, router] of routes) {
    rootRouter.use("/" + route, router)
}

rootRouter.use("/nudes", require("./upload.js"))

/**
 * Serve static files
 */
rootRouter.use(express.static(path.join(ROOT_DIR, "public")))

rootRouter.use("/storage", express.static(path.join(ROOT_DIR, "storage")))

/**
 * Serve react app
 */
if (process.env.NODE_ENV === "development") {
    // Proxy react dev-server
    rootRouter.use("/editor", createProxyMiddleware({
        target: "http://localhost:3000/",
        ws: true
    }))
} else {
    rootRouter.get("/*", (req, res) => res.sendFile(path.resolve(ROOT_DIR, "public", "editor", "index.html")))
}

module.exports = rootRouter
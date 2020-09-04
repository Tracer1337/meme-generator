const path = require("path")
const fs = require("fs")
const ncp = require("ncp").ncp
const rmdir = require("rimraf")
const { makeRunnable, run, exec } = require("@m.moelter/task-runner")

const ROOT_DIR = path.join(__dirname, "..")
const EDITOR_DIR = path.join(ROOT_DIR, "client", "editor")
const BUILD_DIR = path.join(EDITOR_DIR, "build")
const INDEX_HTML_DIR = path.join(EDITOR_DIR, "public", "index.html")
const CORDOVA_WWW_DIR = path.join(ROOT_DIR, "cordova", "www")

/**
 * Starting script
 */

makeRunnable(async () => {
    try {
        // Create react production build
        await run(async () => {
            // Insert cordova.js script tag into index.html
            await replaceVarInHTML("scripts", `<script src="cordova.js"></script>`)

            await exec("cd ./client/editor && npm run build-cordova")

            await resetHTML()
        }, "Create react build")

        // Put build files into cordova www/ folder and run cordova on attached device
        await run(async () => {
            // Empty cordova/www directory
            await new Promise(resolve => {
                rmdir(CORDOVA_WWW_DIR, async (error) => {
                    if (error) throw error
                    resolve()
                })
            })

            // Copy react build files into www folder
            await new Promise(resolve => {
                ncp(BUILD_DIR, CORDOVA_WWW_DIR, (error) => {
                    if (error) throw error
                    resolve()
                })
            })

            // Start cordova
            await exec("cd ./cordova && cordova run android --device")
        }, "Start cordova")
    } catch (error) {
        // Make sure, that the index.html is resetted even if the script crashes
        await resetHTML()
        throw error
    }
})()

let originalHTML

async function replaceVarInHTML(name, content) {
    const fileContent = await fs.promises.readFile(INDEX_HTML_DIR, "utf-8")

    if (!originalHTML) {
        originalHTML = fileContent
    }

    const newFileContent = fileContent.replace(new RegExp(`<!--\\s*%${name}%\\s*-->`, "gi"), content)
    await fs.promises.writeFile(INDEX_HTML_DIR, newFileContent)
}

async function resetHTML() {
    if (originalHTML) {
        await fs.promises.writeFile(INDEX_HTML_DIR, originalHTML)
    }
}
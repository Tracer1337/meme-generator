const path = require("path")
const fs = require("fs")
const ncp = require("ncp").ncp
const rmdir = require("rimraf")
const readline = require("readline")
const chalk = require("chalk")
const { makeRunnable, run, exec } = require("@m.moelter/task-runner")

const ROOT_DIR = path.join(__dirname, "..")
const EDITOR_DIR = path.join(ROOT_DIR, "client", "editor")
const BUILD_DIR = path.join(EDITOR_DIR, "build")
const CORDOVA_WWW_DIR = path.join(ROOT_DIR, "cordova", "www")

/**
 * Starting script
 */

let isRunning = false

const runnable = makeRunnable(async () => {
    isRunning = true

    // Create react production build
    await run(async () => {
        await exec("cd ./client/editor && npm run build-cordova")
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

    isRunning = false
})

/**
 * Listen to reload event
 */

runnable()

// function logReloadAdvice() {
//     console.log(chalk.green("Press 'r' to reload"))
// }

// ;(async () => {
//     await runnable()
//     logReloadAdvice()

//     readline.emitKeypressEvents(process.stdin)

//     process.stdin.on("keypress", async (char, key) => {
//         if (key.name === "r") {
//             if (isRunning) {
//                 return
//             }

//             await runnable()
//             logReloadAdvice()
//         }

//         // Break script when pressing ctrl + c
//         if (key.ctrl && key.name === "c") {
//             process.stdin.removeAllListeners()
//             process.stdin.setRawMode(false)
//         }
//     })

//     process.stdin.setRawMode(true)
// })()
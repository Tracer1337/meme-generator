import { useEffect, useContext } from "react"

import { AppContext } from "../App.js"

// Safari does not support BroadcastChannel
const supportsBroadcastChannel = !!window.BroadcastChannel

function OfflineUseAlerts() {
    const context = useContext(AppContext)

    useEffect(() => {
        if (!supportsBroadcastChannel) {
            return
        }

        const channel = new BroadcastChannel("sw-0")

        channel.addEventListener("message", function ({ data: message }) {
            if (message === "content-cached") {
                context.openSnackbar("The app is cached for offline use")
            } else if (message === "content-available") {
                context.openSnackbar("A new version is available. Restart the app to see it")
            }
        })

        return () => channel.close()
    }, [context])

    return null
}

export default OfflineUseAlerts
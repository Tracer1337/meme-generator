import { useEffect, useRef } from "react"

import { createListeners } from "../utils/index.js"

function BackButtonHandler({ onBackButton }) {
    const isForwardCall = useRef()

    useEffect(() => {
        return createListeners(window, [
            ["popstate", (event) => {
                if (isForwardCall.current) {
                    isForwardCall.current = false
                    return
                }
                isForwardCall.current = true
                window.history.forward()
                onBackButton()
            }]
        ])
    })

    return null
}

export default BackButtonHandler
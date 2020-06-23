import React, { useEffect } from "react"
import Hammer from "hammerjs"

import makeElement from "./makeElement.js"

function TouchBox({ id, dimensions, onFocus, container }, forwardedRef) {
    // Add multitouch listeners
    useEffect(() => {
        const element = document.getElementById("element-" + id)

        const transform = {
            rotation: 0
        }

        const applyTransform = () => element.style.transform = `rotate(${transform.rotation}deg)`

        const manager = new Hammer.Manager(container.current, {
            recognizers: [
                [Hammer.Rotate],
                [Hammer.Pinch, null, ["rotate"]]
            ]
        })

        /**
         * Handle Rotation
         */

        let startRotation = 0
        let lastRotation = 0

        manager.on("rotatestart", (event) => {
            lastRotation = transform.rotation
            startRotation = event.rotation
        })

        manager.on("rotateend", (event) => {
            lastRotation = transform.rotation
        })

        manager.on("rotatemove", (event) => {
            const diff = startRotation - event.rotation
            transform.rotation = lastRotation - diff
            applyTransform()
        })

        /**
         * Handle Resizing
         */
    }, [])

    return (
        <div
            id={`element-${id}`}
            ref={forwardedRef}
            onClick={onFocus}
            onTouchStart={onFocus}

            style={{
                width: dimensions.width + "px",
                height: dimensions.height + "px",
                background: "white",
                border: "1px solid black"
            }}
        />
    )
}

export default makeElement({
    controls: ["resize", "rotate", "remove"],
    defaultValues: {
        width: 160,
        height: 24,
        zIndex: 5
    },
    Child: React.forwardRef(TouchBox)
})
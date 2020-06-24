import React from "react"

import makeElement from "./makeElement.js"

function TouchBox({ id, dimensions, onFocus }, forwardedRef) {
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
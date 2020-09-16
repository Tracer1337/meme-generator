import React, { useRef, useImperativeHandle } from "react"

function Blank({ baseElement, handle, ...props }) {
    const ref = useRef()

    useImperativeHandle(handle, () => ({
        getRatio: () => 1,
        getElement: () => ref.current
    }))

    return (
        <div ref={ref} {...props}/>
    )
}

export default Blank
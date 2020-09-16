import React, { useRef, useImperativeHandle } from "react"

function Image({ baseElement, handle, ...props }) {
    const ref = useRef()

    const handleGetRatio = () => {
        const { naturalWidth, naturalHeight } = ref.current
        return naturalHeight / naturalWidth
    }

    useImperativeHandle(handle, () => ({
        getRatio: handleGetRatio,
        getElement: () => ref.current
    }))

    return (
        <img
            alt=""
            ref={ref}
            src={baseElement.image}
            {...props}
        />
    )
}

export default Image
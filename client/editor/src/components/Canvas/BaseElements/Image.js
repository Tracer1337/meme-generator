import React, { useRef, useImperativeHandle } from "react"

function Image({ baseElement, ...props }, forwardedRef) {

    const ref = useRef()

    const handleGetRatio = () => {
        const { naturalWidth, naturalHeight } = ref.current
        return naturalWidth / naturalHeight
    }

    useImperativeHandle(forwardedRef, () => ({
        getRatio: handleGetRatio,
        get element() {
            return ref.current
        }    
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

export default React.forwardRef(Image)
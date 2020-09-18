import React from "react"

function makeBaseElement(Child) {
    return React.forwardRef((props, ref) => {
        return (
            <Child {...props} ref={ref}/>
        )
    })
}

export default makeBaseElement
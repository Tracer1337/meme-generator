import React, { useEffect } from "react"

function withBackButtonSupport(childElement, name) {
    return ({ open, onClose, ...props }) => {
        useEffect(() => {
            if(open) {
                window.location.hash = "#" + name
                window.addEventListener("popstate", handleClose)
            }
        }, [open])

        const handleClose = ({ values }) => {
            window.removeEventListener("popstate", handleClose)
            window.location.hash = ""
            onClose(values)
        }

        return React.createElement(childElement, {
            ...props,
            open,
            onClose: values => handleClose({ values })
        })
    }
}

export default withBackButtonSupport
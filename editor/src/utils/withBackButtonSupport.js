import React, { useEffect } from "react"
import ReactGA from "react-ga"

function withBackButtonSupport(childElement, name) {
    return ({ open, onClose, ...props }) => {
        useEffect(() => {
            if(open) {
                window.location.hash = "#" + name
                window.addEventListener("popstate", handleClose)
                ReactGA.modalview(name)
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
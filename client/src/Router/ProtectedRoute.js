import React, { useContext, useRef } from "react"
import { Redirect } from "react-router-dom"

import { AppContext } from "../App.js"

function ProtectedRoute({ children, isActive, ...props }) {
    const context = useContext(AppContext)

    const hasClosedDialog = useRef(true)

    if (!context.auth.isLoggedIn) {
        if (isActive) {
            if (hasClosedDialog.current) {
                hasClosedDialog.current = false
                
                requestAnimationFrame(() => {
                    const dialog = context.openDialog("Auth")

                    dialog.addEventListener("close", () => hasClosedDialog.current = true)
                })
            }

            return <Redirect to="/"/>
        }

        return null
    }

    return React.cloneElement(React.Children.only(children, { isActive, ...props }))
}

export default ProtectedRoute
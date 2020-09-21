import React, { useContext } from "react"
import { Redirect } from "react-router-dom"

import { AppContext } from "../App.js"

function ProtectedRoute({ children }) {
    const context = useContext(AppContext)

    if (!context.auth.isLoggedIn) {
        return (
            <Redirect to="/login"/>
        )
    }

    return children
}

export default ProtectedRoute
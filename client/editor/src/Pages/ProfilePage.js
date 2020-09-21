import React, { useContext } from "react"

import { AppContext } from "../App.js"
import Layout from "../components/Layout/Layout.js"

function ProfilePage() {
    const context = useContext(AppContext)

    return (
        <Layout>
            { context.auth.user.username }
            { context.auth.user.email }
        </Layout>
    )
}

export default ProfilePage
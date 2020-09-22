import React, { useContext } from "react"
import { Typography } from "@material-ui/core"

import { AppContext } from "../App.js"
import Layout from "../components/Layout/Layout.js"

function ProfilePage() {
    const context = useContext(AppContext)

    return (
        <Layout>
            <Typography>{ context.auth.user.username }</Typography>
        </Layout>
    )
}

export default ProfilePage
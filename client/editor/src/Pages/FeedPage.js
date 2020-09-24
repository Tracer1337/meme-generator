import React from "react"
import { CircularProgress } from "@material-ui/core"

import Layout from "../components/Layout/Layout.js"
import Post from "../components/Post/Post.js"
import useAPIData from "../utils/useAPIData.js"

function FeedPage() {
    const { isLoading, data } = useAPIData("getFriendsPosts")

    if (isLoading) {
        return (
            <Layout>
                <CircularProgress/>
            </Layout>
        )
    }

    return (
        <Layout>
            { data.map(post => (
                <Post data={post} key={post.id} />
            )) }
        </Layout>
    )
}

export default FeedPage
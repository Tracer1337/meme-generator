import React, { useEffect, useState } from "react"
import { CircularProgress } from "@material-ui/core"

import Layout from "../components/Layout/Layout.js"
import Post from "../components/Post/Post.js"
import useAPIData from "../utils/useAPIData.js"
import { createListeners } from "../utils"

function Page({ page }) {
    const { isLoading, data } = useAPIData({
        method: "getFriendsPosts",
        data: page
    })

    const [hasChild, setHasChild] = useState(false)

    useEffect(() => {
        if (hasChild) {
            return
        }

        const handleScroll = () => {
            if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 100) {
                setHasChild(true)
            }
        }

        return createListeners(window, [
            ["scroll", handleScroll]
        ])
    })

    if (isLoading) {
        return (
            <Layout>
                <CircularProgress />
            </Layout>
        )
    }

    return (
        <>
            { data.map(post => (
                <Post data={post} key={post.id} />
            )) }

            { hasChild && <Page page={page + 1}/> }
        </>
    )
}

function FeedPage() {
    return (
        <Layout>
            <Page page={0}/>
        </Layout>
    )
}

export default FeedPage
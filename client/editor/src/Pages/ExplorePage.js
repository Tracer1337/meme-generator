import React from "react"
import { CircularProgress } from "@material-ui/core"

import Layout from "../components/Layout/Layout.js"
import ImageGrid from "../components/ImageGrid/ImageGrid.js"
import useAPIData from "../utils/useAPIData.js"

function ExplorePage() {
    const { isLoading, data } = useAPIData("getAllPosts")

    if (isLoading) {
        return (
            <Layout>
                <CircularProgress />
            </Layout>
        )
    }

    const images = data.map(post => post.upload.url)

    return (
        <Layout>
            <ImageGrid images={images}/>
        </Layout>
    )
}

export default ExplorePage
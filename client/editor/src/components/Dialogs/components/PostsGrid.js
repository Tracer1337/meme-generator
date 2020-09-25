import React, { useEffect } from "react"
import { CircularProgress } from "@material-ui/core"

import ImageGrid from "../../../components/ImageGrid/ImageGrid.js"
import useAPIData from "../../../utils/useAPIData.js"

function PostsGrid({ user }) {
    const { isLoading, data } = useAPIData({
        method: "getPostsByUser",
        data: user.id
    })

    useEffect(() => {
        console.log(user.id)
    }, [])

    if (isLoading) {
        return <CircularProgress/>
    }

    const images = data.map(post => post.upload.url)

    return (
        <ImageGrid images={images}/>
    )
}

export default PostsGrid
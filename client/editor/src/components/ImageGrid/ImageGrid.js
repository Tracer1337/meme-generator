import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import Item from "./Item.js"


const useStyles = makeStyles(theme => ({
    imageGrid: {
        display: "flex"
    },

    row: {
        flexGrow: 1,
        padding: `0 ${theme.spacing(.25)}px`
    }
}))

function ImageGrid({ images }) {
    const classes = useStyles()

    const firstThird = Math.floor(images.length / 3)
    const secondThird = Math.floor(images.length / 3 * 2)

    const rows = [
        images.slice(0, firstThird),
        images.slice(firstThird, secondThird),
        images.slice(secondThird, images.length)
    ]

    return (
        <div className={classes.imageGrid}>
            { rows.map((images, i) => (
                <div className={classes.row} key={i}>
                    { images.map(src => <Item src={src} key={src}/>)}
                </div>
            )) }
        </div>
    )
}

export default ImageGrid
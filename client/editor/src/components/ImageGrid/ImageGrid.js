import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import Item from "./Item.js"


const useStyles = makeStyles(theme => ({
    imageGrid: {
        display: "flex"
    },

    row: {
        width: "calc(100% / 3)",
        padding: `0 ${theme.spacing(.25)}px`
    }
}))

function ImageGrid({ images, ItemProps }) {
    const classes = useStyles()

    const firstThird = Math.ceil(images.length / 3)
    const secondThird = Math.ceil(images.length / 3 * 2)

    const rows = [
        images.slice(0, firstThird),
        images.slice(firstThird, secondThird),
        images.slice(secondThird, images.length)
    ]

    return (
        <div className={classes.imageGrid}>
            { rows.map((images, i) => (
                <div className={classes.row} key={i}>
                    { images.map(src => <Item src={src} key={src} {...ItemProps}/>)}
                </div>
            )) }
        </div>
    )
}

export default ImageGrid
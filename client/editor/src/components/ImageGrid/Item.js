import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    item: {
        display: "flex",
        marginBottom: theme.spacing(.5)
    },

    image: {
        width: "100%"
    }
}))

function Item({ src }) {
    const classes = useStyles()

    return (
        <div className={classes.item}>
            <img src={src} alt="" className={classes.image}/>
        </div>
    )
}

export default Item
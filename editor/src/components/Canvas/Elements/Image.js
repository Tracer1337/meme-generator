import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import makeElement from "./makeElement.js"

const useStyles = makeStyles(theme => ({
    image: {
        zIndex: 1
    }
}))

const Image = ({ src, id, onFocus, dimensions }, forwardedRef) => {
    const classes = useStyles()

    const styles = {
        width: dimensions.width + "px",
        height: dimensions.height + "px"
    }

    return (
        <img
            src={src}
            alt=""
            id={`element-${id}`}
            ref={forwardedRef}
            onClick={onFocus}
            onTouchStart={onFocus}
            style={styles}
            className={classes.image}
        />
    )
}

export default makeElement({
    controls: ["resize", "rotate", "remove"],
    defaultValues: {
        width: 100,
        height: 100,
        zIndex: 1
    },
    Child: React.forwardRef(Image)
})
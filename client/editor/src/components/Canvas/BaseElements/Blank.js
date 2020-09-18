import React, { useRef, useImperativeHandle } from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    blank: {
        backgroundColor: theme.palette.common.white
    }
}))

function Blank({ baseElement, className, ...props }, forwardedRef) {
    const classes = useStyles()

    const ref = useRef()

    useImperativeHandle(forwardedRef, () => ({
        getRatio: () => 1,
        get element() {
            return ref.current
        }
    }))

    return (
        <div
            ref={ref}
            className={clsx(classes.blank, className)}
            {...props}
        />
    )
}

export default React.forwardRef(Blank)
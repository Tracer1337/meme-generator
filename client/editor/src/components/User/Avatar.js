import React, { useRef, useEffect } from "react"
import clsx from "clsx"
import { Avatar as MuiAvatar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    avatar: {
    }
}))

function Avatar({ user, className }) {
    const classes = useStyles()

    const avatarRef = useRef()

    useEffect(() => {
        const size = avatarRef.current.clientWidth
        avatarRef.current.style.fontSize = `calc(1.25rem * (${size} / 40))`
    }, [avatarRef])

    return (
        <MuiAvatar className={clsx(classes.avatar, className)} ref={avatarRef}>
            { user.username[0] }
        </MuiAvatar>
    )
}

export default Avatar
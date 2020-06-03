import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Textbox from "./Textbox.js"

import { AppContext } from "../../App.js"

const imagePadding = 10

const useStyles = makeStyles(theme => ({
    canvasWrapper: {
        position: "absolute",
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: theme.palette.background.default,
        marginBottom: theme.mixins.toolbar.minHeight,
        display: "flex",
        overflow: "hidden"
    },

    canvas: {
        flexGrow: 1,
        position: "relative"
    },

    image: {
        width: `calc(100vw - ${imagePadding * 2}px)`,
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)"
    }
}))

function Canvas() {
    const context = useContext(AppContext)

    const classes = useStyles()

    const idCounter = useRef(0)

    const [textboxes, setTextboxes] = useState([])

    useEffect(() => {
        const handleAddTextField = () => {
            const newId = idCounter.current++
            const newElement = [(
                <Textbox
                    key={newId}
                    id={newId}
                />
            ), newId]

            setTextboxes([...textboxes, newElement])
        }

        context.event.addEventListener("addTextField", handleAddTextField)

        return () => context.event.removeEventListener("addTextField", handleAddTextField)
    })

    return (
        <div className={classes.canvasWrapper}>
            <div className={classes.canvas}>
                {context.image && <img alt="" src={context.image} className={classes.image}/>}

                {textboxes.map(([element]) => element)}
            </div>
        </div>
    )
}

export default Canvas
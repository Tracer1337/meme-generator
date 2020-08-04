import React, { useState, useEffect } from "react"

import GridItem from "./GridItem.js"
import { Row, getImageDimensions, getAmountOfRows } from "../utils"

function Grid() {
    const [amountOfRows, setAmountOfRows] = useState(getAmountOfRows())
    const [rows, setRows] = useState([])

    useEffect(() => {
        (async () => {
            // Create array of amountOfRows Row objects
            const newRows = Array(amountOfRows).fill(0).map(() => new Row())
        
            // Insert all images into grid
            for (let image of images) {
                // Get image dimensions
                const { width, height } = await getImageDimensions(image)

                // Get width-to-height ratio
                const ratio = height / width
                
                // Get row with lowest score
                let row = newRows[0]

                newRows.forEach(_row => {
                    if (row.score > _row.score) {
                        row = _row
                    }
                })

                // Add item to row's elements
                row.elements.push(<GridItem image={image} key={image}/>)

                // Add element's score to row
                row.score += ratio
            }

            setRows(newRows)
        })()
    }, [amountOfRows])

    useEffect(() => {
        const handleResize = () => {
            const newAmountOfRows = getAmountOfRows()

            if (amountOfRows !== newAmountOfRows) {
                setAmountOfRows(newAmountOfRows)
            }
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    })

    if (!rows || !rows.length) {
        return (
            <div className="row">
                { Array(amountOfRows).fill(0).map((_, i) => (
                    <div className={"col s" + 12 / amountOfRows} key={i}>
                        { Array(Math.ceil(images.length / amountOfRows)).fill(0).map((_, j) => (
                            <div className="skeleton grid-item" style={{ height: Math.floor(Math.random() * 100) + 100 }} key={j}/>
                        )) }
                    </div>
                )) }
            </div>
        )
    }

    return (
        <div className="row">
            { rows.map((row, i) => (
                <div className={"col s" + 12 / amountOfRows} key={i}>
                    { row.elements }
                </div>
            )) }
        </div>
    )
}

export default Grid
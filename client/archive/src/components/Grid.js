import React, { useState, useEffect, useMemo } from "react"

import GridItem from "./GridItem.js"
import { Row, getImageDimensions, getAmountOfRows } from "../utils"

const password = localStorage.getItem("password")

function Grid() {
    const [amountOfRows, setAmountOfRows] = useState(getAmountOfRows())
    const [rows, setRows] = useState([])
    const [images, setImages] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [showHiddenImages, setShowHiddenImages] = useState(false)

    const skeletons = useMemo(() => (
        Array(amountOfRows).fill(0).map((_, i) => (
            <div className={"col s" + 12 / amountOfRows} key={i}>
                <div className="skeleton grid-item" style={{ height: Math.floor(Math.random() * 100) + 100 }} />
                <div className="skeleton grid-item" style={{ height: Math.floor(Math.random() * 100) + 100 }} />
                <div className="skeleton grid-item" style={{ height: Math.floor(Math.random() * 100) + 100 }} />
            </div>
        ))
    ), [amountOfRows])

    const handleShowHiddenImagesChange = (event) => {
        setShowHiddenImages(event.target.checked)
    }

    const fetchImages = async () => {
        const response = await fetch("/api/upload/all", password ? {
            headers: {
                "Authorization": password
            }
        } : {})

        const images = await response.json()

        setImages(images)
    }

    const arrangeImages = async () => {
        // Create array of amountOfRows Row objects
        const newRows = Array(amountOfRows).fill(0).map(() => new Row())

        // Insert all images into grid
        await Promise.all(images.map(async ({ filename, is_hidden }) => {
            if (is_hidden && !showHiddenImages) {
                return
            }

            // Get image dimensions
            const { width, height } = await getImageDimensions(filename)

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
            row.elements.push(
                <GridItem
                    image={filename}
                    key={filename}
                    isHidden={is_hidden}
                    reload={fetchImages}
                />
            )

            // Add element's score to row
            row.score += ratio
        }))

        setRows(newRows)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchImages()
    }, [])

    useEffect(() => {
        if (images) {
            arrangeImages()
        }
    }, [amountOfRows, images, showHiddenImages])

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

    if (isLoading) {
        return (
            <div className="row">
                { skeletons }
            </div>
        )
    }

    return (
        <div>
            { password && (
                <div className="row">
                    <div className="col right">
                        <div className="switch">
                            <label>
                                Off
                                <input type="checkbox" onChange={handleShowHiddenImagesChange} checked={showHiddenImages}/>
                                <span className="lever"></span>
                                On
                            </label>
                        </div>
                    </div>

                    <div className="col right grey-text">
                        Show hidden images
                    </div>
                </div>
            )}

            <div className="row">
                {rows.map((row, i) => (
                    <div className={"col s" + 12 / amountOfRows} key={i}>
                        {row.elements}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Grid
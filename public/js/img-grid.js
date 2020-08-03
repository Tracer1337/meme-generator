if (!images) {
    throw new Error("No images given")
}

const e = React.createElement

class Row {
    constructor() {
        this.elements = []
        this.score = 0
    }
}

function getImageDimensions(image) {
    return new Promise(resolve => {
        const img = new Image()
        
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            })
        }

        img.src = "/upload/" + image
    })    
}

function getAmountOfRows() {
    const sizeMap = {
        300: 2,
        700: 4,
        Infinity: 6 
    }

    for (let maxWidth in sizeMap) {
        if (window.innerWidth < maxWidth) {
            return sizeMap[maxWidth]
        }
    }
}

function GridItem({ image }) {
    const ref = React.useRef()

    React.useEffect(() => {
        M.Materialbox.init(ref.current)
    }, [ref])

    return React.createElement("div", {
        className: "card grid-item"
    }, /*#__PURE__*/React.createElement("div", {
        className: "card-image"
    }, /*#__PURE__*/React.createElement("img", {
        className: "materialboxed",
        src: "/upload/" + image,
        ref: ref
    })));
}

function Grid() {
    const [amountOfRows, setAmountOfRows] = React.useState(getAmountOfRows())
    const [rows, setRows] = React.useState([])

    React.useEffect(() => {
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

                row.elements.push(e(GridItem, { image, key: image }))
                row.score += ratio
            }

            setRows(newRows)
        })()
    }, [amountOfRows])

    React.useEffect(() => {
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
        return null
    }

    return e("div", { className: "row" }, rows.map((row, i) => (
        e("div", { className: "col s" + 12 / amountOfRows, key: i }, row.elements))
    ))
}

ReactDOM.render(e(Grid), document.getElementById("image-grid"))
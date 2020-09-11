class Path {
    constructor({ color, width } = {}) {
        this.points = []
        this.color = color || "black"
        this.width = width || 5
    }

    addPoint(point) {
        this.points.push(point)
    }
}

export default Path
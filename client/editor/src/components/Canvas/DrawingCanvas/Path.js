class Path {
    constructor() {
        this.points = []
        this.color = "black"
        this.width = 5
    }

    addPoint(point) {
        this.points.push(point)
    }
}

export default Path
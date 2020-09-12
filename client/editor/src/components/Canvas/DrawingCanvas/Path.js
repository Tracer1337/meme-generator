import { PIXEL_RATIO } from "../../../config/constants.js"
import simplifyPath from "../../../utils/simplifyPath.js"

class Path {
    constructor({ color, width } = {}) {
        this.points = []
        this.color = color || "black"
        this.width = (width || 5) * PIXEL_RATIO
    }

    addPoint([x, y]) {
        this.points.push([x * PIXEL_RATIO, y * PIXEL_RATIO])
    }

    getPoints() {
        return simplifyPath(this.points)
    }
}

export default Path
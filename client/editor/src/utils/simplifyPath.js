// Source: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
// 
// function DouglasPeucker(PointList[], epsilon)
//     // Find the point with the maximum distance
//     dmax = 0
//     index = 0
//     end = length(PointList)
//     for i = 2 to (end - 1) {
//         d = perpendicularDistance(PointList[i], Line(PointList[1], PointList[end])) 
//         if (d > dmax) {
//             index = i
//             dmax = d
//         }
//     }
    
//     ResultList[] = empty;
    
//     // If max distance is greater than epsilon, recursively simplify
//     if (dmax > epsilon) {
//         // Recursive call
//         recResults1[] = DouglasPeucker(PointList[1...index], epsilon)
//         recResults2[] = DouglasPeucker(PointList[index...end], epsilon)

//         // Build the result list
//         ResultList[] = {recResults1[1...length(recResults1) - 1], recResults2[1...length(recResults2)]}
//     } else {
//         ResultList[] = {PointList[1], PointList[end]}
//     }
//     // Return the result
//     return ResultList[]
// end

// Source: https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
function perpendicularDistance([x1, y1], [x2, y2], [x0, y0]) {
    return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))
}

function simplifyPath(path, epsilon = 2) {
    if (path.length < 2) {
        return path
    }
    
    // Find the points with the maximum distance
    let maxDistance = 0
    let maxDistanceIndex = 0
    for (let i = 1; i < path.length - 1; i++) {
        const distance = perpendicularDistance(path[0], path[path.length - 1], path[i])
        if (distance > maxDistance) {
            maxDistance = distance
            maxDistanceIndex = i
        }
    }

    let result = []

    // If max distance is greater than epsilon, recursively simplify
    if (maxDistance > epsilon) {
        // Recursive call
        const recursiveResults1 = simplifyPath(path.slice(0, maxDistanceIndex), epsilon)
        const recursiveResults2 = simplifyPath(path.slice(maxDistanceIndex, path.length), epsilon)

        // Build the result list
        result = recursiveResults1.concat(recursiveResults2)
    } else {
        result = [path[0], path[path.length - 1]]
    }

    // Return the result
    return result
}

export default simplifyPath
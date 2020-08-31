// Source: https://stackoverflow.com/questions/2570972/css-font-border

function textShadow(stroke, color) {
    if (stroke === 0) {
        return ""
    }

    const shadows = []

    for (let i = -stroke; i <= stroke; i++) {
        for (let j = -stroke; j <= stroke; j++) {
            shadows.push(`${i}px ${j}px 0 ${color}`)
        }
    }

    return shadows.join(",")
}

export default textShadow
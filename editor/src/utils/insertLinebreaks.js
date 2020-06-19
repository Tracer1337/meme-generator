import fitText from "./fitText.js"

function replaceAt(origin, index, replacement) {
    return origin.substr(0, index) + replacement + origin.substr(index + replacement.length, origin.length)
}

function findAllIndices(string, substring) {
    const indices = []
    string.split("").forEach((char, i) => char === substring ? indices.push(i) : null)
    return indices
}

function insertLinebreaks({ text, width, height, styles }) {
    function generateFontSizes(indices, replacement) {
        const result = {}

        indices.forEach((i) => {
            // Copy string
            let temp = (" " + text).slice(1)
            temp = replaceAt(temp, i, replacement)

            const fontSize = fitText({ text: temp, width, height, styles })

            result[temp] = fontSize
        })

        return result
    }

    const whitespaceIndices = findAllIndices(text, " ")
    const linebreakIndices = findAllIndices(text, "\n")
    
    // Calculate all possible fittings
    const fontSizes = {
        [text]: fitText({ text, width, height, styles }),
        ...generateFontSizes(whitespaceIndices, "\n"),
        ...generateFontSizes(linebreakIndices, " ")
    }

    // Find variant with largest font size
    const bestFit = { text: "", fontSize: 0 }

    for(let string in fontSizes) {
        if(fontSizes[string] > bestFit.fontSize) {
            bestFit.fontSize = fontSizes[string]
            bestFit.text = string
        }
    }

    return bestFit.text
}

export default insertLinebreaks
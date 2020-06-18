function getFileExtension(filename) {
    return filename.match(/\.[0-9a-z]+$/i)[0]
}

module.exports = getFileExtension
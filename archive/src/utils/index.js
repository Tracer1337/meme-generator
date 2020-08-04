export class Row {
    constructor() {
        this.elements = []
        this.score = 0
    }
}

export function getImageDimensions(image) {
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

export function getAmountOfRows() {
    const sizeMap = {
        500: 2,
        800: 3,
        1100: 4,
        Infinity: 6
    }

    for (let maxWidth in sizeMap) {
        if (window.innerWidth < maxWidth) {
            return sizeMap[maxWidth]
        }
    }
}

export function getModalImageDimensions(image) {
    return new Promise(resolve => {
        const img = new Image()

        img.onload = () => {
            const { naturalWidth: width, naturalHeight: height } = img

            if (width > height || window.outerWidth < window.outerHeight) {
                resolve({
                    width: "100%"
                })
            } else {
                resolve({
                    height: 500
                })
            }
        }

        img.src = "/upload/" + image
    })
}
export function dataURLToFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


export function downloadImageFromSrc(src) {
    const a = document.createElement("a")
    a.href = src
    a.download = "download.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function importFile(accept) {
    return new Promise(resolve => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = accept
        document.body.appendChild(input)

        input.onchange = e => {
            const file = e.target.files[0]
            resolve(file)
        }

        input.click()
        input.remove()
    })
}

export function fileToImage(file) {
    return new Promise(resolve => {
        const reader = new FileReader()

        reader.onload = () => resolve(reader.result)

        reader.readAsDataURL(file)
    })
}

// Source: https://stackoverflow.com/questions/2570972/css-font-border

export function textShadow(stroke, color) {
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
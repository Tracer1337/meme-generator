const importFile = accept => new Promise(resolve => {
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

const fileToImage = file => new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)

    reader.readAsDataURL(file)
})

export default importFile

export {
    fileToImage
}
export default function downloadImage(image) {
    const a = document.createElement("a")
    a.href = image.src
    a.download = "download.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
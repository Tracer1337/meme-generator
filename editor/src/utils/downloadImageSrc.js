export default function downloadImageSrc(src) {
    const a = document.createElement("a")
    a.href = src
    a.download = "download.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
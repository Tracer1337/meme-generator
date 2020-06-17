import html2canvas from "html2canvas"

async function generateImage(container) {
    const canvas = await html2canvas(container, {
        useCORS: true
    })
    return canvas.toDataURL()
}

export default generateImage
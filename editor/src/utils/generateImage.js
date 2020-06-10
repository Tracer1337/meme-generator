import html2canvas from "html2canvas"

async function generateImage(container) {
    if(window.Worker) {
        // Use webworker
        const scriptURL = URL.createObjectURL(new Blob([`(
            ${async function() {
                const canvas = await html2canvas(container)
                postMessage(canvas.toDataURL())
            }.toString()}
        )()`], { type: "application/javascript" }))

        const worker = new Worker(scriptURL)

        worker.onmessage = (e) => {
            console.log(e.data)
        }
    } else {
        const canvas = await html2canvas(container)
        return canvas.toDataURL()
    }
}

export default generateImage
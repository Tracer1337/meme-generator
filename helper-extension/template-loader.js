window.onload = async () => {
    // Wait until image is loaded
    await new Promise(requestAnimationFrame)
    
    // Get image from canvas
    const canvas = document.querySelector("canvas")
    const image = canvas.toDataURL()

    // Get label
    const label = document.getElementById("mm-meme-title").textContent

    // Send image and label to easymeme extension
    chrome.runtime.sendMessage({ image, label })

    // Close tab
    window.close()
}
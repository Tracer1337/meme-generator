// Get image from canvas
const canvas = document.querySelector("canvas")
const image = canvas.toDataURL()

// Send image to easymeme extension
chrome.runtime.sendMessage({ image })

// Close tab
window.close()

console.log("[Easy Meme Helper] Run")
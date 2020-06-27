// Get image from canvas
const canvas = document.querySelector("canvas")
const image = canvas.toDataURL()

// Get label
const label = document.getElementById("mm-meme-title").textContent

// Store label in clipboard
navigator.clipboard.writeText(label)

// Send image to easymeme extension
chrome.runtime.sendMessage({ image })

// Close tab
window.close()
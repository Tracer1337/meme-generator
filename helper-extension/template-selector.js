// Get meme tiles
const boxes = Array.from(document.querySelectorAll(".mt-box"))

// Replace links
boxes.forEach(box => {
    box.querySelectorAll("a").forEach(link => {
        link.setAttribute("href", link.getAttribute("href").replace("meme", "memegenerator"))
        link.setAttribute("target", "_blank")
    })
})

console.log("[Easy Meme Helper] Run")
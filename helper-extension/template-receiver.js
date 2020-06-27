let currentImage

function getCurrentImage() {
    return currentImage
}

chrome.runtime.onMessage.addListener(message => {
    if(!message.image) {
        return
    }

    currentImage = message.image

    chrome.windows.create({
        url: chrome.runtime.getURL("editor.html"),
        width: 375,
        height: 812,
        type: "popup"
    })
})
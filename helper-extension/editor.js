// Get image
const backgroundPage = chrome.extension.getBackgroundPage()
const image = backgroundPage.getCurrentImage()

// Post image to iframe
const iframe = document.getElementById("main-frame")

iframe.onload = () => {
    iframe.contentWindow.postMessage({ image }, "*")
}
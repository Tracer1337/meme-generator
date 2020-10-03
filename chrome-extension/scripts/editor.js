// Get values
const backgroundPage = chrome.extension.getBackgroundPage()
const values = backgroundPage.getCurrentValues()

// Post values to iframe
const iframe = document.getElementById("main-frame")

iframe.onload = async () => {
    for (let i = 0; i < 10; i++) {
        await new Promise(requestAnimationFrame)
    }
    iframe.contentWindow.postMessage(values, "*")
}
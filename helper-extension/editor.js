// Get values
const backgroundPage = chrome.extension.getBackgroundPage()
const values = backgroundPage.getCurrentValues()

// Post values to iframe
const iframe = document.getElementById("main-frame")

iframe.onload = () => {
    iframe.contentWindow.postMessage(values, "*")
}
let currentValues

function getCurrentValues() {
    return currentValues
}

chrome.runtime.onMessage.addListener(message => {
    if(!message.image) {
        return
    }

    currentValues = message

    chrome.windows.create({
        url: chrome.runtime.getURL("editor.html"),
        width: 375,
        height: 812,
        type: "popup"
    })
})
const TEMPLATE_PAGE_URL = "https://imgflip.com/memetemplates"

// Open templates page
function openTemplatesPage() {
    chrome.tabs.create({ url: TEMPLATE_PAGE_URL })
}

// Show the templates page link if template loader is enabled
function setTemplatesPageLinkVisibility() {
    chrome.storage.local.get("isTemplateLoaderEnabled", ({ isTemplateLoaderEnabled }) => {
        templatesPageLink.style.display = isTemplateLoaderEnabled ? "" : "none"
    })
}

/**
 * Handle enable-template-loader checkbox
 */
const checkboxEnableTemplateLoader = document.getElementById("checkbox-enable-template-loader")

chrome.storage.local.get("isTemplateLoaderEnabled", ({ isTemplateLoaderEnabled }) => {
    checkboxEnableTemplateLoader.checked = isTemplateLoaderEnabled
})

checkboxEnableTemplateLoader.addEventListener("change", (event) => {
    if(event.target.checked) {
        chrome.storage.local.set({ "isTemplateLoaderEnabled": true })
    } else {
        chrome.storage.local.set({ "isTemplateLoaderEnabled": false })
    }
})

/**
 * Handle templates-page-link click
 */
const templatesPageLink = document.getElementById("templates-page-link")

templatesPageLink.addEventListener("click", openTemplatesPage)

setTemplatesPageLinkVisibility()

chrome.storage.local.onChanged.addListener(setTemplatesPageLinkVisibility)
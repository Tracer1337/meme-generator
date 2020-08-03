export function setCSSVariable(key, value) {
    document.documentElement.style.setProperty("--" + key, value)
}
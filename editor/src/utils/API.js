import { IS_DEV } from "../config/constants.js"
import { cachedRequest, getCachedImage } from "./cache.js"

function url(path) {
    return `${window.location.protocol}//${window.location.hostname}${IS_DEV ? ":8080" : ""}/api${path}`
}

// Templates

export const uploadTemplate = (formData) => fetch(url("/templates"), {
    method: "POST",
    body: formData
})

export const getTemplates = () => {
    return cachedRequest(url("/templates"))
        .then(res => res.json())
        .then(async data => {
            for(let template of data) {
                template.image_url = await getCachedImage(template.image_url)

                if (template.meta_data) {
                    template.meta_data = JSON.parse(template.meta_data)
                }
            }

            return data
        })
}

export const deleteTemplate = (password, id) => fetch(url("/templates/delete/" + id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
})

export const registerTemplateUse = (id) => fetch(url("/templates/register-use"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
})

// Auth

export const authorize = (password) => fetch(url("/auth/authorize"), {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
}).then(res => res.json())

// Stickers

export const getStickers = () => cachedRequest(url("/stickers"))
    .then(res => res.json())
    .then(async data => {
        for(let sticker of data) {
            sticker.image_url = await getCachedImage(sticker.image_url)
        }

        return data
    })

export const uploadSticker = (formData) => fetch(url("/stickers"), {
    method: "POST",
    body: formData
})

export const deleteSticker = (password, id) => fetch(url("/stickers/delete/" + id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
})

export const registerStickerUse = (id) => fetch(url("/stickers/register-use"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
})
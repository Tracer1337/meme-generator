import { getCachedImage } from "../utils/cache.js"

export const TEMPLATES = "TEMPLATES"
export const STICKERS = "STICKERS"

async function formatTemplate(template) {
    template.image_url = await getCachedImage(template.image_url)

    if (template.meta_data) {
        template.meta_data = JSON.parse(template.meta_data)
    }
}

async function formatSticker(sticker) {
    sticker.image_url = await getCachedImage(sticker.image_url)
}

function map(elements, fn) {
    return Promise.all(elements.map(async (element) => fn(element)))
}

export default function format(type) {
    let fn

    if (type === TEMPLATES) {
        fn = (data) => map(data.data, formatTemplate)
    } else if (type === STICKERS) {
        fn = (data) => map(data.data, formatSticker)
    }

    return (data) => {
        return new Promise(async resolve => {
            await fn(data)
            resolve(data)
        })
    }
}
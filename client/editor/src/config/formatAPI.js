import moment from "moment"

import { BASE_URL } from "../config/constants.js"
import { getCachedImage } from "../utils/cache.js"

export const TEMPLATES = "TEMPLATES"
export const STICKERS = "STICKERS"
export const LOGIN = "LOGIN"
export const USER = "USER"

async function formatTemplate(template) {
    template.image_url = BASE_URL + template.image_url
    template.image_url = await getCachedImage(template.image_url)
    
    template.model = JSON.parse(template.model)
}

async function formatSticker(sticker) {
    sticker.image_url = BASE_URL + sticker.image_url
    sticker.image_url = await getCachedImage(sticker.image_url)
}

function formatUser(user) {
    user.created_at = moment(user.created_at)
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
    } else if (type === LOGIN) {
        fn = (data) => formatUser(data.data.user)
    } else if (type === USER) {
        fn = (data) => formatUser(data.data)
    }

    return (data) => {
        return new Promise(async resolve => {
            await fn(data)
            resolve(data)
        })
    }
}
import axios from "axios"

import format, {
    TEMPLATES,
    STICKERS
} from "./formatAPI.js"
import { API_BASE_URL } from "./constants.js"
import { cachedRequest } from "../utils/cache.js"

export function setPasswordHeader(password) {
    axios.defaults.headers.common = {
        "Authorization": password
    }
}

function url(path) {
    return API_BASE_URL + path
}

export const authorize = (password) => axios.post(url("/auth/authorize"), { password })

export const getTemplates = () => cachedRequest(url("/templates")).then(format(TEMPLATES))
export const uploadTemplate = (formData) => axios.post(url("/templates"), formData)
export const editTemplate = (body) => axios.put(url("/templates"), body)
export const deleteTemplate = (id) => axios.post(url("/templates/delete/" + id))
export const registerTemplateUse = (id) => axios.post(url("/templates/register-use"), { id })

export const getStickers = () => cachedRequest(url("/stickers")).then(format(STICKERS))
export const uploadSticker = (formData) => axios.post(url("/stickers"), formData)
export const deleteSticker = (id) => axios.post(url("/stickers/delete/" + id))
export const registerStickerUse = (id) => axios.post(url("/stickers/register-use"), { id })

export const uploadFile = (formData) => axios.post("/upload", formData)
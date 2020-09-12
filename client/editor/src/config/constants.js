export const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin
export const API_BASE_URL = BASE_URL + "/api"

export const MAX_SNAPSHOTS = 50

export const TEXTBOX_PLACEHOLDER = "Enter Text..."
export const TEXTBOX_PADDING = 6

export const LONG_PRESS_DURATION = 1000

export const IS_DEV = process.env.NODE_ENV === "development"
export const IS_CORDOVA = !!window.cordova
export const IS_OFFLINE = !IS_CORDOVA ? !window.navigator.onLine : window.navigator.connection.type === "none"

export const CACHE_NAME = "v1"

export const GA_TRACKING_ID = "UA-162994094-2"

export const GALLERY_FOLDER_NAME = "Memes"

export const PIXEL_RATIO = window.devicePixelRatio || 1
export const MAX_SNAPSHOTS = 50

export const TEXTBOX_PLACEHOLDER = "Enter Text..."
export const TEXTBOX_PADDING = 6

export const LONG_PRESS_DURATION = 1000

export const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
export const IS_ANDROID_APP = new URLSearchParams(window.location.search).get("isAndroidApp")

export const CACHE_NAME = "v1"

export const GA_TRACKING_ID = "UA-162994094-2"
export const ADSENSE_CLIENT_ID = "ca-pub-3609177996275417"
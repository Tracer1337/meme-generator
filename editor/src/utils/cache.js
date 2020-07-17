import { IS_DEV } from "../config/constants.js"

const cacheName = "v1"

export async function cachedRequest(url) {
    // Do not cache in development mode
    if(IS_DEV) {
        return await fetch(url)
    }

    // Retrieve cache instance
    const cache = await caches.open(cacheName)

    // Get cached data
    const cachedData = await cache.match(url)

    // Return cached data if neccessary
    if(!navigator.onLine) {
        return cachedData
    }

    // Request data from url
    const response = await fetch(url)

    // Write data to cache
    cache.put(url, response.clone())

    return response
}

export async function getCachedImage(url) {
    // Request cached image
    const response = await cachedRequest(url)

    // Create local image url from response
    const blob = await response.blob()
    const imageURL = URL.createObjectURL(blob)
    
    return imageURL
}
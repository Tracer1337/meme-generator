import { IS_DEV, CACHE_NAME } from "../config/constants.js"

export async function cachedRequest(url) {
    // Do not cache in development mode
    if(IS_DEV) {
        return await fetch(url)
    }

    // Retrieve cache instance
    const cache = await caches.open(CACHE_NAME)

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
    // Retrieve cache instance
    const cache = await caches.open(CACHE_NAME)

    // Get cached response
    const response = await cache.match(url)

    // Return url if image is not cached
    if(!response) {
        return url
    }

    // Create local image url from response
    const blob = await response.blob()
    const imageURL = URL.createObjectURL(blob)
    
    return imageURL
}

export async function cacheImage(url) {
    // Do not cache blob / in development mode
    if(url.indexOf("blob") === 0 || IS_DEV) {
        return
    }

    // Retrieve cache instance
    const cache = await caches.open(CACHE_NAME)

    // Check if image is cached already
    const cachedData = await cache.match(url)

    if(!cachedData) {
        // Store image in cache
        const response = await fetch(url)
        cache.put(url, response)
    }
}
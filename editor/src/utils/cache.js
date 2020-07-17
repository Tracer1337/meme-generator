const cacheName = "v1"

async function cachedRequest(url) {
    // Retrieve cache instance
    const cache = await caches.open(cacheName)

    // Get cached data
    const cachedData = await cache.match(url)

    // Return cached data if neccessary
    if(!navigator.onLine && cachedData) {
        return cachedData
    }

    // Request data from url
    const response = await fetch(url)

    // Write data to cache
    cache.put(url, response.clone())

    return response
}

export default cachedRequest
import { uploadFile } from "./API.js"

async function uploadImage(image) {
    // Create formData object
    const formData = new FormData()
    formData.append("file", image)

    // Upload image to server
    try {
        const res = await uploadFile(formData)
        
        const data = await res.json()
    
        return "https://" + window.location.host + data.path
    } catch (error) {
        console.error(error)
        return
    }
}

export default uploadImage
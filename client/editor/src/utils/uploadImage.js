import { uploadFile } from "../config/api.js"

async function uploadImage(image) {
    // Create formData object
    const formData = new FormData()
    formData.append("file", image)

    // Upload image to server
    try {
        const response = await uploadFile(formData)

        return "https://" + window.location.host + response.data.path
    } catch (error) {
        console.error(error)
        return
    }
}

export default uploadImage
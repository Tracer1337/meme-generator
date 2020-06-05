import config from "../config/image-api-config.json"

async function uploadImage(image) {
    // Create formData object
    const formData = new FormData()
    formData.append("image", image)
    formData.append("title", "Uploaded using Meme Generator")

    // Upload image to imgur
    const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",

        headers: {
            "Authorization": "Client-ID " + config["Client-ID"]
        },

        body: formData
    })
    
    const data = await res.json()

    if(data.success) {
        return data.data.link
    }

    return
}

export default uploadImage
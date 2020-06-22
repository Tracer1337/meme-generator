const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const upload = require("../../utils/upload.js")
const generateImage = require("../../lib/ImageGenerator/generateImage.js")

const uploadFields = upload.fields([
    {
        name: "image",
        maxCount: 1
    },
    {
        name: "sticker_images",
        maxCount: 32
    }
])

router.get("/", uploadFields, async (req, res) => {
    // Format inputs
    const image = req.files["image"][0]
    const sticker_images = req.files["sticker_images"]
    const textboxes = JSON.parse(req.body.textboxes)
    const stickers = JSON.parse(req.body.stickers)

    // Generate image
    const svg = await generateImage({
        image,
        sticker_images,
        textboxes,
        stickers
    })

    // Store image
    const imagePath = path.join(__dirname, "..", "..", "..", "test.svg")
    fs.writeFileSync(imagePath, svg.toString())

    // Delete temp images
    fs.unlinkSync(image.path)
    sticker_images.forEach(({ path }) => fs.unlinkSync(path))

    res.send(svg.toString())
})

module.exports = router

/*
{
    image: [
        {
            fieldname: 'image',
            originalname: 'patrick.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp',
            filename: '72a90e35.jpg',
            path: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp\\72a90e35.jpg',
            size: 7917
        }   
    ],
    sticker_images: [
        {
            fieldname: 'sticker_images',
            originalname: 'donald-trump.png',
            encoding: '7bit',
            mimetype: 'image/png',
            destination: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp',
            filename: '46ab715d.png',
            path: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp\\46ab715d.png',
            size: 22375
        },
        {
            fieldname: 'sticker_images',
            originalname: 'joint.png',
            encoding: '7bit',
            mimetype: 'image/png',
            destination: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp',
            filename: 'cc16b207.png',
            path: 'C:\\Users\\Merlin\\Desktop\\projects\\meme-generator\\temp\\cc16b207.png',
            size: 21273
        }
    ]
}
*/
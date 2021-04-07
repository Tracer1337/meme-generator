const { v4: uuid } = require("uuid")
const fs = require("fs")
const path = require("path")

const ROOT_DIR = path.join(__dirname, "..", "..")
const DEV_BUCKET_DIR = path.join(ROOT_DIR, process.env.AWS_BUCKET)
const LOCAL_STORAGE_DIR = path.join(ROOT_DIR, "storage")

const cache = new Map()

async function clearFolder(folder) {
    const files = await fs.promises.readdir(folder)
    await Promise.all(files.map(async filename => {
        await fs.promises.unlink(path.join(folder, filename))
    }))
}

const StorageFacade = {
    createBucket(bucketName = process.env.APP_NAME + "-" + uuid()) {
        fs.mkdirSync(path.join(ROOT_DIR, bucketName))
        return { Bucket: bucketName }
    },

    async uploadFile(inputPath, outputPath, bucketName = process.env.AWS_BUCKET) {
        const fileName = path.basename(outputPath)

        cache.set(fileName, await fs.promises.readFile(inputPath))

        return await fs.promises.copyFile(inputPath, path.join(ROOT_DIR, bucketName, fileName))
    },

    getFile(filePath) {
        const fileName = path.basename(filePath)

        if (cache.has(fileName)) {
            return cache.get(fileName)
        }

        return fs.promises.readFile(path.join(DEV_BUCKET_DIR, fileName))
    },

    deleteFile(filePath) {
        const fileName = path.basename(filePath)

        cache.delete(fileName)

        return fs.promises.unlink(path.join(DEV_BUCKET_DIR, fileName))
    },

    clearStorage: clearFolder.bind(null, DEV_BUCKET_DIR),

    uploadFileLocal(inputPath, filename) {
        return fs.promises.copyFile(inputPath, path.join(LOCAL_STORAGE_DIR, filename))
    },

    deleteFileLocal(filename) {
        return fs.promises.unlink(path.join(LOCAL_STORAGE_DIR, filename))
    },

    clearLocalStorage: clearFolder.bind(null, LOCAL_STORAGE_DIR),
}

module.exports = StorageFacade

const fs = require("fs")
const path = require("path")
const AWS = require("aws-sdk")
const { v4: uuid } = require("uuid")

const s3 = new AWS.S3({ apiVersion: "2006-03-01" })

const DEV_BUCKET_DIR = path.join(__dirname, "..", "..", "bucket")

const cache = new Map()

const StorageFacade = {
    createBucket(bucketName = process.env.APP_NAME + "-" + uuid()) {
        return new Promise((resolve, reject) => {
            s3.createBucket({ Bucket: bucketName }, (error, data) => {
                if (error) {
                    return void reject(error)
                }

                resolve({ ...data, Bucket: bucketName })
            })
        })
    },

    uploadFile(inputPath, outputPath, bucketName = process.env.AWS_BUCKET) {
        const fileName = path.basename(inputPath)

        cache.set(fileName, fs.readFileSync(inputPath))

        if (process.env.NODE_ENV === "development") {
            return fs.copyFileSync(inputPath, path.join(DEV_BUCKET_DIR, fileName))
        }

        return new Promise((resolve, reject) => {
            const fileStream = fs.createReadStream(inputPath)

            fileStream.on("error", error => reject(error))

            const params = {
                Bucket: bucketName,
                Key: outputPath,
                Body: fileStream
            }

            s3.upload(params, (error, data) => {
                if (error) {
                    return void reject(error)
                }

                resolve(data)
            })
        })
    },

    getFile(filePath, bucketName = process.env.AWS_BUCKET) {
        const fileName = path.basename(filePath)

        if (cache.has(fileName)) {
            return cache.get(fileName)
        }

        return new Promise((resolve, reject) => {
            let stream

            if (process.env.NODE_ENV === "development") {
                stream = fs.createReadStream(path.join(DEV_BUCKET_DIR, fileName))
            } else {
                const params = {
                    Bucket: bucketName,
                    Key: filePath
                }

                stream = s3.getObject(params).createReadStream()
            }

            const buffers = []

            stream.on("error", reject)

            stream.on("data", (chunk) => buffers.push(chunk))

            stream.on("end", () => {
                const buffer = Buffer.concat(buffers)
                cache.set(fileName, buffer)
                resolve(buffer)
            })
        })
    }
}

module.exports = StorageFacade
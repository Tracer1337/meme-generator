const fs = require("fs")
const path = require("path")
const AWS = require("aws-sdk")
const { v4: uuid } = require("uuid")

const s3 = new AWS.S3({ apiVersion: "2006-03-01" })

const DEV_BUCKET_DIR = path.join(__dirname, "..", "..", "bucket")

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
        if (process.env.NODE_ENV === "development") {
            return fs.copyFileSync(inputPath, path.join(DEV_BUCKET_DIR, outputPath))
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

    getFileStream(fileName, bucketName = process.env.AWS_BUCKET) {
        if (process.env.NODE_ENV === "development") {
            return fs.createReadStream(path.join(DEV_BUCKET_DIR, fileName))
        }

        const params = {
            Bucket: bucketName,
            Key: fileName
        }

        const stream = s3.getObject(params).createReadStream()

        return stream
    }
}

module.exports = StorageFacade
const fs = require("fs")
const AWS = require("aws-sdk")
const { v4: uuid } = require("uuid")

const s3 = new AWS.S3({ apiVersion: "2006-03-01" })

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

    getBuckets() {
        return new Promise((resolve, reject) => {
            s3.listBuckets((error, data) => {
                if (error) {
                    return void reject(error)
                }

                resolve(data.Buckets)
            })
        })
    },

    uploadFile(inputPath, outputPath, bucketName = process.env.AWS_BUCKET) {
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
        const params = {
            Bucket: bucketName,
            Key: fileName
        }

        const stream = s3.getObject(params).createReadStream()

        return stream
    },

    getFiles(bucketName = process.env.AWS_BUCKET) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucketName
            }

            s3.listObjects(params, (error, data) => {
                if (error) {
                    return void reject(error)
                }

                resolve(data)
            })
        })
    }
}

module.exports = StorageFacade
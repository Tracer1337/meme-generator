const StorageFacade = require("../Facades/StorageFacade.js")
const Upload = require("../Models/Upload.js")

async function uploadFile(req, path, filename) {
    await StorageFacade.uploadFile(path, filename)

    const requestIPAddress = req.header("x-forwarded-for") || req.connection.remoteAddress

    return new Upload({
        filename,
        request_ip_address: requestIPAddress
    })
}

module.exports = { uploadFile }

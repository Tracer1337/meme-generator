function authorize(req) {
    return (
        req.header("Authorization") &&
        req.header("Authorization") === process.env.UPLOAD_PASSWORD
    )
}

module.exports = { authorize }
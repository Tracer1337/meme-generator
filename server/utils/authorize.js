function authorize(req) {
    return req.body.password === process.env.UPLOAD_PASSWORD
}

module.exports = authorize
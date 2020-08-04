const path = require("path")

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },

    output: {
        filename: "archive.bundle.js",
        path: path.resolve(__dirname, "..", "public", "js")
    }
}
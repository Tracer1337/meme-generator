module.exports = {
    table: "templates",

    columns: [
        "id int PRIMARY KEY AUTO_INCREMENT",
        "label varchar(255) NOT NULL UNIQUE",
        "image_url varchar(255) NOT NULL",
        "model TEXT NOT NULL",
        "amount_uses int NOT NULL DEFAULT 0"
    ]
}
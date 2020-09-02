module.exports = {
    table: "stickers",

    columns: [
        "id int PRIMARY KEY AUTO_INCREMENT",
        "image_url varchar(255) NOT NULL UNIQUE",
        "amount_uses int NOT NULL DEFAULT 0"
    ]
}
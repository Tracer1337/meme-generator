module.exports = {
    table: "templates",

    columns: [
        "id int PRIMARY KEY AUTO_INCREMENT",
        "label varchar(255) NOT NULL UNIQUE",
        "image_url varchar(255) NOT NULL",
        "meta_data text",
        "amount_uses int NOT NULL DEFAULT 0"
    ]
}
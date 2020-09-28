module.exports = {
    table: "templates",

    columns: [
        "id int PRIMARY KEY AUTO_INCREMENT",
        "label varchar(255) NOT NULL",
        "image_url varchar(255) NOT NULL",
        "model TEXT NOT NULL",
        "amount_uses int NOT NULL DEFAULT 0",
        "user_id varchar(255) NOT NULL",
        "visibility int NOT NULL",
        "FOREIGN KEY (user_id) REFERENCES users(id)"
    ]
}
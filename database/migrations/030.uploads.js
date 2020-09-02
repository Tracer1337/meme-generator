module.exports = {
    table: "uploads",

    columns: [
        "id int PRIMARY KEY AUTO_INCREMENT",
        "filename varchar(255) NOT NULL UNIQUE",
        "request_ip_address varchar(255) NOT NULL",
        "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
        "is_hidden bit(1) NOT NULL DEFAULT 0"
    ]
}
module.exports = {
    table: "posts",

    columns: [
        "id varchar(255) PRIMARY KEY",
        "user_id varchar(255) NOT NULL",
        "upload_id int NOT NULL",
        "created_at varchar(255) NOT NULL",
        "FOREIGN KEY (user_id) REFERENCES users(id)",
        "FOREIGN KEY (upload_id) REFERENCES uploads(id)",
    ]
}
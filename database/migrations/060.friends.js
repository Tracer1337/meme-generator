module.exports = {
    table: "friends",

    columns: [
        "id varchar(255) PRIMARY KEY",
        "from_user_id varchar(255) NOT NULL",
        "to_user_id varchar(255) NOT NULL",
        "created_at varchar(255) NOT NULL",
        "FOREIGN KEY (from_user_id) REFERENCES users(id)",
        "FOREIGN KEY (to_user_id) REFERENCES users(id)"
    ]
}
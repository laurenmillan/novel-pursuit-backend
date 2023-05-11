CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
    CHECK (position('@' IN email) > 1), 
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

--We do not need to store book details in local DB, since it's being fetched from Open Library API

CREATE TABLE bookmarks (
    username VARCHAR(25)
        REFERENCES users ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    PRIMARY KEY (username, book_id)
);
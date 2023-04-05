CREATE TABLE books (
    id INT
    author_name VARCHAR
    title VARCHAR
    by_statement VARCHAR
    publish_date DATE
    isbn VARCHAR
    description
    cover_url VARCHAR
)

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
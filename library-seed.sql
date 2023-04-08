-- Seed data for books table
INSERT INTO books (title, author_name, by_statement, publish_date, isbn, description, cover_url)
VALUES
    ('The Great Gatsby', 'F. Scott Fitzgerald', 'by F. Scott Fitzgerald', '1925-04-10', ARRAY['978-0-09-954153-0', '978-1-000-00000-1'], 'The Great Gatsby is a novel by American author F. Scott Fitzgerald.', 'https://www.example.com/covers/great-gatsby.jpg'),
    ('To Kill a Mockingbird', 'Harper Lee', 'by Harper Lee', '1960-07-11', ARRAY['978-0-440-32924-0'], 'To Kill a Mockingbird is a novel by Harper Lee.', 'https://www.example.com/covers/to-kill-a-mockingbird.jpg'),
    ('1984', 'George Orwell', 'by George Orwell', '1949-06-08', ARRAY['978-0-14-118776-1'], '1984 is a dystopian novel by George Orwell.', 'https://www.example.com/covers/1984.jpg');

-- Seed data for users table
INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES
    ('johndoe', 'password', 'John', 'Doe', 'johndoe@example.com', FALSE),
    ('janedoe', 'password', 'Jane', 'Doe', 'janedoe@example.com', TRUE),
    ('bobsmith', 'password', 'Bob', 'Smith', 'bobsmith@example.com', FALSE);

-- Seed data for bookmarks table
INSERT INTO bookmarks (username, book_id)
VALUES
    ('johndoe', 1),
    ('janedoe', 2),
    ('bobsmith', 1),
    ('bobsmith', 3);

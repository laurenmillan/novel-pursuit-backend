'use strict';

const db = require('../db.js');
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM books');
	await db.query('DELETE FROM bookmarks');

	await User.register({
		username: 'u1',
		firstName: 'U1F',
		lastName: 'U1L',
		email: 'user1@user.com',
		password: 'password1',
		isAdmin: false
	});
	await User.register({
		username: 'u2',
		firstName: 'U2F',
		lastName: 'U2L',
		email: 'user2@user.com',
		password: 'password2',
		isAdmin: false
	});
	await User.register({
		username: 'u3',
		firstName: 'U3F',
		lastName: 'U3L',
		email: 'user3@user.com',
		password: 'password3',
		isAdmin: false
	});

	await db.query(`
        INSERT INTO books (id, title, author_name, by_statement, publish_date, isbn, description, cover_url)
        VALUES (1, 'Book1', 'Author1', 'Publisher1', '2022-01-01', '{"978-3-16-148410-0"}', 'Description1', 'https://example.com/book1.jpg')
    `);
	await db.query(`
        INSERT INTO books (id, title, author_name, by_statement, publish_date, isbn, description, cover_url)
        VALUES (2, 'Book2', 'Author2', 'Publisher2', '2022-02-01', '{"978-3-16-148420-0"}', 'Description2', 'https://example.com/book2.jpg')
    `);

	await db.query(`
        INSERT INTO bookmarks (username, book_id)
        VALUES ('u1', 1)
    `);
	await db.query(`
        INSERT INTO bookmarks (username, book_id)
        VALUES ('u2', 1)
    `);
	await db.query(`
        INSERT INTO bookmarks (username, book_id)
        VALUES ('u2', 2)
    `);
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

const u1Token = createToken({ username: 'u1', isAdmin: false });
const u2Token = createToken({ username: 'u2', isAdmin: false });
const adminToken = createToken({ username: 'admin', isAdmin: true });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	adminToken
};

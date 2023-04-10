'use strict';

const db = require('../db.js');
const User = require('../models/user');
const Book = require('../models/book');
const { createToken } = require('../helpers/tokens');

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');

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

	await Book.create({
		title: 'The Great Gatsby',
		author_name: 'F. Scott Fitzgerald',
		by_statement: 'by F. Scott Fitzgerald',
		publish_date: '1925-04-10',
		isbn: [ '978-0-09-954153-0', '978-1-000-00000-1' ],
		description: 'The Great Gatsby is a novel by American author F. Scott Fitzgerald.',
		cover_url: 'https://www.example.com/covers/great-gatsby.jpg'
	});

	await Book.create({
		title: 'To Kill a Mockingbird',
		author_name: 'Harper Lee',
		by_statement: 'by Harper Lee',
		publish_date: '1960-07-11',
		isbn: [ '978-0-440-32924-0' ],
		description: 'To Kill a Mockingbird is a novel by Harper Lee.',
		cover_url: 'https://www.example.com/covers/to-kill-a-mockingbird.jpg'
	});

	await Book.create({
		title: '1984',
		author_name: 'George Orwell',
		by_statement: 'by George Orwell',
		publish_date: '1949-06-08',
		isbn: [ '978-0-14-118776-1' ],
		description: '1984 is a dystopian novel by George Orwell.',
		cover_url: 'https://www.example.com/covers/1984.jpg'
	});
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

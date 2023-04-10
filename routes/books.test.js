// 'use strict';

// const request = require('supertest');

// const db = require('../db.js');
// const app = require('../app');
// const Book = require('../models/book');
// const User = require('../models/user');

// const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

// beforeAll(commonBeforeAll);
// beforeEach(commonBeforeEach);
// afterEach(commonAfterEach);
// afterAll(commonAfterAll);

// /************************************** GET /books */

// describe('GET /books', () => {
// 	test('get all books', async () => {
// 		const response = await request(app).get('/books');
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body).toEqual({
// 			books: [
// 				{
// 					id: 1,
// 					title: 'The Great Gatsby',
// 					author_name: 'F. Scott Fitzgerald',
// 					by_statement: 'by F. Scott Fitzgerald',
// 					publish_date: '1925-04-10',
// 					isbn: [ '978-0-09-954153-0', '978-1-000-00000-1' ],
// 					description: 'The Great Gatsby is a novel by American author F. Scott Fitzgerald.',
// 					cover_url: 'https://www.example.com/covers/great-gatsby.jpg'
// 				},
// 				{
// 					id: 2,
// 					title: 'To Kill a Mockingbird',
// 					author_name: 'Harper Lee',
// 					by_statement: 'by Harper Lee',
// 					publish_date: '1960-07-11',
// 					isbn: [ '978-0-440-32924-0' ],
// 					description: 'To Kill a Mockingbird is a novel by Harper Lee.',
// 					cover_url: 'https://www.example.com/covers/to-kill-a-mockingbird.jpg'
// 				},
// 				{
// 					id: 3,
// 					title: '1984',
// 					author_name: 'George Orwell',
// 					by_statement: 'by George Orwell',
// 					publish_date: '1949-06-08',
// 					isbn: [ '978-0-14-118776-1' ],
// 					description: '1984 is a dystopian novel by George Orwell.',
// 					cover_url: 'https://www.example.com/covers/1984.jpg'
// 				}
// 			]
// 		});
// 	});
// });

// /************************************** GET /books/:id */

// describe('GET /books/:id', () => {
// 	test('get book by id', async () => {
// 		const bookId = 1; // Replace with a valid book ID
// 		const response = await request(app).get(`/books/${bookId}`);
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body).toEqual({
// 			book: {
// 				id: 1,
// 				title: 'The Great Gatsby',
// 				author_name: 'F. Scott Fitzgerald',
// 				by_statement: 'by F. Scott Fitzgerald',
// 				publish_date: '1925-04-10',
// 				isbn: [ '978-0-09-954153-0', '978-1-000-00000-1' ],
// 				description: 'The Great Gatsby is a novel by American author F. Scott Fitzgerald.',
// 				cover_url: 'https://www.example.com/covers/great-gatsby.jpg'
// 			}
// 		});
// 	});

// 	test('get book by non-existent id', async () => {
// 		const bookId = 99999; // Replace with a non-existent book ID
// 		const response = await request(app).get(`/books/${bookId}`);
// 		expect(response.statusCode).toBe(404);
// 	});
// });

// /************************************** POST /:username/bookmarks/:bookId */

// describe('POST /:username/bookmarks/:bookId', () => {
// 	test('save a book for a user', async () => {
// 		const username = 'testuser';
// 		const bookId = 1;

// 		// Ensure the user is logged in and has a valid token
// 		const user = await User.authenticate(username, 'password');
// 		const token = user.generateToken();

// 		const response = await request(app)
// 			.post(`/${username}/bookmarks/${bookId}`)
// 			.set('authorization', `Bearer ${token}`);
// 		expect(response.statusCode).toBe(201);
// 		expect(response.body).toEqual({ bookmarked: bookId });
// 	});
// });

// describe('DELETE /:username/bookmarks/:bookId', () => {
// 	test('remove a saved book for a user', async () => {
// 		const username = 'testuser';
// 		const bookId = 1;

// 		// Ensure the user is logged in and has a valid token
// 		const user = await User.authenticate(username, 'password');
// 		const token = user.generateToken();

// 		const response = await request(app)
// 			.delete(`/${username}/bookmarks/${bookId}`)
// 			.set('authorization', `Bearer ${token}`);
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body).toEqual({ removed: bookId });
// 	});
// });

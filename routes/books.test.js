'use strict';

const request = require('supertest');

const app = require('../app');
const Book = require('../models/book');

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	adminToken
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /books', function() {
	test('unauth for users', async function() {
		const resp = await request(app)
			.post(`/books`)
			.send({
				title: '1984',
				author_name: 'George Orwell',
				by_statement: 'George Orwell',
				publish_date: '1949-06-08T04:00:00.000Z',
				isbn: [ '978-0-14-118776-1' ],
				description: '1984 is a dystopian novel by George Orwell.',
				cover_url: 'https://www.example.com/covers/1984.jpg'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('bad request with missing data', async function() {
		const resp = await request(app)
			.post(`/books`)
			.send({
				title: '1984'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request with invalid data', async function() {
		const resp = await request(app)
			.post(`/books`)
			.send({
				title: '1984',
				author_name: 'George Orwell',
				by_statement: 'George Orwell',
				publish_date: '1949-06-08T04:00:00.000Z',
				isbn: [ '978-0-14-118776-1' ],
				description: '1984 is a dystopian novel by George Orwell.',
				cover_url: 'https://www.example.com/covers/1984.jpg'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

describe('GET /books/:id', function() {
	test('not found for no such book', async function() {
		const resp = await request(app).get(`/books/0`);
		expect(resp.statusCode).toEqual(404);
	});
});

describe('DELETE /:username/bookmarks/:book_id', function() {
	test('not found for no such book', async function() {
		const resp = await request(app).delete(`/u1/bookmarks/0`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

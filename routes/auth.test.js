'use strict';

const request = require('supertest');

const app = require('../app');

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /auth/token', function() {
	test('works', async function() {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1',
			password: 'password1'
		});
		expect(resp.status).toBe(200);
	});

	test('unauth with non-existent user', async function() {
		const resp = await request(app).post('/auth/token').send({
			username: 'no-such-user',
			password: 'password1'
		});
		expect(resp.statusCode).toEqual(401);
	});

	test('fails with incorrect password', async function() {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1',
			password: 'nope'
		});
		expect(resp.status).toBe(401);
	});

	test('fails with missing data', async function() {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1'
		});
		expect(resp.status).toBe(400);
	});
});

describe('POST /auth/register', function() {
	test('works', async function() {
		const resp = await request(app).post('/auth/register').send({
			username: 'new',
			firstName: 'first',
			lastName: 'last',
			password: 'password',
			email: 'new@email.com'
		});
		expect(resp.status).toBe(201);
	});

	test('fails with missing fields', async function() {
		const resp = await request(app).post('/auth/register').send({
			username: 'new'
		});
		expect(resp.status).toBe(400);
	});
});

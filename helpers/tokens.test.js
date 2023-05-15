const jwt = require('jsonwebtoken');
const { createToken } = require('./tokens');
const { SECRET_KEY } = require('../config');

describe('createToken', function() {
	test('generates a valid JWT token with correct payload for a non-admin user', function() {
		const token = createToken({ username: 'test', is_admin: false });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: false
		});
	});

	test('generates a valid JWT token with correct payload for an admin user', function() {
		const token = createToken({ username: 'test', isAdmin: true });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: true
		});
	});

	test('generates a valid JWT token with correct payload and default non-admin status when not specified', function() {
		// given the security risk if this didn't work, checking this specifically
		const token = createToken({ username: 'test' });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: false
		});
	});
});

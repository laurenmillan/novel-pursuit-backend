'use strict';

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace(/^[Bb]earer /, '').trim();
			res.locals.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (err) {
		return next();
	}
}

/** Middleware to enforce user authentication.
 *
 * Use this middleware when a route should only be accessible to users who are logged in.
 * A user is considered to be logged in if there is a 'user' property on 'res.locals'.
 *
 * If a user is not logged in, an UnauthorizedError is thrown.
 */

function ensureLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) throw new UnauthorizedError();
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to enforce admin user authentication.
 *
 * Use this middleware when a route should only be accessible to users who are logged in as an admin.
 * A user is considered to be an admin if there is a 'user' property on 'res.locals' and 'user.isAdmin' is true.
 *
 * If a user is not logged in or not an admin, an UnauthorizedError is thrown.
 */

function ensureAdmin(req, res, next) {
	try {
		if (!res.locals.user || !res.locals.user.isAdmin) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to enforce user authentication and validate token.
 *
 * Use this middleware when a route requires the user to be logged in and the provided token must correspond to the user matching the username provided 
 * 		as a route parameter. The user must either be the same user as the one specified in the route parameter, or an admin.
 *
 * A user is considered authenticated if there is a 'user' property on 'res.locals' and either 'user.isAdmin' is true 
 * 		or 'user.username' equals the 'username' route parameter.
 *
 * If the user is not authenticated or the token does not match, an UnauthorizedError is thrown.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
	try {
		const user = res.locals.user;
		if (!(user && (user.isAdmin || user.username === req.params.username))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdmin
};

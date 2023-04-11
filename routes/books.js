'use strict';

/** Routes for books. */

const jsonschema = require('jsonschema');
const express = require('express');
const { BadRequestError } = require('../expressError');
const Book = require('../models/book');
const { ensureCorrectUserOrAdmin } = require('../middleware/auth');
const { ensureAdmin } = require('../middleware/auth');
const bookNewSchema = require('../schemas/bookNew.json');
const bookSearchSchema = require('../schemas/bookSearch.json');

const router = express.Router();

/** POST / { book } =>  { book }
 *
 * book should be { title, author_name, by_statement, publish_date, isbn, description, cover_url }
 *
 * Returns { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }
 *
 * Authorization required: admin
 */

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		// Validate the request query against the bookNewSchema
		const validator = jsonschema.validate(req.body, bookNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const book = await Book.create(req.body);
		return res.status(201).json({ book });
	} catch (err) {
		return next(err);
	}
});

/** GET / =>
 *   { books: [ { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }, ...] }
 *
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - author_name
 * - by_statement (publisher)
 * - ibsn
 * 
 * Authorization required: none
 */

router.get('/', async function(req, res, next) {
	try {
		const searchFields = req.query;
		const books = await Book.findAll(searchFields);
		return res.json({ books });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => { book }
 *
 * Returns { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }
 *
 **/

router.get('/:id', async function(req, res, next) {
	try {
		const book = await Book.get(req.params.id);
		return res.json({ book });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /:username/bookmarks/:book_id => { removed: book_id }
 *
 * Returns { removed: book_id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete('/:username/bookmarks/:book_id', ensureCorrectUserOrAdmin, async function(req, res, next) {
	try {
		const bookId = +req.params.book_id;
		await Book.removeBook(req.params.username, bookId);
		return res.json({ removed: bookId });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

'use strict';

/** Routes for books. */

const express = require('express');
const Book = require('../models/book');

const router = express.Router();

/** GET / => { books: [ { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }, ... ] }
 *
 * Returns list of all books.
 *
 **/

router.get('/', async function(req, res, next) {
	try {
		const books = await Book.findAll();
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

module.exports = router;

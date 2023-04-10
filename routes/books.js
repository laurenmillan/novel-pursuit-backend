'use strict';

/** Routes for books. */

const express = require('express');
const Book = require('../models/book');
const { ensureCorrectUserOrAdmin } = require('../middleware/auth');

const router = express.Router();

/** GET / => { books: [ { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }, ... ] }
 *
 * Returns list of all books.
 *
 **/

router.get('/', async function(req, res, next) {
	try {
		let books;
		if (req.query.title) {
			books = await Book.findAll({ where: { title: req.query.title } });
		} else {
			books = await Book.findAll();
		}
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

/** GET /title/:title => { books }
 *
 * Returns list of books that match the given title.
 **/

router.get('/title/:title', async function(req, res, next) {
	try {
		const books = await Book.findByTitle(req.params.title);
		return res.json({ books });
	} catch (err) {
		return next(err);
	}
});

/** POST /:username/bookmarks/:bookId => { bookmarked: bookId }
 *
 * Returns { bookmarked: bookId }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.post('/:username/bookmarks/:bookId', ensureCorrectUserOrAdmin, async function(req, res, next) {
	try {
		const bookId = +req.params.bookId;
		await Book.saveBook(req.params.username, bookId);
		return res.status(201).json({ bookmarked: bookId });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /:username/bookmarks/:bookId => { removed: bookId }
 *
 * Returns { removed: bookId }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete('/:username/bookmarks/:bookId', ensureCorrectUserOrAdmin, async function(req, res, next) {
	try {
		const bookId = +req.params.bookId;
		await Book.removeBook(req.params.username, bookId);
		return res.json({ removed: bookId });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

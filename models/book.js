'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Book {
	/**
   * Create a book (from data), update db, return new book data.
   *
   * data should be { title, author_name, by_statement, publish_date, isbn, description, cover_url }
   *
   * Returns { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }
   **/
	static async create(data) {
		const result = await db.query(
			`INSERT INTO books (title,
                            author_name,
                            by_statement,
                            publish_date,
                            isbn,
                            description,
                            cover_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, title, author_name, by_statement, publish_date, isbn, description, cover_url`,
			[
				data.title,
				data.author_name,
				data.by_statement,
				data.publish_date,
				data.isbn,
				data.description,
				data.cover_url
			]
		);
		let book = result.rows[0];

		return book;
	}

	/**
   * Find all books (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - title (will find case-insensitive, partial matches)
   *
   * Returns [{ id, title, author_name, by_statement, publish_date, isbn, description, cover_url }, ...]
   **/
	static async findAll({ title } = {}) {
		let query = `SELECT id,
                        title,
                        author_name,
                        by_statement,
                        publish_date,
                        isbn,
                        description,
                        cover_url
                FROM books`;
		let whereExpressions = [];
		let queryValues = [];

		if (title !== undefined) {
			queryValues.push(`%${title}%`);
			whereExpressions.push(`title ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += ' WHERE ' + whereExpressions.join(' AND ');
		}

		query += ' ORDER BY title';
		const booksRes = await db.query(query, queryValues);
		return booksRes.rows;
	}

	/**
   * Given a book id, return data about book.
   *
   * Returns { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }
   *
   * Throws NotFoundError if not found.
   **/
	static async get(id) {
		const bookRes = await db.query(
			`SELECT id,
                  title,
                  author_name,
                  by_statement,
                  publish_date,
                  isbn,
                  description,
                  cover_url
          FROM books
          WHERE id = $1`,
			[ id ]
		);

		const book = bookRes.rows[0];

		if (!book) throw new NotFoundError(`No book: ${id}`);

		return book;
	}

	/**
   * Update book data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, author_name, by_statement, publish_date, isbn, description, cover_url }
   *
   * Returns { id, title, author_name, by_statement, publish_date, isbn, description, cover_url }
   *
   * Throws NotFoundError if not found.
   */
	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {});
		const idVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE books 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                author_name, 
                                by_statement,
                                publish_date,
                                isbn,
                                description,
                                cover_url`;
		const result = await db.query(querySql, [ ...values, id ]);
		const book = result.rows[0];

		if (!book) throw new NotFoundError(`No book: ${id}`);

		return book;
	}

	/**
   * Delete given book from database; returns undefined.
   *
   * Throws NotFoundError if book not found.
   **/
	static async remove(id) {
		const result = await db.query(
			`DELETE
          FROM books
          WHERE id = $1
          RETURNING id`,
			[ id ]
		);
		const book = result.rows[0];

		if (!book) throw new NotFoundError(`No book: ${id}`);
	}
}

module.exports = Book;

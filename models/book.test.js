'use strict';

const { NotFoundError } = require('../expressError');
const Book = require('../models/book');
const db = require('../db');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', () => {
	test('works', async () => {
		const newBook = {
			title: 'New Book',
			author_name: 'New Author',
			by_statement: 'New Publisher',
			publish_date: new Date('2022-12-31T05:00:00.000Z'),
			isbn: [ '978-0-00-000000-0' ],
			description: 'New book description',
			cover_url: 'https://example.com/new-book.jpg'
		};
		const book = await Book.create(newBook);
		expect(book).toEqual({
			id: expect.any(Number),
			...newBook
		});
	});
});

describe('findAll', () => {
	test('works', async () => {
		const books = await Book.findAll();
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			},
			{
				id: expect.any(Number),
				title: 'Book2',
				author_name: 'Author2',
				by_statement: 'Publisher2',
				cover_url: 'https://example.com/book2.jpg',
				description: 'Description2',
				isbn: [ '978-3-16-148420-0' ],
				publish_date: new Date('2022-02-01T05:00:00.000Z')
			}
		]);
	});
});

describe('findAll with filters', () => {
	test('works with title filter', async () => {
		const books = await Book.findAll({ title: 'Book1' });
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			}
		]);
	});

	test('works with author_name filter', async () => {
		const books = await Book.findAll({ author_name: 'Author1' });
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			}
		]);
	});

	test('works with isbn filter', async () => {
		const books = await Book.findAll({ isbn: '978-3-16-148410-0' });
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			}
		]);
	});

	test('works with multiple filters', async () => {
		const books = await Book.findAll({ title: 'Book1', author_name: 'Author1', isbn: '978-3-16-148410-0' });
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			}
		]);
	});
});

describe('get', () => {
	test('works', async () => {
		const book = await Book.get(1);
		expect(book).toEqual({
			id: 1,
			title: 'Book1',
			author_name: 'Author1',
			by_statement: 'Publisher1',
			publish_date: new Date('2022-01-01T05:00:00.000Z'),
			isbn: [ '978-3-16-148410-0' ],
			description: 'Description1',
			cover_url: 'https://example.com/book1.jpg'
		});
	});

	test('not found if no such book', async () => {
		try {
			await Book.get(0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

describe('getBooksByUser', () => {
	test('works', async () => {
		const books = await Book.getBooksByUser('u1');
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				cover_url: 'https://example.com/book1.jpg',
				description: 'Description1',
				isbn: [ '978-3-16-148410-0' ],
				publish_date: new Date('2022-01-01T05:00:00.000Z')
			}
		]);
	});

	test('not found if no such user', async () => {
		try {
			await Book.getBooksByUser('nonexistent');
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('returns empty array when user has no bookmarked books', async () => {
		await db.query("DELETE FROM bookmarks WHERE username='u1'");
		const books = await Book.getBooksByUser('u1');
		expect(books).toEqual([]);
	});
});

describe('search', () => {
	test('works with title', async () => {
		const books = await Book.search('Book1');
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				publish_date: new Date('2022-01-01T05:00:00.000Z'),
				isbn: [ '978-3-16-148410-0' ],
				description: 'Description1',
				cover_url: 'https://example.com/book1.jpg'
			}
		]);
	});

	test('works with author_name', async () => {
		const books = await Book.search('Author1');
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				publish_date: new Date('2022-01-01T05:00:00.000Z'),
				isbn: [ '978-3-16-148410-0' ],
				description: 'Description1',
				cover_url: 'https://example.com/book1.jpg'
			}
		]);
	});

	test('works with isbn', async () => {
		const books = await Book.search('978-3-16-148410-0');
		expect(books).toEqual([
			{
				id: expect.any(Number),
				title: 'Book1',
				author_name: 'Author1',
				by_statement: 'Publisher1',
				publish_date: new Date('2022-01-01T05:00:00.000Z'),
				isbn: [ '978-3-16-148410-0' ],
				description: 'Description1',
				cover_url: 'https://example.com/book1.jpg'
			}
		]);
	});

	test('returns empty array when no matching books found', async () => {
		const books = await Book.search('Nonexistent Query');
		expect(books).toEqual([]);
	});
});

describe('addBookToUser', () => {
	test('works', async () => {
		await db.query("DELETE FROM bookmarks WHERE username='u1' AND book_id=1");
		await Book.addBookToUser('u1', 1);
		const res = await db.query("SELECT * FROM bookmarks WHERE username='u1' AND book_id=1");
		expect(res.rows.length).toEqual(1);
	});

	test('not found if no such user', async () => {
		try {
			await Book.addBookToUser('nonexistent', 1);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('not found if no such book', async () => {
		try {
			await Book.addBookToUser('u1', 0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('throws error when book already bookmarked', async () => {
		// Remove existing bookmark for user 'u1' and book with id '1'
		await db.query("DELETE FROM bookmarks WHERE username='u1' AND book_id=1");

		// Add the bookmark back for user 'u1' and book with id '1'
		await db.query("INSERT INTO bookmarks (username, book_id) VALUES ('u1', 1)");

		try {
			// Try to add the same bookmark again, which should throw an error
			await Book.addBookToUser('u1', 1);
			fail();
		} catch (err) {
			expect(err.message).toContain('duplicate key value violates unique constraint');
		}
	});
});

describe('removeBookmark', () => {
	test('works', async () => {
		await Book.removeBookmark('u1', 1);
		const res = await db.query("SELECT * FROM bookmarks WHERE username='u1' AND book_id=1");
		expect(res.rows.length).toEqual(0);
	});

	test('not found if no such bookmark', async () => {
		try {
			await Book.removeBookmark('u1', 0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('works', async () => {
		await Book.remove(1);
		const res = await db.query('SELECT * FROM books WHERE id=1');
		expect(res.rows.length).toEqual(0);
	});

	test('not found if no such book', async () => {
		try {
			await Book.remove(0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('not found if user has no bookmarks', async () => {
		await db.query("DELETE FROM bookmarks WHERE username='u1'");
		try {
			await Book.removeBookmark('u1', 1);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

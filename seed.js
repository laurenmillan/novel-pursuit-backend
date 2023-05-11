const axios = require('axios');
const db = require('./db');
const moment = require('moment');

// node seed.js

async function seedDatabase() {
    try {
        const response = await axios.get('https://openlibrary.org/subjects/history.json');
        const books = response.data.works.map(work => {
        const book = work.title;
        const author = work.authors[0]?.name || 'Unknown';
        const year = work.first_publish_year ? moment(work.first_publish_year, 'YYYY').format('YYYY-MM-DD') : 'Unknown';
        const imageUrl = `http://covers.openlibrary.org/b/isbn/${work.cover_edition_key}-M.jpg`;
        const isbn = work.isbn || [];
        const description = work.description
            return { book, author, year, imageUrl, isbn, description };
    });

    for (const book of books) {
        await db.query(`
            INSERT INTO books (title, author_name, publish_date, isbn, description, cover_url)
                VALUES ($1, $2, $3, $4, $5, $6)`, 
                [book.book, book.author, book.year, [], '', book.imageUrl]);
    }

    console.log('Seeding complete!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        db.end();
    }
}

seedDatabase();

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class LibraryApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, data = {}, method = 'get') {
		console.debug('API Call:', endpoint, data, method);

		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${LibraryApi.token}` };
		const params = method === 'get' ? data : {};

		try {
			return (await axios({ url, method, data, params, headers })).data;
		} catch (err) {
			console.error('API Error:', err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [ message ];
		}
	}

	// Individual API routes

	/** Get the current user. */

	static async getCurrentUser(username) {
		let res = await this.request(`users/${username}`);
		return res.user;
	}

	/** Get details on a book by id. */

	static async getBook(id) {
		const LIBRARY_BOOK_URL = `https://openlibrary.org/works/${id}.json`;
		const res = await axios.get(LIBRARY_BOOK_URL);
		return res.data;
	}

	/** Get list of books (filtered by title if not undefined). */

	static async getBooks(title) {
		const LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
		const res = await axios.get(LIBRARY_SEARCH_URL, {
			params: {
				title: title,
				limit: 10 // Set a limit to control the number of results
			}
		});
		return res.data.docs;
	}

	/** Bookmark a book */

	static async bookmarks(username, id) {
		const bookDetails = await this.getBook(id);

		// Process book details and extract the required information
		const processedBookDetails = {
			id: bookDetails.id,
			title: bookDetails.title,
			author_name: bookDetails.author_name,
			cover_url: bookDetails.cover_url
		};

		await this.request(`users/${username}/books/${id}`, processedBookDetails, 'post');
	}

	/** Get token for login from username, password. */

	static async login(loginData) {
		let res = await this.request(`auth/token`, loginData, 'post');
		// console.log(res);
		return res.token;
	}

	/** Signup for site. */

	static async signup(signupData) {
		let res = await this.request(`auth/register`, signupData, 'post');
		return res.token;
	}

	/** Save user profile page. */

	static async saveProfile(username, data) {
		const res = await this.request(`users/${username}`, data, 'patch');
		// console.log(res);
		return res.user;
	}
}

export default LibraryApi;

// for now, put token ("testuser" / "password" on class)
// LibraryApi.token =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
// 	'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
// 	'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

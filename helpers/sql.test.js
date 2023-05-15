const { sqlForPartialUpdate } = require('./sql');

describe('sqlForPartialUpdate', function() {
	test('should return correct SQL partial update query string and values when one field is updated', function() {
		const result = sqlForPartialUpdate({ f1: 'v1' }, { f1: 'f1', fF2: 'f2' });
		expect(result).toEqual({
			setCols: '"f1"=$1',
			values: [ 'v1' ]
		});
	});

	test('should return correct SQL partial update query string and values when multiple fields are updated', function() {
		const result = sqlForPartialUpdate({ f1: 'v1', jsF2: 'v2' }, { jsF2: 'f2' });
		expect(result).toEqual({
			setCols: '"f1"=$1, "f2"=$2',
			values: [ 'v1', 'v2' ]
		});
	});
});

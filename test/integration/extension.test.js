/* global suite, test */

const assert = require('assert')
const vscode = require('vscode')

const extension = require('../../extension')

suite('Extension', () => {

	test('Something 1', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5))
		assert.equal(-1, [1, 2, 3].indexOf(0))
	})

})

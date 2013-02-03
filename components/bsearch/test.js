
var assert = require('assert')
  , Bsearch = require('./bsearch')

var arr = [-10, -3, 0.05, 1, 28]

assert.equal(Bsearch(arr, -99), 0)
assert.equal(Bsearch(arr, -10), 0)
assert.equal(Bsearch(arr, -5), 0)
assert.equal(Bsearch(arr, -3.1), 0)
assert.equal(Bsearch(arr, -3), 1)
assert.equal(Bsearch(arr, -2), 1)
assert.equal(Bsearch(arr, -1), 1)
assert.equal(Bsearch(arr, 0), 1)
assert.equal(Bsearch(arr, 0.5), 2)
assert.equal(Bsearch(arr, 1), 3)
assert.equal(Bsearch(arr, 27), 3)
assert.equal(Bsearch(arr, 28), 4)
assert.equal(Bsearch(arr, 42), 4)

var book = [
  { page: 0, chapter: 'Front Cover' }
, { page: 2, chapter: 'Preamble' }
, { page: 5, chapter: 'Table of Contents' }
, { page: 8, chapter: 'Chapter 1' }
, { page: 29, chapter: 'Chapter 2' }
, { page: 48, chapter: 'Chapter 3' }
]

var search = Bsearch(book.map(function(chapter) { return chapter.page }))

assert.equal(search(15), 3)

console.log('all test pass')

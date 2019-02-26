var test = require('tape');
var defaults = require('../defaults');

test('defaults', function(t) {
  t.plan(3);
  t.equal(defaults({}, { a: true }).a, true, 'Property a copied across');
  t.equal(defaults({ a: 1 }, { a: 2 }).a, 1, 'Property value not overriden');
  t.equal(defaults(undefined, { a: true }).a, true, 'Property pushed to new object');
});
var test = require('tape');
var extend = require('../extend');

test('simple extends', function(t) {
  t.plan(1);
  t.equal(extend({}, { a: true }).a, true, 'Property a copied across');
});

test('can override an attribute with an empty string update', function(t) {
  t.plan(1);
  t.equal(extend({}, { a: 'test' }, { a: '' }).a, '', 'Property a copied across');
});

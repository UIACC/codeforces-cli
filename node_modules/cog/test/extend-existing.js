var test = require('tape');
var extend = require('../extend-existing');

test('can override an attribute with an empty string update', function(t) {
  t.plan(1);
  t.equal(extend({ a: 'test' }, { a: '' }).a, '', 'Property a copied across');
});

test('non existing properties not updated', function(t) {
  t.plan(1);
  t.deepEqual(extend({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }), { a: 1, b: 5 });
});

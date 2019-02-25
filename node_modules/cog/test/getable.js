var getable = require('../getable');
var test = require('tape');
var target = { a: 1, b: 2 };

test('can make an object "getable"', function(t) {
  t.plan(6);
  target = getable(target);
  t.equal(typeof target.get, 'function');
  t.equal(typeof target.set, 'function');
  t.equal(typeof target.remove, 'function');
  t.equal(typeof target.delete, 'function');
  t.equal(typeof target.keys, 'function');
  t.equal(typeof target.values, 'function');
});

test('can get a value', function(t) {
  t.plan(1);
  t.equal(target.get('a'), 1);
});

test('can set a value', function(t) {
  t.plan(1);
  target.set('a', 5);
  t.equal(target.get('a'), 5);
});

test('can get keys of an object', function(t) {
  t.plan(1);
  t.deepEqual(target.keys(), ['a', 'b']);
});

test('can get values of an object', function(t) {
  t.plan(1);
  t.deepEqual(target.values(), [5, 2]);
});

test('can remove a key', function(t) {
  t.plan(1);
  target.remove('a');
  t.deepEqual(target.keys(), ['b']);
});

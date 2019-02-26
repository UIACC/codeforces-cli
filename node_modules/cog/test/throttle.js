var test = require('tape');
var throttle = require('../throttle');
var entries = [];
var throttled;

test('can create a throttled function', function(t) {
  t.plan(1);

  throttled = throttle(function() {
    entries.push(Date.now());
  }, 500);

  t.equal(typeof throttled, 'function', 'have returned a throttled function');
});

test('immediate execution of first call', function(t) {
  t.plan(1);
  throttled();
  t.equal(entries.length, 1, 'first execution succeeds successfully');
});

test('attempting to execute again immediately, will result in deferred execution', function(t) {
  t.plan(2);
  throttled();
  t.equal(entries.length, 1, 'still only executed once');

  setTimeout(function() {
    t.equal(entries.length, 2, 'second execution has occurred');
  }, 1000);
});

test('ensure rapid invocation results in expected number of executions', function(t) {
  var timer = setInterval(throttled, 5);
  var start = Date.now();

  // clear entries
  entries.splice(0);

  t.plan(1);
  setTimeout(function() {
    var elapsed = Date.now() - start;

    clearInterval(timer);
    t.equal(entries.length, 4, 'got expected number of entries');
  }, 1700);
});
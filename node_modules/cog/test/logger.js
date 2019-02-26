var EventEmitter = require('events').EventEmitter;
var test = require('tape');
var logger = require('../logger');
var debug = logger('test');
var testlogger;

function reset(t) {
  return logger.reset().to(createTestLogger(t));
}

function createTestLogger(t) {
  testlogger = new EventEmitter();
  testlogger.log = testlogger.emit.bind(testlogger, 'log');

  return testlogger;
}

test('can reset logger', function(t) {
  t.plan(1);
  t.equal(logger.reset(), logger, 'ok');
});

test('can direct output to our test logger', function(t) {
  t.plan(1);
  t.equal(logger.to(createTestLogger(t)), logger, 'ok');
});

test('logging does not work if not enabled', function(t) {
  logger.reset().to(createTestLogger(t));

  function handleLog() {
    t.fail('got output');
  }

  t.plan(1);
  testlogger.once('log', handleLog);

  setTimeout(function() {
    testlogger.removeListener('log', handleLog);
    t.pass('no output captured');
  }, 500);

  debug('hello');
});

test('can enable test', function(t) {
  t.plan(1);
  t.equal(logger.enable('test'), logger, 'ok');
});

test('log strings', function(t) {
  reset(t).enable('test');

  t.plan(1);
  testlogger.once('log', function(data) {
    t.equal(data, 'test: hello');
  });

  debug('hello');
});
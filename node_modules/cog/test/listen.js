var test = require('tape');
var listen = require('../listen');
var EventEmitter = require('events').EventEmitter;
var emitter;
var el;

test('listen returns an eventemitter with a stop function', function(t) {
  t.plan(2);

  emitter = listen({});
  t.ok(emitter instanceof EventEmitter, 'valid EventEmitter');
  t.ok(typeof emitter.stop == 'function', 'has a stop function');
});

if (typeof document != 'undefined') {
  test('captures dom events', function(t) {
    t.plan(1);

    // create the test element
    el = createSampleElement();

    // listen to the emitter
    emitter = listen(el, ['click']).once('click', function(evt) {
      t.pass('received click event');
    });

    // generate the a click event
    generateClick(el);
  });

  test('can stop event capture', function(t) {
    t.plan(1);
    emitter.stop();
    emitter.once('click', function() {
      t.fail('captured event and should not have');
    });

    el.addEventListener('click', function() {
      t.pass('normal event capture worked as expected');
    });

    generateClick(el);
  });
}

/* internal helpers */

function createSampleElement() {
  var div = document.createElement('div');
  document.body.appendChild(div);

  return div;
}

function generateClick(el) {
  var evt = document.createEvent('MouseEvents');
  var bounds = el.getBoundingClientRect();

  evt.initMouseEvent(
    'click', // type
    true, // can bubble
    true, // cancelable
    window, // window context
    0, // detail arg
    (bounds.top + 10) | 0, // screenX
    (bounds.left + 10) | 0, // screenY
    10, // clientX
    10, // clientY
    false, // ctrl?
    false, // alt?
    false, // shift?
    false, // meta?
    0, // button index, 0 = left
    null // related target
  );

  return el.dispatchEvent(evt);
}

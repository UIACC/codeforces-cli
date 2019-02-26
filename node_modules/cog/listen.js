/* jshint node: true */
'use strict';

var EventEmitter = require('events').EventEmitter;

/**
  ## cog/listen

  ```js
  var listen = require('cog/listen');
  ```

  ### listen(target, events, capture?)

  The `listen` function of cog provides a mechanism for capturing specific
  events (named in the events array) and routing them through an
  `EventEmitter` that is returned from the function.

  While at a base level this has little apparent advantage over the using
  the native `addEventListener` and `removeEventListener` methods available
  in the browser, the listen function also provides a patched in `stop`
  method which will decouple all event listeners from their target.

**/
module.exports = function(target, events, capture) {
  var emitter = new EventEmitter();
  var handlers;

  // iterate through the events and capture the handler functions
  handlers = (events || []).map(function(eventName) {
    var handler = emitter.emit.bind(emitter, eventName);

    // create the event listener
    target.addEventListener(eventName, handler, capture);

    // return the handler
    return handler;
  });

  // patch in the stop method
  emitter.stop = function() {
    handlers.forEach(function(handler, index) {
      target.removeEventListener(events[index], handler);
    });
  };

  return emitter;
};
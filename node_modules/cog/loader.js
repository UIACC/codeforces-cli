/* jshint node: true */
/* global document: false */
'use strict';

/**
  ## cog/loader

  ```js
  var loader = require('cog/loader');
  ```

  ### loader(urls, opts?, callback)

  This is a simple script loader that will load the urls specified
  and trigger the callback once all those scripts have been loaded (or
  loading has failed in one instance).

  __NOTE:__ Deprecated, moved into [dd](https://github.com/DamonOehlman/dd)

**/

module.exports = function(urls, opts, callback) {
  var pending;
  var target;

  function handleLoaded(evt) {
    // decrement the pending count
    pending -= 1;

    // if we have finished, trigger the callback
    if (pending <= 0 && typeof callback == 'function') {
      // TODO: detect and send through errors
      callback();
    }
  }

  // ensure we have an array for scripts
  urls = [].concat(urls || []);

  // check the no opts case
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }

  // set how many urls we are waiting for
  pending = urls.length;

  // initialise the target (default to document.body)
  target = (opts || {}).target || document.body;

  // create the script elements
  urls.map(function(url) {
    var script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.addEventListener('load', handleLoaded);

    return script;
  })
  // add them to the target
  .forEach(target.appendChild.bind(target));
};
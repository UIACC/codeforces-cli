/* jshint node: true */
/* global window: false */
'use strict';

var TEST_PROPS = ['r', 'webkitR', 'mozR', 'oR', 'msR'];

/**
  ## cog/raf

  ```js
  var raf = require('cog/raf');
  ```

  ### raf(callback)

  Request animation frame helper:

  ```js
  var raf = require('cog/raf');

  function animate() {
    console.log('animating');
    raf(animate); // go again
  }

  raf(animate);
  ```

  __NOTE:__ Deprecated, moved into [dd](https://github.com/DamonOehlman/dd)
**/

module.exports = typeof window != 'undefined' && (function() {
  for (var ii = 0; ii < TEST_PROPS.length; ii++) {
    window.animFrame = window.animFrame ||
      window[TEST_PROPS[ii] + 'equestAnimationFrame'];
  } // for

  return animFrame;
})();
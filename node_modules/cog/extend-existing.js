/* jshint node: true */
'use strict';

/**
## cog/extend-existing

```js
var extend = require('cog/extend-existing');
```

### extend(target, *)

Shallow copy object properties from the supplied source objects (*) into
the target object, returning the target object once completed. This differs
from the default `extend` implementation, however, as only those properties
that exist in target will be copied from any other provided objects.

```js
extend({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }));

// --> { a: 1, b: 5 }
```

**/
module.exports = function(target) {
  [].slice.call(arguments, 1).forEach(function(source) {
    if (! source) {
      return;
    }

    for (var prop in target) {
      if (source[prop] !== undefined) {
        target[prop] = source[prop];
      }
    }
  });

  return target;
};
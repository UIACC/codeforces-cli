/* jshint node: true */
'use strict';

/**
  ## cog/jsonparse

  ```js
  var jsonparse = require('cog/jsonparse');
  ```

  ### jsonparse(input)

  This function will attempt to automatically detect stringified JSON, and
  when detected will parse into JSON objects.  The function looks for strings
  that look and smell like stringified JSON, and if found attempts to
  `JSON.parse` the input into a valid object.

**/
module.exports = function(input) {
  var isString = typeof input == 'string' || (input instanceof String);
  var reNumeric = /^\-?\d+\.?\d*$/;
  var shouldParse ;
  var firstChar;
  var lastChar;

  if ((! isString) || input.length < 2) {
    if (isString && reNumeric.test(input)) {
      return parseFloat(input);
    }

    return input;
  }

  // check for true or false
  if (input === 'true' || input === 'false') {
    return input === 'true';
  }

  // check for null
  if (input === 'null') {
    return null;
  }

  // get the first and last characters
  firstChar = input.charAt(0);
  lastChar = input.charAt(input.length - 1);

  // determine whether we should JSON.parse the input
  shouldParse =
    (firstChar == '{' && lastChar == '}') ||
    (firstChar == '[' && lastChar == ']') ||
    (firstChar == '"' && lastChar == '"');

  if (shouldParse) {
    try {
      return JSON.parse(input);
    }
    catch (e) {
      // apparently it wasn't valid json, carry on with regular processing
    }
  }


  return reNumeric.test(input) ? parseFloat(input) : input;
};
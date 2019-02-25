# cog

cog is a collection of utility modules constructed in a
[browserify](https://github.com/substack/node-browserify) friendly way.


[![NPM](https://nodei.co/npm/cog.png)](https://nodei.co/npm/cog/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/cog.svg?branch=master)](https://travis-ci.org/DamonOehlman/cog) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/cog/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/cog) 

## Why would I want to use browserify?

A lot of people don't like/get browserify.  Heck, I was one of those people.
I can say now though, with hand on heart that it is in fact, awesome
(since V2).  Let me explain why and at the same time explain how cog works.

At a very simple level browserify takes module import statements in the
form of CommonJS style `require` calls and resolves dependencies into a
useful self-contained (as self-contained as you like, I might add) script
that can run in your browser.

Not only that, but it only includes the parts of modules that are actually
used in your code into the final output.  It does this using a technique
called static analysis via a library called [esprima](http://esprima.org/).

## Browserify, NPM and avoiding "bigness"

There's a lot of good stuff that can be learned from the way node and the
node community approaches modularity, which is well voiced in the following
post by @maxogden (which also some info on cool new stuff):

<http://maxogden.com/node-packaged-modules.html>

In a quest to avoid bigness though, sometimes we are creating the opposite
problem of "littleness" which is making it difficult for us as developers
to talk about reusable code that is making our lives easier.  Back when
jQuery was the new hotness, it was really easy to communicate that to
another developer.  The same can probably be said about things such as
Backbone and Underscore.

So while the bloat that came with those libraries was bad, the ability to
communicate their usefulness quickly to our friends was not.

I propose a different approach and cog is a demonstration of that. It's the
build a collection of stuff where you only get what you need at runtime
approach.

So let's get started. Let's do this by checking out some examples
using requirebin.

## cog/defaults

```js
var defaults = require('cog/defaults');
```

### defaults(target, *)

Shallow copy object properties from the supplied source objects (*) into
the target object, returning the target object once completed.  Do not,
however, overwrite existing keys with new values:

```js
defaults({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }));
```

See an example on [requirebin](http://requirebin.com/?gist=6079475).

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

## cog/extend

```js
var extend = require('cog/extend');
```

### extend(target, *)

Shallow copy object properties from the supplied source objects (*) into
the target object, returning the target object once completed:

```js
extend({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }));
```

See an example on [requirebin](http://requirebin.com/?gist=6079475).

## cog/getable

Take an object and provide a wrapper that allows you to `get` and
`set` values on that object.

## cog/jsonparse

```js
var jsonparse = require('cog/jsonparse');
```

### jsonparse(input)

This function will attempt to automatically detect stringified JSON, and
when detected will parse into JSON objects.  The function looks for strings
that look and smell like stringified JSON, and if found attempts to
`JSON.parse` the input into a valid object.

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

## cog/loader

```js
var loader = require('cog/loader');
```

### loader(urls, opts?, callback)

This is a simple script loader that will load the urls specified
and trigger the callback once all those scripts have been loaded (or
loading has failed in one instance).

__NOTE:__ Deprecated, moved into [dd](https://github.com/DamonOehlman/dd)

## cog/logger

```js
var logger = require('cog/logger');
```

Simple browser logging offering similar functionality to the
[debug](https://github.com/visionmedia/debug) module.

### Usage

Create your self a new logging instance and give it a name:

```js
var debug = logger('phil');
```

Now do some debugging:

```js
debug('hello');
```

At this stage, no log output will be generated because your logger is
currently disabled.  Enable it:

```js
logger.enable('phil');
```

Now do some more logger:

```js
debug('Oh this is so much nicer :)');
// --> phil: Oh this is some much nicer :)
```

### Reference

#### logger(name)

Create a new logging instance.

#### logger.reset()

Reset logging (remove the default console logger, flag all loggers as
inactive, etc, etc.

#### logger.to(target)

Add a logging target.  The logger must have a `log` method attached.

#### logger.enable(names*)

Enable logging via the named logging instances.  To enable logging via all
instances, you can pass a wildcard:

```js
logger.enable('*');
```

__TODO:__ wildcard enablers

## cog/qsa

```js
var qsa = require('cog/qsa');
```

### qsa(selector, scope?)

This function is used to get the results of the querySelectorAll output
in the fastest possible way.  This code is very much based on the
implementation in
[zepto](https://github.com/madrobby/zepto/blob/master/src/zepto.js#L104),
but perhaps not quite as terse.

__NOTE:__ Deprecated, moved into [dd](https://github.com/DamonOehlman/fdom)

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

## cog/throttle

```js
var throttle = require('cog/throttle');
```

### throttle(fn, delay, opts)

A cherry-pickable throttle function.  Used to throttle `fn` to ensure
that it can be called at most once every `delay` milliseconds.  Will
fire first event immediately, ensuring the next event fired will occur
at least `delay` milliseconds after the first, and so on.

## License(s)

### MIT

Copyright (c) 2015 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

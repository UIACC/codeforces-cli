/**
# cog

cog is a collection of utility modules constructed in a
[browserify](https://github.com/substack/node-browserify) friendly way.

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
**/

/* jshint node: true */

'use strict';

module.exports = true;
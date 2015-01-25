[new-generator](https://www.npmjs.org/package/new-generator) - new Generator class for ES6 Harmony generators and iteration
=========================

  This **new Generator** is general purpose iterable generator.

  An generator is an object with a `next()` method
  that conforms to the iterable generator protocol.

  The iterable generator protocol is for the `next` method to
  return the object with next value in `value` property
  in an iteration each time that is called.
  At the end of iteration, return the object with `true` in `done` property.

  This `Generator` has `filter`, `map` or `reduce` methods like `Array`.

  **new-generator** does not directly use any ES6 Harmony features, 
  but it is designed to work well with `ES6 generators and iteration`,
  a control flow library based on ES6 generators.

  [Japanese version/■日本語版はこちら■](README-JP.md#readme)

Installation
------------

```bash
$ npm install new-generator
```

[![npm][npm-new-generator.png]][npm-new-generator]

Usage
-----

  The following example requires `node 0.11.x` (unstable)
  and must be run with the `--harmony-generators` and `--harmony-iteration`
  or `--harmony` flag.
  Future stable versions of node.js will include support for generators and iteration.

# example using new Generator

```js
var Generator = require('new-generator');

// new Generator with ES6 iteration feature (node v0.11.x)
for (var value of new Generator([11, 22, 33])
  console.log(value);
// -> 11, 22, 33

// new Generator without ES6 feature (node v0.8.x)
for (var gtor = new Generator([11, 22, 33]),
         n = gtor.next(); !n.done; n = gtor.next())
  console.log(n.value);
// -> 11, 22, 33

// conbination
console.log(
  new Generator(1, 20, true)                    // -> 1, 2, 3, ... 19, 20
  .filter(function (x) { return x % 2 === 0; }) // -> 2, 4, 6, ... 18, 20
  .map(function (x) { return x / 2; })          // -> 1, 2, 3, ...  9, 10
  .reduce(function (x, y) { return x + y; }));  // => 1 + 2 + ... + 10 = 55
```

# Generator Class

## new Generator(generator)

```js
var Generator = require('new-generator');

// Number
var g1 = new Generator(3);          // -> 0, 1, 2

// String
var g2 = new Generator('abc');      // -> 'a', 'b', 'c'

// Array
var g3 = new Generator([1, 2, 3]);  // -> 1, 2, 3

// Arguments
(function() {
  var g4 = new Generator(arguments);  // -> 10, 20, 30
})(10, 20, 30);

// other Generator
var g5 = new Generator(g1);

// ES6 Generator
function gtorEx() {
  for (var i = 0; i < 3; ++i)
    yield i;
}
// -> 0, 1, 2
var g6 = new Generator(gtorEx);    // called with no arguments by constructor
var g7 = new Generator(gtorEx());  // normal generator
```

## new Generator([from,] to, [step=1,] [boundary=false])

```js
var Generator = require('new-generator');

// without boundary value (exclude last value, start from 0)
var g1 = new Generator(3);         // -> 0, 1, 2
var g2 = new Generator(0, 3);      // -> 0, 1, 2
var g3 = new Generator(0, 5, 2);   // -> 0, 2, 4
var g4 = new Generator(3, 0);      // -> 3, 2, 1
var g5 = new Generator(5, 0, -2);  // -> 5, 3, 1

// with boundary value (include last value, start from 1)
var g6 = new Generator(3, true);          // -> 1, 2, 3
var g7 = new Generator(1, 3, true);       // -> 1, 2, 3
var g8 = new Generator(1, 5, 2, true);    // -> 1, 3, 5
var g9 = new Generator(3, 1, true);       // -> 3, 2, 1
var g10 = new Generator(5, 1, -2, true);  // -> 5, 3, 1

// you can omit `new`
var g11 = Generator(3);
```

# filter or map type of methods

## Generator#filter(fn(value), this)

```js
var Generator = require('new-generator');

console.log(new Generator(10).filter(function (x) {
  return x % 2 === 0;
}).toArray());
// -> [0, 2, 4, 6, 8]
```

## Generator#map(fn(value), this)


```js
var Generator = require('new-generator');

console.log(new Generator(5).map(function (x) {
  return x * 3;
}).toArray());
// -> [0, 3, 6, 9, 12]
```

# reduce type of methods

## Generator#reduce(fn(cumulative, value), initial, this)

```js
var Generator = require('new-generator');

console.log(new Generator(10).reduce(function (x, y) {
  return x + y;
}));
// -> 55
```

## Generator#toArray()

```js
var Generator = require('new-generator');

console.log(new Generator(5).toArray());
// -> [0, 1, 2, 3, 4]
```

# Generator class methods

## Generator.range([from,] to, [step=1,] [boundary=false])

new Generator

## Generator.count(start, [step=1])

new Generator

## Generator.chain(...generators)

new Generator

# etc

License
-------

  MIT

Git Repository
--------------

  LightSpeedWorks/[new-generator](https://github.com/LightSpeedWorks/new-generator#readme)

[npm-new-generator]: https://nodei.co/npm/new-generator
[npm-new-generator.png]: https://nodei.co/npm/new-generator.png

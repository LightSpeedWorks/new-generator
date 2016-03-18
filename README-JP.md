まだ翻訳できていません。

[English version](README.md#readme)

[new-generator](https://www.npmjs.org/package/new-generator) - new Generator class for ES2015 (ES6 Harmony) generators and iteration
=========================

  この **new Generator** は汎用の繰り返し可能なジェネレータです。

  ジェネレータは `next()` メソッドを持つ繰り返し可能なジェネレータプロトコル準拠のオブジェクトです。

  繰り返し可能なジェネレータプロトコルは `value` プロパティに値を持つオブジェクトを
  `next` メソッドを呼び出すたびに返します。
  繰り返しの終わりには `done` プロパティに `true` を持つオブジェクトを返します。  

  この `Generator` は `Array` の様に `filter`, `map` や `reduce` メソッドがあります。

  **new-generator** は ES2015 (ES6 Harmony) の機能は直接使用していませんが、
  `ES2015 (ES6) ジェネレータやイテレータ` と組み合わせると便利な様に設計された
  制御フローライブラリです。


インストレーション
------------

[![NPM](https://nodei.co/npm/new-generator.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/new-generator/)
[![NPM](https://nodei.co/npm-dl/new-generator.png?height=2)](https://nodei.co/npm/new-generator/)

```bash
$ npm install new-generator
```

[![npm][npm-new-generator.png]][npm-new-generator]

使い方
-----

  The following example requires `node v4/v5`

# new Generator を使った例

```js
var Generator = require('new-generator');

// new Generator : ES2015 (ES6) iteration 機能を使った例
for (var value of new Generator([11, 22, 33])
  console.log(value);
// -> 11, 22, 33

// new Generator : ES2015 (ES6) の機能を使わない例
for (var gtor = new Generator([11, 22, 33]),
         n = gtor.next(); !n.done; n = gtor.next())
  console.log(n.value);
// -> 11, 22, 33

// 組合せ
console.log(
  new Generator(1, 20, true)                    // -> 1, 2, 3, ... 19, 20
  .filter(function (x) { return x % 2 === 0; }) // -> 2, 4, 6, ... 18, 20
  .map(function (x) { return x / 2; })          // -> 1, 2, 3, ...  9, 10
  .reduce(function (x, y) { return x + y; }));  // => 1 + 2 + ... + 10 = 55
```

# Generator クラス

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

// 他の Generator
var g5 = new Generator(g1);

// ES2015 (ES6) ジェネレータ
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

// `new` を省略する事も出来る。
var g11 = Generator(3);
```

# filter または map タイプのメソッド

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

# reduce タイプのメソッド

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

# Generator クラスメソッド

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

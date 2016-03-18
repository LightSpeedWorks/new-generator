// new-generator-test.js

'use strict';

try {
  var Generator = require('../new-generator');
} catch (e) {
  var Generator = require('new-generator');
}

var util = require('util');

function color(ctrl, str) { return '\x1b[' + ctrl + 'm' + str + '\x1b[m'; }
function red(str)     { return color('31;1', str); }
function green(str)   { return color('32;1', str); }
function yellow(str)  { return color('33;1', str); }
function blue(str)    { return color('34;1', str); }
function magenta(str) { return color('35;1', str); }
function cyan(str)    { return color('36;1', str); }
function white(str)   { return color('37;1', str); }

var spaces = '        ';
function pad(str, n) {
  var m = Math.max(0, n - str.length);
  while (spaces.length < m) spaces += spaces;
  return str + spaces.substr(0, n - str.length);
}

function deepEqual(a, b) {
  if (typeof a !== typeof b)
    return false;

  if (a === b)
    return true;

  switch (typeof a) {
    case 'object':
      if (a === null || b === null)
        return false; // null and object

      if (a.constructor !== b.constructor)
        return false;

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length != b.length)
          return false;
      }

      for (var i in a) {
        if (!a.hasOwnProperty(i))
          continue;

        if (!b.hasOwnProperty(i))
          return false;

        if (!deepEqual(a[i], b[i]))
          return false;
      }

      for (var i in b) {
        if (!b.hasOwnProperty(i))
          continue;

        if (!a.hasOwnProperty(i))
          return false;
      }

      return true;

    case 'function':
      return false;

    case 'number':
      if (a !== a && b !== b)
        return true; // NaN
      return false;

    case 'boolean':
    case 'string':
      return false;

    default: // undefined, null
      throw new TypeError('deep equals: ' + typeof a);
  }
}

var testCaseNo = 0;

function assertThat(actual, expected, message) {
  ++testCaseNo;
  if (deepEqual(actual, expected)) {
    console.log(blue(testCaseNo) + ' ' + cyan(pad(message || '', 60)) + ' ' + green(util.inspect(actual)));
    return;
  }
  console.log(blue(testCaseNo) + ' ' + yellow('AssertError: ') + red(message));
  console.log(yellow('    actual:'), magenta(util.inspect(actual)));
  console.log(yellow('  expected:'), green(util.inspect(expected)));
  //throw new Error(message);
}

// 5              -> 0..4
assertThat(new Generator(5).toArray(), [0, 1, 2, 3, 4],
          'new Generator(5).toArray()');

// 0, 5           -> 0..4
assertThat(new Generator(0, 5).toArray(), [0, 1, 2, 3, 4],
          'new Generator(0, 5).toArray()');

// 0, 5, 1        -> 0..4
assertThat(new Generator(0, 5, 1).toArray(), [0, 1, 2, 3, 4],
          'new Generator(0, 5, 1).toArray()');

// 0, 10, 2        -> 0, 2, ... 8
assertThat(new Generator(0, 10, 2).toArray(), [0, 2, 4, 6, 8],
          'new Generator(0, 10, 2).toArray()');

// 5, 0           -> 5..1
assertThat(new Generator(5, 0).toArray(), [5, 4, 3, 2, 1],
          'new Generator(5, 0).toArray()');

// 5, 0, -1       -> 5..1
assertThat(new Generator(5, 0, -1).toArray(), [5, 4, 3, 2, 1],
          'new Generator(5, 0, -1).toArray()');

// 10, 0, -2       -> 10, 8, ... 2
assertThat(new Generator(10, 0, -2).toArray(), [10, 8, 6, 4, 2],
          'new Generator(10, 0, -2).toArray()');

// 5, true        -> 1..5
assertThat(new Generator(5, true).toArray(), [1, 2, 3, 4, 5],
          'new Generator(5, true).toArray()');

// 1, 5, true     -> 1..5
assertThat(new Generator(1, 5, true).toArray(), [1, 2, 3, 4, 5],
          'new Generator(1, 5, true).toArray()');

// 1, 5, 1, true  -> 1..5
assertThat(new Generator(1, 5, true).toArray(), [1, 2, 3, 4, 5],
          'new Generator(1, 5, true).toArray()');

// 5, 1, true     -> 5..1
assertThat(new Generator(5, 1, true).toArray(), [5, 4, 3, 2, 1],
          'new Generator(5, 1, true).toArray()');

// 5, 1, -1, true -> 5..1
assertThat(new Generator(5, 1, -1, true).toArray(), [5, 4, 3, 2, 1],
          'new Generator(5, 1, -1, true).toArray()');
console.log();

assertThat(new Generator([0, 1, 2, 3, 4]).toArray(), [0, 1, 2, 3, 4],
          'new Generator([0, 1, 2, 3, 4]).toArray()');
assertThat(new Generator('abcde').toArray(), ['a', 'b', 'c', 'd', 'e'],
          'new Generator("abcde").toArray()');
console.log();

// 範囲
function *rangeEx(from, to) {
  for (var i = from; i < to; ++i)
    yield i;
}

var actual = [];
for (var gtor = rangeEx(0, 5),
         n = gtor.next(); !n.done; n = gtor.next())
  actual.push(n.value);
assertThat(actual, [0, 1, 2, 3, 4],
  'rangeEx(0, 5).next().value -> push()');

var actual = [];
for (var value of rangeEx(0, 5))
  actual.push(value);
assertThat(actual, [0, 1, 2, 3, 4],
  'for of rangeEx(0, 5)) -> push()');

assertThat(new Generator(rangeEx(0, 5)).toArray(), [0, 1, 2, 3, 4],
          'new Generator(rangeEx(0, 5)).toArray()');
assertThat(Generator(rangeEx(0, 5)).toArray(), [0, 1, 2, 3, 4],
          'Generator(rangeEx(0, 5)).toArray()');
console.log();

// filter. フィルター
function *filterEx(gtor, fn, ctx) {
  for (var value of gtor)
    if (fn.call(ctx, value))
      yield value;
}

var actual = [];
for (var value of filterEx([0,1,2,3,4], function (x) { return x > 2; }))
  actual.push(value);
assertThat(actual, [3, 4],
  'for of filterEx([0,1,2,3,4],over2) -> push()');

var actual = [];
for (var gtor = filterEx(new Generator([0,1,2,3,4]), function (x) { return x > 2; }),
         n = gtor.next(); !n.done; n = gtor.next())
  actual.push(n.value);
assertThat(actual, [3, 4],
  'filterEx(new Generator([0,1,2,3,4]),over2).next().value -> push()');

var actual = [];
for (var gtor = filterEx(new Generator(0, 5), function (x) { return x > 2; }),
         n = gtor.next(); !n.done; n = gtor.next())
  actual.push(n.value);
assertThat(actual, [3, 4],
  'filterEx(new Generator(0, 5),over2).next().value -> push()');

var actual = [];
for (var value of filterEx(new Generator(0, 5), function (x) { return x > 2; }))
  actual.push(value);
assertThat(actual, [3, 4],
  'for of filterEx(new Generator(0, 5),over2) -> push()');

assertThat(new Generator(filterEx(new Generator(0, 5), function (x) { return x > 2; })).toArray(), [3, 4],
          'new Generator(filterEx(new Generator(0, 5),over2).toArray()');
console.log();

// map. マップ
function *mapEx(gtor, fn, ctx) {
  for (var value of gtor)
    yield fn.call(ctx, value);
}

var actual = [];
for (var gtor = mapEx(new Generator(0, 5), function (x) { return x * 2; }),
         n = gtor.next(); !n.done; n = gtor.next())
  actual.push(n.value);
assertThat(actual, [0, 2, 4, 6, 8],
  'mapEx(new Generator(0, 5),mul2).next().value -> push()');

var actual = [];
for (var value of mapEx(new Generator(0, 5), function (x) { return x * 2; }))
  actual.push(value);
assertThat(actual, [0, 2, 4, 6, 8],
  'for of filterEx(new Generator(0, 5),mul2) -> push()');

assertThat(new Generator(mapEx(new Generator(0, 5), function (x) { return x * 2; })).toArray(), [0, 2, 4, 6, 8],
  'new Generator(mapEx(new Generator(0, 5),mul2).toArray()');
console.log();

// reduce. リデュース
function reduceEx(gtor, fn, initial, ctx) {
  var result;
  for (var value of gtor) {
    if (result === undefined) {
      if (initial === undefined)
        result = value;
      else
        result = fn.call(ctx, initial, value);
    }
    else
      result = fn.call(ctx, result, value);
  }
  return result;
}

function reduceOld(gtor, fn, initial, ctx) {
  var n = gtor.next();
  var result = n.value;
  if (typeof initial !== 'undefined')
    result = fn.call(ctx, initial, n.value);
  if (!n.done)
    for (var n = gtor.next(); !n.done; n = gtor.next())
      result = fn.call(ctx, result, n.value);
  return result;
}

assertThat(reduceEx(new Generator(0, 5), function (x, y) { return x + y; }), 10,
  'reduceEx(new Generator(0, 5),add)');
assertThat(new Generator(0, 5).reduce(function (x, y) { return x + y; }), 10,
  'new Generator(0, 5).reduce(add)');
assertThat(reduceEx(new Generator(1, 5), function (x, y) { return x * y; }), 24,
  'reduceEx(new Generator(1, 5),mul)');
assertThat(new Generator(1, 5).reduce(function (x, y) { return x * y; }), 24,
  'new Generator(1, 5).reduce(mul)');
console.log();

// 組合せ
var actual = [];
for (var gtor = new Generator(0, 5)
             .filter(function (x) { return x > 2; })
             .map(function (x) { return x * 2; }),
         n = gtor.next(); !n.done; n = gtor.next())
  actual.push(n.value);
assertThat(actual, [6, 8], 'range(0,5).filter.map');
//  console.log('       range(0,5).filter.map:', n.value);

var actual = [];
for (var value of new Generator(0, 5)
             .filter(function (x) { return x > 2; })
             .map(function (x) { return x * 2; }))
  actual.push(value);
assertThat(actual, [6, 8], 'for of range(0,5).filter.map');
//  console.log('for of range(0,5).filter.map:', v);
console.log();

// toArray ジェネレータから配列を取り出す
function toArrayEx(gtor) {
  var values = [];
  for (var value of gtor)
    values.push(value);
  return values;
}

function toArrayOld(gtor) {
  var values = [];
  for (var n = gtor.next(); !n.done; n = gtor.next())
    values.push(n.value);
  return values;
}

assertThat(toArrayEx(new Generator(0, 5)), [0, 1, 2, 3, 4],
          'toArray(new Generator(0, 5))');
assertThat(new Generator(0, 5).toArray(), [0, 1, 2, 3, 4],
          'new Generator(0, 5).toArray()');
console.log();

// fibonacci フィボナッチ
function *fibonacciEx(n) {
  var i = 0;
  var a = 0;
  var b = 1;
  for (;;) {
    yield a;
    var c = a + b;
    a = b;
    b = c;
    if (n <= ++i) return;
  }
}

assertThat(new Generator(fibonacciEx(8)).toArray() ,
  [ 0, 1, 1, 2, 3, 5, 8, 13 ],
  'new Generator(fibonacciEx(8)).toArray()');

//console.log('new Generator(fibonacci(8)).toArray():', new Generator(fibonacciEx(8)).toArray());
console.log();

assertThat(new Generator('abc').toArray(), ['a', 'b', 'c'],
          'new Generator("abc").toArray()');
assertThat(new Generator([1, 2, 3]).toArray(), [1, 2, 3],
          'new Generator([1, 2, 3]).toArray()');
assertThat(new Generator(3).toArray(), [0, 1, 2],
          'new Generator(3).toArray()');
console.log();

try {
  for (var value of new Generator({}))
    console.log('for of new Generator(\'abc\'):', value);
} catch (e) {
  console.log(cyan('for of new Generator({}) ') + yellow('Error: ') + green(e.toString()));
}
console.log();

function *gtorEx() {
  yield 11;
  yield 22;
  yield 33;
}

assertThat(new Generator(gtorEx).toArray(), [11, 22, 33],
          'new Generator(gtorEx).toArray()');
assertThat(new Generator(gtorEx()).toArray(), [11, 22, 33],
          'new Generator(gtorEx()).toArray()');
console.log();

(function () {
  assertThat(new Generator(arguments).toArray(), [111, 222, 333],
            'new Generator(arguments).toArray()');
})(111, 222, 333);
console.log();

assertThat(
  new Generator(1, 20, true)
  .filter(function (x) { return x % 2 === 0; })
  .map(function (x) { return x / 2; })
  .reduce(function (x, y) { return x + y; }), 55,
  'new Generator(1, 20, true).filter(even).map(div2).reduce(add)');
console.log();

assertThat(new Generator(1, 20, true).take(10).toArray(),
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  'new Generator(1, 20, true).take(10).toArray()');
assertThat(new Generator(20, 1, true).skip(10).toArray(),
  [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ],
  'new Generator(20, 1, true).skip(10).toArray()');
assertThat(new Generator(-9, Infinity, true).skip(10).take(10).toArray(),
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  'new Generator(-9, Infinity, true).skip(10).take(10).toArray()');
assertThat(Generator(1, 20, true).take(10).toArray(),
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  'Generator(1, 20, true).take(10).toArray()');
assertThat(Generator(20, 1, true).skip(10).toArray(),
  [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ],
  'Generator(20, 1, true).skip(10).toArray()');
assertThat(Generator(-9, Infinity, true).skip(10).take(10).toArray(),
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  'Generator(-9, Infinity, true).skip(10).take(10).toArray()');

assertThat(Generator.chain(new Generator(3), new Generator(3)).toArray(),
  [ 0, 1, 2, 0, 1, 2 ],
  'Generator.chain(new Generator(3), new Generator(3)).toArray()');
assertThat(Generator.chain(Generator(3), Generator(3)).toArray(),
  [ 0, 1, 2, 0, 1, 2 ],
  'Generator.chain(Generator(3), Generator(3)).toArray()');
assertThat(Generator.chain(3, 'abc', [3, 2, 1]).toArray(),
  [ 0, 1, 2, 'a', 'b', 'c', 3, 2, 1 ],
  'Generator.chain(3, "abc", [3, 2, 1]).toArray()');
console.log();

console.log('FizzBuzz');
assertThat(
  new Generator(20, true)
  .map(function (x) { return x % 3 === 0 && x % 5 === 0 ? 'FizzBuzz' : x; })
  .map(function (x) { return x % 3 === 0 ? 'Fizz' : x; })
  .map(function (x) { return x % 5 === 0 ? 'Buzz' : x; })
  .toArray(),
  [ 1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz',
  13, 14, 'FizzBuzz', 16, 17, 'Fizz', 19, 'Buzz' ],
  'new Generator(20,true).map(FizzBuzz).map(Fizz).map(Buzz).toArray()');

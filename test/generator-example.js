'use strict';

function *a() {
  yield 0;
  yield 1;
  yield 2;
  yield 3;
  yield 4;
}

var b = [0,1,2,3,4];

var c = 'abcde';

// filter. フィルター
function *filterEx(gtor, fn, ctx) {
  for (var value of gtor)
    if (fn.call(ctx, value))
      yield value;
}

var actual = [];
for (var value of filterEx([0,1,2,3,4], function (x) { return x > 2; }))
  actual.push(value);
console.log(actual);
//assertThat(actual, [3, 4],
//  'for of filterEx(new Generator(0, 5),over2) -> push()');

var actual = [];
for (var value of filterEx(a(), function (x) { return x > 2; }))
  actual.push(value);
console.log(actual);
//assertThat(actual, [3, 4],
//  'for of filterEx(new Generator(0, 5),over2) -> push()');

console.log('a.name:', a.name);
console.log('a.constructor.name:', a.constructor.name);
console.log('typeof a:', typeof a);
console.log('typeof a():', typeof a());
console.log('typeof a()[Symbol.iterator]:', typeof a()[Symbol.iterator]);
for (var v of a()) console.log('a1', v);
for (var v of a()[Symbol.iterator]()) console.log('a2', v);

console.log('b.name:', b.name);
console.log('b.constructor.name:', b.constructor.name);
console.log('typeof b:', typeof b);
console.log('typeof b[Symbol.iterator]:', typeof b[Symbol.iterator]);
for (var v of b) console.log('b1', v);
for (var v of b[Symbol.iterator]()) console.log('b2', v);

console.log('c.name:', c.name);
console.log('c.constructor.name:', c.constructor.name);
console.log('typeof c:', typeof c);
console.log('typeof c[Symbol.iterator]:', typeof c[Symbol.iterator]);
for (var v of c) console.log('c1', v);
for (var v of c[Symbol.iterator]()) console.log('c2', v);

var i = 0, n = 5;
var g = {
	next: function () {
		return i < n ? {value: i++, done: false} : {value: undefined, done: true};
	}
};
g[Symbol.iterator] = function () { return g; };
for (var v of g) console.log('g', v);

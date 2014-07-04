// new-generator.js

(function () {
'use strict';

var util = require('util');

/**
 * Generator. ジェネレータ
 *
 * @param generator
 *    - Generator Function
 *    - generator object that has 'next' function
 *    - Array, String, Arguments, and so on
 *    - Number or Range arguments
 */
function Generator(generator, to, step, boundary) {
  if (!(this instanceof Generator))
    return new Generator(generator, to, step, boundary);

  // Generator Function
  if (typeof generator === 'function' &&
      generator.constructor.name === 'GeneratorFunction') {
    this.generator = generator();
    return;
  }

  // Number or Range arguments
  if (generator instanceof Number || typeof generator === 'number') {
    this.generator = range(Number(generator), to, step, boundary);
    return;
  }

  // Array, String, Arguments, and so on...
  var index, length;
  if (generator instanceof Array ||
      generator instanceof String ||
      typeof generator === 'string' ||
      typeof generator === 'object' &&
      typeof generator.length === 'number') {
    length = generator.length;
    if (length < 0) throw new Error('length must be plus value');
    index = 0;
    this.generator = {
      next: function next() {
        if (index >= length)
          return {done: true};
        return {done: false, value: generator[index++]};
      }
    };
    return;
  }

  // generator object that has 'next' function
  if (typeof generator.next === 'function') {
    this.generator = generator;
    return;
  }

  throw new TypeError('Unsupported generator: ' +
    typeof generator + ' ' + util.inspect(generator));
}

// next. ネクスト
Generator.prototype.next = function next() {
  return this.generator.next();
}

// toArray. 配列に変換する
Generator.prototype.toArray = function toArray() {
  var values = [];

  //for (var value of this)
  for (var n = this.next(); !n.done; n = this.next())
    values.push(n.value);
  return values;
}

// forEach.
Generator.prototype.forEach = function forEach(fn, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  //for (var value of this)
  for (var n = this.next(); !n.done; n = this.next())
    fn.call(ctx, n.value);
  return;
}

// every. 全て真であるかどうか
Generator.prototype.every = function every(fn, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  //for (var value of this)
  for (var n = this.next(); !n.done; n = this.next()) {
    if (!fn.call(ctx, n.value)) return false;
  }
  return true;
}

// some. どれかひとつでも真かどうか
Generator.prototype.every = function every(fn, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  //for (var value of this)
  for (var n = this.next(); !n.done; n = this.next()) {
    if (fn.call(ctx, n.value)) return true;
  }
  return false;
}

// range. 範囲
Generator.range = function range(from, to, step, boundary) {
  return new Generator(range(from, to, step, boundary));
}

// count. カウント
Generator.count = function count(start, step) {
  return new Generator(range(start, Infinity, step));
}

// chain. 連鎖
Generator.chain = function chain(/*...generators*/) {
  var generators = Array.prototype.slice.call(arguments);
  var length = generators.length;
  for (var i = 0; i < length; ++i) {
    if (!(generators[i] instanceof Generator))
      generators[i] = new Generator(generators[i]);
  }
  var index = 0;
  return new Generator({
    next: function next() {
      for (;;) {
        if (index >= length)
          return {done: true};

        var n = generators[index].next();
        if (!n.done) return n;
        index++;
      }
    }
  });
}

// filter. フィルタ
Generator.prototype.filter = function filter(fn, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  var self = this;
  return new Generator({
    next : function next() {
      for (;;) {
        var n = self.next();
        if (n.done) return n;
        if (fn.call(ctx, n.value)) return n;
      }
    }
  })
}

// map. マップ
Generator.prototype.map = function map(fn, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  var self = this;
  return new Generator({
    next: function next() {
      var n = self.next();
      if (n.done) return n;
      return {done: false, value: fn.call(ctx, n.value)};
    }
  });
}

// take. テイク
Generator.prototype.take = function take(n) {
  if (typeof n !== 'number')
    throw new TypeError('must be a number');

  if (n < 0) throw new TypeError('must be plus value');

  var self = this;
  return new Generator({
    next: function next() {
      if (n <= 0) return {done: true};
      n--;
      return self.next();
    }
  });
}

// skip. スキップ
Generator.prototype.skip = function skip(n) {
  if (typeof n !== 'number')
    throw new TypeError('must be a number');

  if (n < 0) throw new TypeError('must be plus value');

  var self = this;
  return new Generator({
    next: function next() {
      while (n > 0) {
        self.next();
        n--;
      }
      return self.next();
    }
  });
}

// reduce. リデュース(集約)
Generator.prototype.reduce = function reduce(fn, initial, ctx) {
  if (typeof fn !== 'function')
    throw new TypeError('must be a function');

  var n = this.next();
  var result;

  if (typeof initial !== 'undefined' || arguments.length > 1)
    result = fn.call(ctx, initial, n.value);
  else
    result = n.value;

  if (n.done) return result;

  for (var n = this.next(); !n.done; n = this.next())
    result = fn.call(ctx, result, n.value);

  return result;
}

// range. 範囲
// range(from, to, step, boundary)
// 5              -> 0..4
// 0, 5           -> 0..4
// 0, 5, 1        -> 0..4
// 5, 0           -> 5..1
// 5, 0, -1       -> 5..1
// 5, true        -> 1..5
// 1, 5, true     -> 1..5
// 1, 5, 1, true  -> 1..5
// 5, 1, true     -> 5..1
// 5, 1, -1, true -> 5..1
function range(from, to, step, boundary) {
  if (typeof to === 'boolean')
    boundary = to, to = step = undefined;

  if (typeof step === 'boolean')
    boundary = step, step = undefined;

  if (typeof boundary !== 'boolean')
    boundary = false;

  if (typeof to === 'undefined')
    to = from, from = boundary ? 1 : 0;

  if (typeof step === 'undefined')
    step = from <= to ? 1 : -1;

  if (step === 0) throw new Error('step must not be zero');

  if (from <= to) {
    if (step <= 0) throw new Error('step must be plus value');
  }
  else {
    if (step >= 0) throw new Error('step must be minus value');
  }

  var value = from;
  var index = 0;
  var length = Math.floor((to - from + (boundary? step: 0))/ step);

  return {
    next: function next() {
      if (index >= length)
        return {done: true};

      var result = {done: false, value: value};
      value += step;
      index++;
      return result;
    }
  };
}

exports = module.exports = Generator;

})();

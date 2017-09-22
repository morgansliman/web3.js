"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.Web3Bzz = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      'use strict';

      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;

      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }

      revLookup['-'.charCodeAt(0)] = 62;
      revLookup['_'.charCodeAt(0)] = 63;

      function placeHoldersCount(b64) {
        var len = b64.length;
        if (len % 4 > 0) {
          throw new Error('Invalid string. Length must be a multiple of 4');
        }

        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
      }

      function byteLength(b64) {
        // base64 is 4/3 + up to two characters of the original data
        return b64.length * 3 / 4 - placeHoldersCount(b64);
      }

      function toByteArray(b64) {
        var i, l, tmp, placeHolders, arr;
        var len = b64.length;
        placeHolders = placeHoldersCount(b64);

        arr = new Arr(len * 3 / 4 - placeHolders);

        // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? len - 4 : len;

        var L = 0;

        for (i = 0; i < l; i += 4) {
          tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
          arr[L++] = tmp >> 16 & 0xFF;
          arr[L++] = tmp >> 8 & 0xFF;
          arr[L++] = tmp & 0xFF;
        }

        if (placeHolders === 2) {
          tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
          arr[L++] = tmp & 0xFF;
        } else if (placeHolders === 1) {
          tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
          arr[L++] = tmp >> 8 & 0xFF;
          arr[L++] = tmp & 0xFF;
        }

        return arr;
      }

      function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
      }

      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i = start; i < end; i += 3) {
          tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
          output.push(tripletToBase64(tmp));
        }
        return output.join('');
      }

      function fromByteArray(uint8) {
        var tmp;
        var len = uint8.length;
        var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
        var output = '';
        var parts = [];
        var maxChunkLength = 16383; // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
          parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
          tmp = uint8[len - 1];
          output += lookup[tmp >> 2];
          output += lookup[tmp << 4 & 0x3F];
          output += '==';
        } else if (extraBytes === 2) {
          tmp = (uint8[len - 2] << 8) + uint8[len - 1];
          output += lookup[tmp >> 10];
          output += lookup[tmp >> 4 & 0x3F];
          output += lookup[tmp << 2 & 0x3F];
          output += '=';
        }

        parts.push(output);

        return parts.join('');
      }
    }, {}], 2: [function (require, module, exports) {}, {}], 3: [function (require, module, exports) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      /* eslint-disable no-proto */

      'use strict';

      var base64 = require('base64-js');
      var ieee754 = require('ieee754');

      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;

      var K_MAX_LENGTH = 0x7fffffff;
      exports.kMaxLength = K_MAX_LENGTH;

      /**
       * If `Buffer.TYPED_ARRAY_SUPPORT`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Print warning and recommend using `buffer` v4.x which has an Object
       *               implementation (most compatible, even IE6)
       *
       * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
       * Opera 11.6+, iOS 4.2+.
       *
       * We report that the browser does not support typed arrays if the are not subclassable
       * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
       * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
       * for __proto__ and has a buggy typed array implementation.
       */
      Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

      if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
      }

      function typedArraySupport() {
        // Can typed array instances can be augmented?
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
              return 42;
            } };
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }

      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('Invalid typed array length');
        }
        // Return an augmented `Uint8Array` instance
        var buf = new Uint8Array(length);
        buf.__proto__ = Buffer.prototype;
        return buf;
      }

      /**
       * The Buffer constructor returns instances of `Uint8Array` that have their
       * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
       * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
       * and the `Uint8Array` methods. Square bracket notation works as expected -- it
       * returns a single octet.
       *
       * The `Uint8Array` prototype remains unmodified.
       */

      function Buffer(arg, encodingOrOffset, length) {
        // Common case.
        if (typeof arg === 'number') {
          if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }

      // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
      if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
        Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true,
          enumerable: false,
          writable: false
        });
      }

      Buffer.poolSize = 8192; // not used by this implementation

      function from(value, encodingOrOffset, length) {
        if (typeof value === 'number') {
          throw new TypeError('"value" argument must not be a number');
        }

        if (isArrayBuffer(value)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }

        if (typeof value === 'string') {
          return fromString(value, encodingOrOffset);
        }

        return fromObject(value);
      }

      /**
       * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
       * if value is a number.
       * Buffer.from(str[, encoding])
       * Buffer.from(array)
       * Buffer.from(buffer)
       * Buffer.from(arrayBuffer[, byteOffset[, length]])
       **/
      Buffer.from = function (value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };

      // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
      // https://github.com/feross/buffer/pull/148
      Buffer.prototype.__proto__ = Uint8Array.prototype;
      Buffer.__proto__ = Uint8Array;

      function assertSize(size) {
        if (typeof size !== 'number') {
          throw new TypeError('"size" argument must be a number');
        } else if (size < 0) {
          throw new RangeError('"size" argument must not be negative');
        }
      }

      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== undefined) {
          // Only pay attention to encoding if it's a string. This
          // prevents accidentally sending in a number that would
          // be interpretted as a start offset.
          return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }

      /**
       * Creates a new filled Buffer instance.
       * alloc(size[, fill[, encoding]])
       **/
      Buffer.alloc = function (size, fill, encoding) {
        return alloc(size, fill, encoding);
      };

      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }

      /**
       * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
       * */
      Buffer.allocUnsafe = function (size) {
        return allocUnsafe(size);
      };
      /**
       * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
       */
      Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(size);
      };

      function fromString(string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
          encoding = 'utf8';
        }

        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding');
        }

        var length = byteLength(string, encoding) | 0;
        var buf = createBuffer(length);

        var actual = buf.write(string, encoding);

        if (actual !== length) {
          // Writing a hex string, for example, that contains invalid characters will
          // cause everything after the first invalid character to be ignored. (e.g.
          // 'abxxcd' will be treated as 'ab')
          buf = buf.slice(0, actual);
        }

        return buf;
      }

      function fromArrayLike(array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0;
        var buf = createBuffer(length);
        for (var i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }

      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('\'offset\' is out of bounds');
        }

        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('\'length\' is out of bounds');
        }

        var buf;
        if (byteOffset === undefined && length === undefined) {
          buf = new Uint8Array(array);
        } else if (length === undefined) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }

        // Return an augmented `Uint8Array` instance
        buf.__proto__ = Buffer.prototype;
        return buf;
      }

      function fromObject(obj) {
        if (Buffer.isBuffer(obj)) {
          var len = checked(obj.length) | 0;
          var buf = createBuffer(len);

          if (buf.length === 0) {
            return buf;
          }

          obj.copy(buf, 0, 0, len);
          return buf;
        }

        if (obj) {
          if (isArrayBufferView(obj) || 'length' in obj) {
            if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
              return createBuffer(0);
            }
            return fromArrayLike(obj);
          }

          if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
            return fromArrayLike(obj.data);
          }
        }

        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
      }

      function checked(length) {
        // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= K_MAX_LENGTH) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
        }
        return length | 0;
      }

      function SlowBuffer(length) {
        if (+length != length) {
          // eslint-disable-line eqeqeq
          length = 0;
        }
        return Buffer.alloc(+length);
      }

      Buffer.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true;
      };

      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError('Arguments must be Buffers');
        }

        if (a === b) return 0;

        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };

      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'latin1':
          case 'binary':
          case 'base64':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true;
          default:
            return false;
        }
      };

      Buffer.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }

        if (list.length === 0) {
          return Buffer.alloc(0);
        }

        var i;
        if (length === undefined) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }

        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          }
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };

      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) {
          return string.length;
        }
        if (isArrayBufferView(string) || isArrayBuffer(string)) {
          return string.byteLength;
        }
        if (typeof string !== 'string') {
          string = '' + string;
        }

        var len = string.length;
        if (len === 0) return 0;

        // Use a for loop to avoid recursion
        var loweredCase = false;
        for (;;) {
          switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
              return len;
            case 'utf8':
            case 'utf-8':
            case undefined:
              return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2;
            case 'hex':
              return len >>> 1;
            case 'base64':
              return base64ToBytes(string).length;
            default:
              if (loweredCase) return utf8ToBytes(string).length; // assume utf8
              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer.byteLength = byteLength;

      function slowToString(encoding, start, end) {
        var loweredCase = false;

        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.

        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
        if (start === undefined || start < 0) {
          start = 0;
        }
        // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.
        if (start > this.length) {
          return '';
        }

        if (end === undefined || end > this.length) {
          end = this.length;
        }

        if (end <= 0) {
          return '';
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0;
        start >>>= 0;

        if (end <= start) {
          return '';
        }

        if (!encoding) encoding = 'utf8';

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end);

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end);

            case 'ascii':
              return asciiSlice(this, start, end);

            case 'latin1':
            case 'binary':
              return latin1Slice(this, start, end);

            case 'base64':
              return base64Slice(this, start, end);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = (encoding + '').toLowerCase();
              loweredCase = true;
          }
        }
      }

      // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
      // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
      // reliably in a browserify context because there could be multiple different
      // copies of the 'buffer' package in use. This method works even for Buffer
      // instances that were created from another copy of the `buffer` package.
      // See: https://github.com/feross/buffer/issues/154
      Buffer.prototype._isBuffer = true;

      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }

      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 16-bits');
        }
        for (var i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };

      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 32-bits');
        }
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };

      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 64-bits');
        }
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };

      Buffer.prototype.toString = function toString() {
        var length = this.length;
        if (length === 0) return '';
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };

      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
        if (this === b) return true;
        return Buffer.compare(this, b) === 0;
      };

      Buffer.prototype.inspect = function inspect() {
        var str = '';
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
          if (this.length > max) str += ' ... ';
        }
        return '<Buffer ' + str + '>';
      };

      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) {
          throw new TypeError('Argument must be a Buffer');
        }

        if (start === undefined) {
          start = 0;
        }
        if (end === undefined) {
          end = target ? target.length : 0;
        }
        if (thisStart === undefined) {
          thisStart = 0;
        }
        if (thisEnd === undefined) {
          thisEnd = this.length;
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError('out of range index');
        }

        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }

        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;

        if (this === target) return 0;

        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);

        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);

        for (var i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };

      // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
      // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
      //
      // Arguments:
      // - buffer - a Buffer to search
      // - val - a string, Buffer, or number
      // - byteOffset - an index into `buffer`; will be clamped to an int32
      // - encoding - an optional encoding, relevant is val is a string
      // - dir - true for indexOf, false for lastIndexOf
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1;

        // Normalize byteOffset
        if (typeof byteOffset === 'string') {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 0x7fffffff) {
          byteOffset = 0x7fffffff;
        } else if (byteOffset < -0x80000000) {
          byteOffset = -0x80000000;
        }
        byteOffset = +byteOffset; // Coerce to Number.
        if (numberIsNaN(byteOffset)) {
          // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
          byteOffset = dir ? 0 : buffer.length - 1;
        }

        // Normalize byteOffset: negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;else return -1;
        }

        // Normalize val
        if (typeof val === 'string') {
          val = Buffer.from(val, encoding);
        }

        // Finally, search either indexOf (if dir is true) or lastIndexOf
        if (Buffer.isBuffer(val)) {
          // Special case: looking for empty string/buffer always fails
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === 'number') {
          val = val & 0xFF; // Search for a byte value [0-255]
          if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }

        throw new TypeError('val must be string, number or Buffer');
      }

      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;

        if (encoding !== undefined) {
          encoding = String(encoding).toLowerCase();
          if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }

        function read(buf, i) {
          if (indexSize === 1) {
            return buf[i];
          } else {
            return buf.readUInt16BE(i * indexSize);
          }
        }

        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }

        return -1;
      }

      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };

      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };

      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };

      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }

        // must be an even number of digits
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

        if (length > strLen / 2) {
          length = strLen / 2;
        }
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }

      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }

      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }

      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }

      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }

      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }

      Buffer.prototype.write = function write(string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8';
          length = this.length;
          offset = 0;
          // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset;
          length = this.length;
          offset = 0;
          // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = 'utf8';
          } else {
            encoding = length;
            length = undefined;
          }
        } else {
          throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
        }

        var remaining = this.length - offset;
        if (length === undefined || length > remaining) length = remaining;

        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError('Attempt to write outside buffer bounds');
        }

        if (!encoding) encoding = 'utf8';

        var loweredCase = false;
        for (;;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length);

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length);

            case 'ascii':
              return asciiWrite(this, string, offset, length);

            case 'latin1':
            case 'binary':
              return latin1Write(this, string, offset, length);

            case 'base64':
              // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };

      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };

      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }

      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];

        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }

          if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
          } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
          }

          res.push(codePoint);
          i += bytesPerSequence;
        }

        return decodeCodePointsArray(res);
      }

      // Based on http://stackoverflow.com/a/22747272/680742, the browser with
      // the lowest limit is Chrome, with 0x10000 args.
      // We go 1 magnitude less, for safety
      var MAX_ARGUMENTS_LENGTH = 0x1000;

      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
        }

        // Decode in chunks to avoid "call stack size exceeded".
        var res = '';
        var i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        }
        return res;
      }

      function asciiSlice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 0x7F);
        }
        return ret;
      }

      function latin1Slice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }

      function hexSlice(buf, start, end) {
        var len = buf.length;

        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;

        var out = '';
        for (var i = start; i < end; ++i) {
          out += toHex(buf[i]);
        }
        return out;
      }

      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = '';
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }

      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = end === undefined ? len : ~~end;

        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }

        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }

        if (end < start) end = start;

        var newBuf = this.subarray(start, end);
        // Return an augmented `Uint8Array` instance
        newBuf.__proto__ = Buffer.prototype;
        return newBuf;
      };

      /*
       * Need to make sure that buffer isn't trying to write out of bounds.
       */
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
      }

      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }

        return val;
      };

      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength, this.length);
        }

        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul;
        }

        return val;
      };

      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };

      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };

      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };

      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);

        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
      };

      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };

      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }
        mul *= 0x80;

        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

        return val;
      };

      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul;
        }
        mul *= 0x80;

        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

        return val;
      };

      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 0x80)) return this[offset];
        return (0xff - this[offset] + 1) * -1;
      };

      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };

      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };

      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };

      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };

      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };

      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };

      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var mul = 1;
        var i = 0;
        this[offset] = value & 0xFF;
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = value & 0xFF;
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
        this[offset] = value & 0xff;
        return offset + 1;
      };

      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };

      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
        return offset + 2;
      };

      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 0xff;
        return offset + 4;
      };

      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
        return offset + 4;
      };

      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);

          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = value & 0xFF;
        while (++i < byteLength && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);

          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = value & 0xFF;
        while (--i >= 0 && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
        if (value < 0) value = 0xff + value + 1;
        this[offset] = value & 0xff;
        return offset + 1;
      };

      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };

      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
        return offset + 2;
      };

      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };

      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        if (value < 0) value = 0xffffffff + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
        return offset + 4;
      };

      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
        if (offset < 0) throw new RangeError('Index out of range');
      }

      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };

      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };

      // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;

        // Copy 0 bytes; we're done
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;

        // Fatal error conditions
        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds');
        }
        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
        if (end < 0) throw new RangeError('sourceEnd out of bounds');

        // Are we oob?
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }

        var len = end - start;
        var i;

        if (this === target && start < targetStart && targetStart < end) {
          // descending copy from end
          for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
          }
        } else if (len < 1000) {
          // ascending copy from start
          for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
          }
        } else {
          Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        }

        return len;
      };

      // Usage:
      //    buffer.fill(number[, offset[, end]])
      //    buffer.fill(buffer[, offset[, end]])
      //    buffer.fill(string[, offset[, end]][, encoding])
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
          if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
          }
          if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (code < 256) {
              val = code;
            }
          }
          if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
          }
          if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
          }
        } else if (typeof val === 'number') {
          val = val & 255;
        }

        // Invalid ranges are not set to a default, so can range check early.
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError('Out of range index');
        }

        if (end <= start) {
          return this;
        }

        start = start >>> 0;
        end = end === undefined ? this.length : end >>> 0;

        if (!val) val = 0;

        var i;
        if (typeof val === 'number') {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          var bytes = Buffer.isBuffer(val) ? val : new Buffer(val, encoding);
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }

        return this;
      };

      // HELPER FUNCTIONS
      // ================

      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

      function base64clean(str) {
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = str.trim().replace(INVALID_BASE64_RE, '');
        // Node converts strings with length < 2 to ''
        if (str.length < 2) return '';
        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
          str = str + '=';
        }
        return str;
      }

      function toHex(n) {
        if (n < 16) return '0' + n.toString(16);
        return n.toString(16);
      }

      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];

        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);

          // is surrogate component
          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              }

              // valid lead
              leadSurrogate = codePoint;

              continue;
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = codePoint;
              continue;
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          }

          leadSurrogate = null;

          // encode utf8
          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else {
            throw new Error('Invalid code point');
          }
        }

        return bytes;
      }

      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF);
        }
        return byteArray;
      }

      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;

          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }

        return byteArray;
      }

      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }

      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }

      // ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
      // but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
      function isArrayBuffer(obj) {
        return obj instanceof ArrayBuffer || obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' && typeof obj.byteLength === 'number';
      }

      // Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
      function isArrayBufferView(obj) {
        return typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(obj);
      }

      function numberIsNaN(obj) {
        return obj !== obj; // eslint-disable-line no-self-compare
      }
    }, { "base64-js": 1, "ieee754": 4 }], 4: [function (require, module, exports) {
      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];

        i += d;

        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };

      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

        value = Math.abs(value);

        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }

          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

        buffer[offset + i - d] |= s * 128;
      };
    }, {}], 5: [function (require, module, exports) {
      (function (process) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        // resolves . and .. elements in a path array with directory names there
        // must be no slashes, empty elements, or device names (c:\) in the array
        // (so also no leading and trailing slashes - it does not distinguish
        // relative and absolute paths)
        function normalizeArray(parts, allowAboveRoot) {
          // if the path tries to go above the root, `up` ends up > 0
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
              parts.splice(i, 1);
            } else if (last === '..') {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }

          // if the path is allowed to go above the root, restore leading ..s
          if (allowAboveRoot) {
            for (; up--; up) {
              parts.unshift('..');
            }
          }

          return parts;
        }

        // Split a filename into [root, dir, basename, ext], unix version
        // 'root' is just a slash, or nothing.
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        var splitPath = function splitPath(filename) {
          return splitPathRe.exec(filename).slice(1);
        };

        // path.resolve([from ...], to)
        // posix version
        exports.resolve = function () {
          var resolvedPath = '',
              resolvedAbsolute = false;

          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : process.cwd();

            // Skip empty and invalid entries
            if (typeof path !== 'string') {
              throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
              continue;
            }

            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
          }

          // At this point the path should be resolved to a full absolute path, but
          // handle relative paths to be safe (might happen when process.cwd() fails)

          // Normalize the path
          resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
            return !!p;
          }), !resolvedAbsolute).join('/');

          return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
        };

        // path.normalize(path)
        // posix version
        exports.normalize = function (path) {
          var isAbsolute = exports.isAbsolute(path),
              trailingSlash = substr(path, -1) === '/';

          // Normalize the path
          path = normalizeArray(filter(path.split('/'), function (p) {
            return !!p;
          }), !isAbsolute).join('/');

          if (!path && !isAbsolute) {
            path = '.';
          }
          if (path && trailingSlash) {
            path += '/';
          }

          return (isAbsolute ? '/' : '') + path;
        };

        // posix version
        exports.isAbsolute = function (path) {
          return path.charAt(0) === '/';
        };

        // posix version
        exports.join = function () {
          var paths = Array.prototype.slice.call(arguments, 0);
          return exports.normalize(filter(paths, function (p, index) {
            if (typeof p !== 'string') {
              throw new TypeError('Arguments to path.join must be strings');
            }
            return p;
          }).join('/'));
        };

        // path.relative(from, to)
        // posix version
        exports.relative = function (from, to) {
          from = exports.resolve(from).substr(1);
          to = exports.resolve(to).substr(1);

          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== '') break;
            }

            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== '') break;
            }

            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }

          var fromParts = trim(from.split('/'));
          var toParts = trim(to.split('/'));

          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }

          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
          }

          outputParts = outputParts.concat(toParts.slice(samePartsLength));

          return outputParts.join('/');
        };

        exports.sep = '/';
        exports.delimiter = ':';

        exports.dirname = function (path) {
          var result = splitPath(path),
              root = result[0],
              dir = result[1];

          if (!root && !dir) {
            // No dirname whatsoever
            return '.';
          }

          if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
          }

          return root + dir;
        };

        exports.basename = function (path, ext) {
          var f = splitPath(path)[2];
          // TODO: make this comparison case-insensitive on windows?
          if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
          }
          return f;
        };

        exports.extname = function (path) {
          return splitPath(path)[3];
        };

        function filter(xs, f) {
          if (xs.filter) return xs.filter(f);
          var res = [];
          for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs)) res.push(xs[i]);
          }
          return res;
        }

        // String.prototype.substr - negative index don't work in IE8
        var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
          return str.substr(start, len);
        } : function (str, start, len) {
          if (start < 0) start = str.length + start;
          return str.substr(start, len);
        };
      }).call(this, require('_process'));
    }, { "_process": 6 }], 6: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}], 7: [function (require, module, exports) {
      var isFunction = require('is-function');

      module.exports = forEach;

      var toString = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;

      function forEach(list, iterator, context) {
        if (!isFunction(iterator)) {
          throw new TypeError('iterator must be a function');
        }

        if (arguments.length < 3) {
          context = this;
        }

        if (toString.call(list) === '[object Array]') forEachArray(list, iterator, context);else if (typeof list === 'string') forEachString(list, iterator, context);else forEachObject(list, iterator, context);
      }

      function forEachArray(array, iterator, context) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array);
          }
        }
      }

      function forEachString(string, iterator, context) {
        for (var i = 0, len = string.length; i < len; i++) {
          // no such thing as a sparse string.
          iterator.call(context, string.charAt(i), i, string);
        }
      }

      function forEachObject(object, iterator, context) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object);
          }
        }
      }
    }, { "is-function": 9 }], 8: [function (require, module, exports) {
      (function (global) {
        var win;

        if (typeof window !== "undefined") {
          win = window;
        } else if (typeof global !== "undefined") {
          win = global;
        } else if (typeof self !== "undefined") {
          win = self;
        } else {
          win = {};
        }

        module.exports = win;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 9: [function (require, module, exports) {
      module.exports = isFunction;

      var toString = Object.prototype.toString;

      function isFunction(fn) {
        var string = toString.call(fn);
        return string === '[object Function]' || typeof fn === 'function' && string !== '[object RegExp]' || typeof window !== 'undefined' && (
        // IE8 and below
        fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt);
      };
    }, {}], 10: [function (require, module, exports) {
      module.exports = {
        "application/1d-interleaved-parityfec": {
          "source": "iana"
        },
        "application/3gpdash-qoe-report+xml": {
          "source": "iana"
        },
        "application/3gpp-ims+xml": {
          "source": "iana"
        },
        "application/a2l": {
          "source": "iana"
        },
        "application/activemessage": {
          "source": "iana"
        },
        "application/alto-costmap+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-costmapfilter+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-directory+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-endpointcost+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-endpointcostparams+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-endpointprop+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-endpointpropparams+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-error+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-networkmap+json": {
          "source": "iana",
          "compressible": true
        },
        "application/alto-networkmapfilter+json": {
          "source": "iana",
          "compressible": true
        },
        "application/aml": {
          "source": "iana"
        },
        "application/andrew-inset": {
          "source": "iana",
          "extensions": ["ez"]
        },
        "application/applefile": {
          "source": "iana"
        },
        "application/applixware": {
          "source": "apache",
          "extensions": ["aw"]
        },
        "application/atf": {
          "source": "iana"
        },
        "application/atfx": {
          "source": "iana"
        },
        "application/atom+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["atom"]
        },
        "application/atomcat+xml": {
          "source": "iana",
          "extensions": ["atomcat"]
        },
        "application/atomdeleted+xml": {
          "source": "iana"
        },
        "application/atomicmail": {
          "source": "iana"
        },
        "application/atomsvc+xml": {
          "source": "iana",
          "extensions": ["atomsvc"]
        },
        "application/atxml": {
          "source": "iana"
        },
        "application/auth-policy+xml": {
          "source": "iana"
        },
        "application/bacnet-xdd+zip": {
          "source": "iana"
        },
        "application/batch-smtp": {
          "source": "iana"
        },
        "application/bdoc": {
          "compressible": false,
          "extensions": ["bdoc"]
        },
        "application/beep+xml": {
          "source": "iana"
        },
        "application/calendar+json": {
          "source": "iana",
          "compressible": true
        },
        "application/calendar+xml": {
          "source": "iana"
        },
        "application/call-completion": {
          "source": "iana"
        },
        "application/cals-1840": {
          "source": "iana"
        },
        "application/cbor": {
          "source": "iana"
        },
        "application/cccex": {
          "source": "iana"
        },
        "application/ccmp+xml": {
          "source": "iana"
        },
        "application/ccxml+xml": {
          "source": "iana",
          "extensions": ["ccxml"]
        },
        "application/cdfx+xml": {
          "source": "iana"
        },
        "application/cdmi-capability": {
          "source": "iana",
          "extensions": ["cdmia"]
        },
        "application/cdmi-container": {
          "source": "iana",
          "extensions": ["cdmic"]
        },
        "application/cdmi-domain": {
          "source": "iana",
          "extensions": ["cdmid"]
        },
        "application/cdmi-object": {
          "source": "iana",
          "extensions": ["cdmio"]
        },
        "application/cdmi-queue": {
          "source": "iana",
          "extensions": ["cdmiq"]
        },
        "application/cdni": {
          "source": "iana"
        },
        "application/cea": {
          "source": "iana"
        },
        "application/cea-2018+xml": {
          "source": "iana"
        },
        "application/cellml+xml": {
          "source": "iana"
        },
        "application/cfw": {
          "source": "iana"
        },
        "application/clue_info+xml": {
          "source": "iana"
        },
        "application/cms": {
          "source": "iana"
        },
        "application/cnrp+xml": {
          "source": "iana"
        },
        "application/coap-group+json": {
          "source": "iana",
          "compressible": true
        },
        "application/coap-payload": {
          "source": "iana"
        },
        "application/commonground": {
          "source": "iana"
        },
        "application/conference-info+xml": {
          "source": "iana"
        },
        "application/cose": {
          "source": "iana"
        },
        "application/cose-key": {
          "source": "iana"
        },
        "application/cose-key-set": {
          "source": "iana"
        },
        "application/cpl+xml": {
          "source": "iana"
        },
        "application/csrattrs": {
          "source": "iana"
        },
        "application/csta+xml": {
          "source": "iana"
        },
        "application/cstadata+xml": {
          "source": "iana"
        },
        "application/csvm+json": {
          "source": "iana",
          "compressible": true
        },
        "application/cu-seeme": {
          "source": "apache",
          "extensions": ["cu"]
        },
        "application/cybercash": {
          "source": "iana"
        },
        "application/dart": {
          "compressible": true
        },
        "application/dash+xml": {
          "source": "iana",
          "extensions": ["mpd"]
        },
        "application/dashdelta": {
          "source": "iana"
        },
        "application/davmount+xml": {
          "source": "iana",
          "extensions": ["davmount"]
        },
        "application/dca-rft": {
          "source": "iana"
        },
        "application/dcd": {
          "source": "iana"
        },
        "application/dec-dx": {
          "source": "iana"
        },
        "application/dialog-info+xml": {
          "source": "iana"
        },
        "application/dicom": {
          "source": "iana"
        },
        "application/dicom+json": {
          "source": "iana",
          "compressible": true
        },
        "application/dicom+xml": {
          "source": "iana"
        },
        "application/dii": {
          "source": "iana"
        },
        "application/dit": {
          "source": "iana"
        },
        "application/dns": {
          "source": "iana"
        },
        "application/docbook+xml": {
          "source": "apache",
          "extensions": ["dbk"]
        },
        "application/dskpp+xml": {
          "source": "iana"
        },
        "application/dssc+der": {
          "source": "iana",
          "extensions": ["dssc"]
        },
        "application/dssc+xml": {
          "source": "iana",
          "extensions": ["xdssc"]
        },
        "application/dvcs": {
          "source": "iana"
        },
        "application/ecmascript": {
          "source": "iana",
          "compressible": true,
          "extensions": ["ecma"]
        },
        "application/edi-consent": {
          "source": "iana"
        },
        "application/edi-x12": {
          "source": "iana",
          "compressible": false
        },
        "application/edifact": {
          "source": "iana",
          "compressible": false
        },
        "application/efi": {
          "source": "iana"
        },
        "application/emergencycalldata.comment+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.control+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.deviceinfo+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.ecall.msd": {
          "source": "iana"
        },
        "application/emergencycalldata.providerinfo+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.serviceinfo+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.subscriberinfo+xml": {
          "source": "iana"
        },
        "application/emergencycalldata.veds+xml": {
          "source": "iana"
        },
        "application/emma+xml": {
          "source": "iana",
          "extensions": ["emma"]
        },
        "application/emotionml+xml": {
          "source": "iana"
        },
        "application/encaprtp": {
          "source": "iana"
        },
        "application/epp+xml": {
          "source": "iana"
        },
        "application/epub+zip": {
          "source": "iana",
          "extensions": ["epub"]
        },
        "application/eshop": {
          "source": "iana"
        },
        "application/exi": {
          "source": "iana",
          "extensions": ["exi"]
        },
        "application/fastinfoset": {
          "source": "iana"
        },
        "application/fastsoap": {
          "source": "iana"
        },
        "application/fdt+xml": {
          "source": "iana"
        },
        "application/fido.trusted-apps+json": {
          "compressible": true
        },
        "application/fits": {
          "source": "iana"
        },
        "application/font-sfnt": {
          "source": "iana"
        },
        "application/font-tdpfr": {
          "source": "iana",
          "extensions": ["pfr"]
        },
        "application/font-woff": {
          "source": "iana",
          "compressible": false,
          "extensions": ["woff"]
        },
        "application/font-woff2": {
          "compressible": false,
          "extensions": ["woff2"]
        },
        "application/framework-attributes+xml": {
          "source": "iana"
        },
        "application/geo+json": {
          "source": "iana",
          "compressible": true,
          "extensions": ["geojson"]
        },
        "application/geo+json-seq": {
          "source": "iana"
        },
        "application/geoxacml+xml": {
          "source": "iana"
        },
        "application/gml+xml": {
          "source": "iana",
          "extensions": ["gml"]
        },
        "application/gpx+xml": {
          "source": "apache",
          "extensions": ["gpx"]
        },
        "application/gxf": {
          "source": "apache",
          "extensions": ["gxf"]
        },
        "application/gzip": {
          "source": "iana",
          "compressible": false,
          "extensions": ["gz"]
        },
        "application/h224": {
          "source": "iana"
        },
        "application/held+xml": {
          "source": "iana"
        },
        "application/http": {
          "source": "iana"
        },
        "application/hyperstudio": {
          "source": "iana",
          "extensions": ["stk"]
        },
        "application/ibe-key-request+xml": {
          "source": "iana"
        },
        "application/ibe-pkg-reply+xml": {
          "source": "iana"
        },
        "application/ibe-pp-data": {
          "source": "iana"
        },
        "application/iges": {
          "source": "iana"
        },
        "application/im-iscomposing+xml": {
          "source": "iana"
        },
        "application/index": {
          "source": "iana"
        },
        "application/index.cmd": {
          "source": "iana"
        },
        "application/index.obj": {
          "source": "iana"
        },
        "application/index.response": {
          "source": "iana"
        },
        "application/index.vnd": {
          "source": "iana"
        },
        "application/inkml+xml": {
          "source": "iana",
          "extensions": ["ink", "inkml"]
        },
        "application/iotp": {
          "source": "iana"
        },
        "application/ipfix": {
          "source": "iana",
          "extensions": ["ipfix"]
        },
        "application/ipp": {
          "source": "iana"
        },
        "application/isup": {
          "source": "iana"
        },
        "application/its+xml": {
          "source": "iana"
        },
        "application/java-archive": {
          "source": "apache",
          "compressible": false,
          "extensions": ["jar", "war", "ear"]
        },
        "application/java-serialized-object": {
          "source": "apache",
          "compressible": false,
          "extensions": ["ser"]
        },
        "application/java-vm": {
          "source": "apache",
          "compressible": false,
          "extensions": ["class"]
        },
        "application/javascript": {
          "source": "iana",
          "charset": "UTF-8",
          "compressible": true,
          "extensions": ["js", "mjs"]
        },
        "application/jf2feed+json": {
          "source": "iana",
          "compressible": true
        },
        "application/jose": {
          "source": "iana"
        },
        "application/jose+json": {
          "source": "iana",
          "compressible": true
        },
        "application/jrd+json": {
          "source": "iana",
          "compressible": true
        },
        "application/json": {
          "source": "iana",
          "charset": "UTF-8",
          "compressible": true,
          "extensions": ["json", "map"]
        },
        "application/json-patch+json": {
          "source": "iana",
          "compressible": true
        },
        "application/json-seq": {
          "source": "iana"
        },
        "application/json5": {
          "extensions": ["json5"]
        },
        "application/jsonml+json": {
          "source": "apache",
          "compressible": true,
          "extensions": ["jsonml"]
        },
        "application/jwk+json": {
          "source": "iana",
          "compressible": true
        },
        "application/jwk-set+json": {
          "source": "iana",
          "compressible": true
        },
        "application/jwt": {
          "source": "iana"
        },
        "application/kpml-request+xml": {
          "source": "iana"
        },
        "application/kpml-response+xml": {
          "source": "iana"
        },
        "application/ld+json": {
          "source": "iana",
          "compressible": true,
          "extensions": ["jsonld"]
        },
        "application/lgr+xml": {
          "source": "iana"
        },
        "application/link-format": {
          "source": "iana"
        },
        "application/load-control+xml": {
          "source": "iana"
        },
        "application/lost+xml": {
          "source": "iana",
          "extensions": ["lostxml"]
        },
        "application/lostsync+xml": {
          "source": "iana"
        },
        "application/lxf": {
          "source": "iana"
        },
        "application/mac-binhex40": {
          "source": "iana",
          "extensions": ["hqx"]
        },
        "application/mac-compactpro": {
          "source": "apache",
          "extensions": ["cpt"]
        },
        "application/macwriteii": {
          "source": "iana"
        },
        "application/mads+xml": {
          "source": "iana",
          "extensions": ["mads"]
        },
        "application/manifest+json": {
          "charset": "UTF-8",
          "compressible": true,
          "extensions": ["webmanifest"]
        },
        "application/marc": {
          "source": "iana",
          "extensions": ["mrc"]
        },
        "application/marcxml+xml": {
          "source": "iana",
          "extensions": ["mrcx"]
        },
        "application/mathematica": {
          "source": "iana",
          "extensions": ["ma", "nb", "mb"]
        },
        "application/mathml+xml": {
          "source": "iana",
          "extensions": ["mathml"]
        },
        "application/mathml-content+xml": {
          "source": "iana"
        },
        "application/mathml-presentation+xml": {
          "source": "iana"
        },
        "application/mbms-associated-procedure-description+xml": {
          "source": "iana"
        },
        "application/mbms-deregister+xml": {
          "source": "iana"
        },
        "application/mbms-envelope+xml": {
          "source": "iana"
        },
        "application/mbms-msk+xml": {
          "source": "iana"
        },
        "application/mbms-msk-response+xml": {
          "source": "iana"
        },
        "application/mbms-protection-description+xml": {
          "source": "iana"
        },
        "application/mbms-reception-report+xml": {
          "source": "iana"
        },
        "application/mbms-register+xml": {
          "source": "iana"
        },
        "application/mbms-register-response+xml": {
          "source": "iana"
        },
        "application/mbms-schedule+xml": {
          "source": "iana"
        },
        "application/mbms-user-service-description+xml": {
          "source": "iana"
        },
        "application/mbox": {
          "source": "iana",
          "extensions": ["mbox"]
        },
        "application/media-policy-dataset+xml": {
          "source": "iana"
        },
        "application/media_control+xml": {
          "source": "iana"
        },
        "application/mediaservercontrol+xml": {
          "source": "iana",
          "extensions": ["mscml"]
        },
        "application/merge-patch+json": {
          "source": "iana",
          "compressible": true
        },
        "application/metalink+xml": {
          "source": "apache",
          "extensions": ["metalink"]
        },
        "application/metalink4+xml": {
          "source": "iana",
          "extensions": ["meta4"]
        },
        "application/mets+xml": {
          "source": "iana",
          "extensions": ["mets"]
        },
        "application/mf4": {
          "source": "iana"
        },
        "application/mikey": {
          "source": "iana"
        },
        "application/mmt-usd+xml": {
          "source": "iana"
        },
        "application/mods+xml": {
          "source": "iana",
          "extensions": ["mods"]
        },
        "application/moss-keys": {
          "source": "iana"
        },
        "application/moss-signature": {
          "source": "iana"
        },
        "application/mosskey-data": {
          "source": "iana"
        },
        "application/mosskey-request": {
          "source": "iana"
        },
        "application/mp21": {
          "source": "iana",
          "extensions": ["m21", "mp21"]
        },
        "application/mp4": {
          "source": "iana",
          "extensions": ["mp4s", "m4p"]
        },
        "application/mpeg4-generic": {
          "source": "iana"
        },
        "application/mpeg4-iod": {
          "source": "iana"
        },
        "application/mpeg4-iod-xmt": {
          "source": "iana"
        },
        "application/mrb-consumer+xml": {
          "source": "iana"
        },
        "application/mrb-publish+xml": {
          "source": "iana"
        },
        "application/msc-ivr+xml": {
          "source": "iana"
        },
        "application/msc-mixer+xml": {
          "source": "iana"
        },
        "application/msword": {
          "source": "iana",
          "compressible": false,
          "extensions": ["doc", "dot"]
        },
        "application/mud+json": {
          "source": "iana",
          "compressible": true
        },
        "application/mxf": {
          "source": "iana",
          "extensions": ["mxf"]
        },
        "application/n-quads": {
          "source": "iana"
        },
        "application/n-triples": {
          "source": "iana"
        },
        "application/nasdata": {
          "source": "iana"
        },
        "application/news-checkgroups": {
          "source": "iana"
        },
        "application/news-groupinfo": {
          "source": "iana"
        },
        "application/news-transmission": {
          "source": "iana"
        },
        "application/nlsml+xml": {
          "source": "iana"
        },
        "application/nss": {
          "source": "iana"
        },
        "application/ocsp-request": {
          "source": "iana"
        },
        "application/ocsp-response": {
          "source": "iana"
        },
        "application/octet-stream": {
          "source": "iana",
          "compressible": false,
          "extensions": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
        },
        "application/oda": {
          "source": "iana",
          "extensions": ["oda"]
        },
        "application/odx": {
          "source": "iana"
        },
        "application/oebps-package+xml": {
          "source": "iana",
          "extensions": ["opf"]
        },
        "application/ogg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["ogx"]
        },
        "application/omdoc+xml": {
          "source": "apache",
          "extensions": ["omdoc"]
        },
        "application/onenote": {
          "source": "apache",
          "extensions": ["onetoc", "onetoc2", "onetmp", "onepkg"]
        },
        "application/oxps": {
          "source": "iana",
          "extensions": ["oxps"]
        },
        "application/p2p-overlay+xml": {
          "source": "iana"
        },
        "application/parityfec": {
          "source": "iana"
        },
        "application/passport": {
          "source": "iana"
        },
        "application/patch-ops-error+xml": {
          "source": "iana",
          "extensions": ["xer"]
        },
        "application/pdf": {
          "source": "iana",
          "compressible": false,
          "extensions": ["pdf"]
        },
        "application/pdx": {
          "source": "iana"
        },
        "application/pgp-encrypted": {
          "source": "iana",
          "compressible": false,
          "extensions": ["pgp"]
        },
        "application/pgp-keys": {
          "source": "iana"
        },
        "application/pgp-signature": {
          "source": "iana",
          "extensions": ["asc", "sig"]
        },
        "application/pics-rules": {
          "source": "apache",
          "extensions": ["prf"]
        },
        "application/pidf+xml": {
          "source": "iana"
        },
        "application/pidf-diff+xml": {
          "source": "iana"
        },
        "application/pkcs10": {
          "source": "iana",
          "extensions": ["p10"]
        },
        "application/pkcs12": {
          "source": "iana"
        },
        "application/pkcs7-mime": {
          "source": "iana",
          "extensions": ["p7m", "p7c"]
        },
        "application/pkcs7-signature": {
          "source": "iana",
          "extensions": ["p7s"]
        },
        "application/pkcs8": {
          "source": "iana",
          "extensions": ["p8"]
        },
        "application/pkix-attr-cert": {
          "source": "iana",
          "extensions": ["ac"]
        },
        "application/pkix-cert": {
          "source": "iana",
          "extensions": ["cer"]
        },
        "application/pkix-crl": {
          "source": "iana",
          "extensions": ["crl"]
        },
        "application/pkix-pkipath": {
          "source": "iana",
          "extensions": ["pkipath"]
        },
        "application/pkixcmp": {
          "source": "iana",
          "extensions": ["pki"]
        },
        "application/pls+xml": {
          "source": "iana",
          "extensions": ["pls"]
        },
        "application/poc-settings+xml": {
          "source": "iana"
        },
        "application/postscript": {
          "source": "iana",
          "compressible": true,
          "extensions": ["ai", "eps", "ps"]
        },
        "application/ppsp-tracker+json": {
          "source": "iana",
          "compressible": true
        },
        "application/problem+json": {
          "source": "iana",
          "compressible": true
        },
        "application/problem+xml": {
          "source": "iana"
        },
        "application/provenance+xml": {
          "source": "iana"
        },
        "application/prs.alvestrand.titrax-sheet": {
          "source": "iana"
        },
        "application/prs.cww": {
          "source": "iana",
          "extensions": ["cww"]
        },
        "application/prs.hpub+zip": {
          "source": "iana"
        },
        "application/prs.nprend": {
          "source": "iana"
        },
        "application/prs.plucker": {
          "source": "iana"
        },
        "application/prs.rdf-xml-crypt": {
          "source": "iana"
        },
        "application/prs.xsf+xml": {
          "source": "iana"
        },
        "application/pskc+xml": {
          "source": "iana",
          "extensions": ["pskcxml"]
        },
        "application/qsig": {
          "source": "iana"
        },
        "application/raptorfec": {
          "source": "iana"
        },
        "application/rdap+json": {
          "source": "iana",
          "compressible": true
        },
        "application/rdf+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["rdf"]
        },
        "application/reginfo+xml": {
          "source": "iana",
          "extensions": ["rif"]
        },
        "application/relax-ng-compact-syntax": {
          "source": "iana",
          "extensions": ["rnc"]
        },
        "application/remote-printing": {
          "source": "iana"
        },
        "application/reputon+json": {
          "source": "iana",
          "compressible": true
        },
        "application/resource-lists+xml": {
          "source": "iana",
          "extensions": ["rl"]
        },
        "application/resource-lists-diff+xml": {
          "source": "iana",
          "extensions": ["rld"]
        },
        "application/rfc+xml": {
          "source": "iana"
        },
        "application/riscos": {
          "source": "iana"
        },
        "application/rlmi+xml": {
          "source": "iana"
        },
        "application/rls-services+xml": {
          "source": "iana",
          "extensions": ["rs"]
        },
        "application/route-apd+xml": {
          "source": "iana"
        },
        "application/route-s-tsid+xml": {
          "source": "iana"
        },
        "application/route-usd+xml": {
          "source": "iana"
        },
        "application/rpki-ghostbusters": {
          "source": "iana",
          "extensions": ["gbr"]
        },
        "application/rpki-manifest": {
          "source": "iana",
          "extensions": ["mft"]
        },
        "application/rpki-publication": {
          "source": "iana"
        },
        "application/rpki-roa": {
          "source": "iana",
          "extensions": ["roa"]
        },
        "application/rpki-updown": {
          "source": "iana"
        },
        "application/rsd+xml": {
          "source": "apache",
          "extensions": ["rsd"]
        },
        "application/rss+xml": {
          "source": "apache",
          "compressible": true,
          "extensions": ["rss"]
        },
        "application/rtf": {
          "source": "iana",
          "compressible": true,
          "extensions": ["rtf"]
        },
        "application/rtploopback": {
          "source": "iana"
        },
        "application/rtx": {
          "source": "iana"
        },
        "application/samlassertion+xml": {
          "source": "iana"
        },
        "application/samlmetadata+xml": {
          "source": "iana"
        },
        "application/sbml+xml": {
          "source": "iana",
          "extensions": ["sbml"]
        },
        "application/scaip+xml": {
          "source": "iana"
        },
        "application/scim+json": {
          "source": "iana",
          "compressible": true
        },
        "application/scvp-cv-request": {
          "source": "iana",
          "extensions": ["scq"]
        },
        "application/scvp-cv-response": {
          "source": "iana",
          "extensions": ["scs"]
        },
        "application/scvp-vp-request": {
          "source": "iana",
          "extensions": ["spq"]
        },
        "application/scvp-vp-response": {
          "source": "iana",
          "extensions": ["spp"]
        },
        "application/sdp": {
          "source": "iana",
          "extensions": ["sdp"]
        },
        "application/sep+xml": {
          "source": "iana"
        },
        "application/sep-exi": {
          "source": "iana"
        },
        "application/session-info": {
          "source": "iana"
        },
        "application/set-payment": {
          "source": "iana"
        },
        "application/set-payment-initiation": {
          "source": "iana",
          "extensions": ["setpay"]
        },
        "application/set-registration": {
          "source": "iana"
        },
        "application/set-registration-initiation": {
          "source": "iana",
          "extensions": ["setreg"]
        },
        "application/sgml": {
          "source": "iana"
        },
        "application/sgml-open-catalog": {
          "source": "iana"
        },
        "application/shf+xml": {
          "source": "iana",
          "extensions": ["shf"]
        },
        "application/sieve": {
          "source": "iana"
        },
        "application/simple-filter+xml": {
          "source": "iana"
        },
        "application/simple-message-summary": {
          "source": "iana"
        },
        "application/simplesymbolcontainer": {
          "source": "iana"
        },
        "application/slate": {
          "source": "iana"
        },
        "application/smil": {
          "source": "iana"
        },
        "application/smil+xml": {
          "source": "iana",
          "extensions": ["smi", "smil"]
        },
        "application/smpte336m": {
          "source": "iana"
        },
        "application/soap+fastinfoset": {
          "source": "iana"
        },
        "application/soap+xml": {
          "source": "iana",
          "compressible": true
        },
        "application/sparql-query": {
          "source": "iana",
          "extensions": ["rq"]
        },
        "application/sparql-results+xml": {
          "source": "iana",
          "extensions": ["srx"]
        },
        "application/spirits-event+xml": {
          "source": "iana"
        },
        "application/sql": {
          "source": "iana"
        },
        "application/srgs": {
          "source": "iana",
          "extensions": ["gram"]
        },
        "application/srgs+xml": {
          "source": "iana",
          "extensions": ["grxml"]
        },
        "application/sru+xml": {
          "source": "iana",
          "extensions": ["sru"]
        },
        "application/ssdl+xml": {
          "source": "apache",
          "extensions": ["ssdl"]
        },
        "application/ssml+xml": {
          "source": "iana",
          "extensions": ["ssml"]
        },
        "application/tamp-apex-update": {
          "source": "iana"
        },
        "application/tamp-apex-update-confirm": {
          "source": "iana"
        },
        "application/tamp-community-update": {
          "source": "iana"
        },
        "application/tamp-community-update-confirm": {
          "source": "iana"
        },
        "application/tamp-error": {
          "source": "iana"
        },
        "application/tamp-sequence-adjust": {
          "source": "iana"
        },
        "application/tamp-sequence-adjust-confirm": {
          "source": "iana"
        },
        "application/tamp-status-query": {
          "source": "iana"
        },
        "application/tamp-status-response": {
          "source": "iana"
        },
        "application/tamp-update": {
          "source": "iana"
        },
        "application/tamp-update-confirm": {
          "source": "iana"
        },
        "application/tar": {
          "compressible": true
        },
        "application/tei+xml": {
          "source": "iana",
          "extensions": ["tei", "teicorpus"]
        },
        "application/thraud+xml": {
          "source": "iana",
          "extensions": ["tfi"]
        },
        "application/timestamp-query": {
          "source": "iana"
        },
        "application/timestamp-reply": {
          "source": "iana"
        },
        "application/timestamped-data": {
          "source": "iana",
          "extensions": ["tsd"]
        },
        "application/trig": {
          "source": "iana"
        },
        "application/ttml+xml": {
          "source": "iana"
        },
        "application/tve-trigger": {
          "source": "iana"
        },
        "application/ulpfec": {
          "source": "iana"
        },
        "application/urc-grpsheet+xml": {
          "source": "iana"
        },
        "application/urc-ressheet+xml": {
          "source": "iana"
        },
        "application/urc-targetdesc+xml": {
          "source": "iana"
        },
        "application/urc-uisocketdesc+xml": {
          "source": "iana"
        },
        "application/vcard+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vcard+xml": {
          "source": "iana"
        },
        "application/vemmi": {
          "source": "iana"
        },
        "application/vividence.scriptfile": {
          "source": "apache"
        },
        "application/vnd.1000minds.decision-model+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp-prose+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp-prose-pc3ch+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.access-transfer-events+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.bsf+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.gmop+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.mcptt-info+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.mid-call+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.pic-bw-large": {
          "source": "iana",
          "extensions": ["plb"]
        },
        "application/vnd.3gpp.pic-bw-small": {
          "source": "iana",
          "extensions": ["psb"]
        },
        "application/vnd.3gpp.pic-bw-var": {
          "source": "iana",
          "extensions": ["pvb"]
        },
        "application/vnd.3gpp.sms": {
          "source": "iana"
        },
        "application/vnd.3gpp.sms+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.srvcc-ext+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.srvcc-info+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.state-and-event-info+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp.ussd+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp2.bcmcsinfo+xml": {
          "source": "iana"
        },
        "application/vnd.3gpp2.sms": {
          "source": "iana"
        },
        "application/vnd.3gpp2.tcap": {
          "source": "iana",
          "extensions": ["tcap"]
        },
        "application/vnd.3lightssoftware.imagescal": {
          "source": "iana"
        },
        "application/vnd.3m.post-it-notes": {
          "source": "iana",
          "extensions": ["pwn"]
        },
        "application/vnd.accpac.simply.aso": {
          "source": "iana",
          "extensions": ["aso"]
        },
        "application/vnd.accpac.simply.imp": {
          "source": "iana",
          "extensions": ["imp"]
        },
        "application/vnd.acucobol": {
          "source": "iana",
          "extensions": ["acu"]
        },
        "application/vnd.acucorp": {
          "source": "iana",
          "extensions": ["atc", "acutc"]
        },
        "application/vnd.adobe.air-application-installer-package+zip": {
          "source": "apache",
          "extensions": ["air"]
        },
        "application/vnd.adobe.flash.movie": {
          "source": "iana"
        },
        "application/vnd.adobe.formscentral.fcdt": {
          "source": "iana",
          "extensions": ["fcdt"]
        },
        "application/vnd.adobe.fxp": {
          "source": "iana",
          "extensions": ["fxp", "fxpl"]
        },
        "application/vnd.adobe.partial-upload": {
          "source": "iana"
        },
        "application/vnd.adobe.xdp+xml": {
          "source": "iana",
          "extensions": ["xdp"]
        },
        "application/vnd.adobe.xfdf": {
          "source": "iana",
          "extensions": ["xfdf"]
        },
        "application/vnd.aether.imp": {
          "source": "iana"
        },
        "application/vnd.ah-barcode": {
          "source": "iana"
        },
        "application/vnd.ahead.space": {
          "source": "iana",
          "extensions": ["ahead"]
        },
        "application/vnd.airzip.filesecure.azf": {
          "source": "iana",
          "extensions": ["azf"]
        },
        "application/vnd.airzip.filesecure.azs": {
          "source": "iana",
          "extensions": ["azs"]
        },
        "application/vnd.amazon.ebook": {
          "source": "apache",
          "extensions": ["azw"]
        },
        "application/vnd.amazon.mobi8-ebook": {
          "source": "iana"
        },
        "application/vnd.americandynamics.acc": {
          "source": "iana",
          "extensions": ["acc"]
        },
        "application/vnd.amiga.ami": {
          "source": "iana",
          "extensions": ["ami"]
        },
        "application/vnd.amundsen.maze+xml": {
          "source": "iana"
        },
        "application/vnd.android.package-archive": {
          "source": "apache",
          "compressible": false,
          "extensions": ["apk"]
        },
        "application/vnd.anki": {
          "source": "iana"
        },
        "application/vnd.anser-web-certificate-issue-initiation": {
          "source": "iana",
          "extensions": ["cii"]
        },
        "application/vnd.anser-web-funds-transfer-initiation": {
          "source": "apache",
          "extensions": ["fti"]
        },
        "application/vnd.antix.game-component": {
          "source": "iana",
          "extensions": ["atx"]
        },
        "application/vnd.apache.thrift.binary": {
          "source": "iana"
        },
        "application/vnd.apache.thrift.compact": {
          "source": "iana"
        },
        "application/vnd.apache.thrift.json": {
          "source": "iana"
        },
        "application/vnd.api+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.apothekende.reservation+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.apple.installer+xml": {
          "source": "iana",
          "extensions": ["mpkg"]
        },
        "application/vnd.apple.mpegurl": {
          "source": "iana",
          "extensions": ["m3u8"]
        },
        "application/vnd.apple.pkpass": {
          "compressible": false,
          "extensions": ["pkpass"]
        },
        "application/vnd.arastra.swi": {
          "source": "iana"
        },
        "application/vnd.aristanetworks.swi": {
          "source": "iana",
          "extensions": ["swi"]
        },
        "application/vnd.artsquare": {
          "source": "iana"
        },
        "application/vnd.astraea-software.iota": {
          "source": "iana",
          "extensions": ["iota"]
        },
        "application/vnd.audiograph": {
          "source": "iana",
          "extensions": ["aep"]
        },
        "application/vnd.autopackage": {
          "source": "iana"
        },
        "application/vnd.avistar+xml": {
          "source": "iana"
        },
        "application/vnd.balsamiq.bmml+xml": {
          "source": "iana"
        },
        "application/vnd.balsamiq.bmpr": {
          "source": "iana"
        },
        "application/vnd.bekitzur-stech+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.bint.med-content": {
          "source": "iana"
        },
        "application/vnd.biopax.rdf+xml": {
          "source": "iana"
        },
        "application/vnd.blink-idb-value-wrapper": {
          "source": "iana"
        },
        "application/vnd.blueice.multipass": {
          "source": "iana",
          "extensions": ["mpm"]
        },
        "application/vnd.bluetooth.ep.oob": {
          "source": "iana"
        },
        "application/vnd.bluetooth.le.oob": {
          "source": "iana"
        },
        "application/vnd.bmi": {
          "source": "iana",
          "extensions": ["bmi"]
        },
        "application/vnd.businessobjects": {
          "source": "iana",
          "extensions": ["rep"]
        },
        "application/vnd.cab-jscript": {
          "source": "iana"
        },
        "application/vnd.canon-cpdl": {
          "source": "iana"
        },
        "application/vnd.canon-lips": {
          "source": "iana"
        },
        "application/vnd.capasystems-pg+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.cendio.thinlinc.clientconf": {
          "source": "iana"
        },
        "application/vnd.century-systems.tcp_stream": {
          "source": "iana"
        },
        "application/vnd.chemdraw+xml": {
          "source": "iana",
          "extensions": ["cdxml"]
        },
        "application/vnd.chess-pgn": {
          "source": "iana"
        },
        "application/vnd.chipnuts.karaoke-mmd": {
          "source": "iana",
          "extensions": ["mmd"]
        },
        "application/vnd.cinderella": {
          "source": "iana",
          "extensions": ["cdy"]
        },
        "application/vnd.cirpack.isdn-ext": {
          "source": "iana"
        },
        "application/vnd.citationstyles.style+xml": {
          "source": "iana"
        },
        "application/vnd.claymore": {
          "source": "iana",
          "extensions": ["cla"]
        },
        "application/vnd.cloanto.rp9": {
          "source": "iana",
          "extensions": ["rp9"]
        },
        "application/vnd.clonk.c4group": {
          "source": "iana",
          "extensions": ["c4g", "c4d", "c4f", "c4p", "c4u"]
        },
        "application/vnd.cluetrust.cartomobile-config": {
          "source": "iana",
          "extensions": ["c11amc"]
        },
        "application/vnd.cluetrust.cartomobile-config-pkg": {
          "source": "iana",
          "extensions": ["c11amz"]
        },
        "application/vnd.coffeescript": {
          "source": "iana"
        },
        "application/vnd.collection+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.collection.doc+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.collection.next+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.comicbook+zip": {
          "source": "iana"
        },
        "application/vnd.commerce-battelle": {
          "source": "iana"
        },
        "application/vnd.commonspace": {
          "source": "iana",
          "extensions": ["csp"]
        },
        "application/vnd.contact.cmsg": {
          "source": "iana",
          "extensions": ["cdbcmsg"]
        },
        "application/vnd.coreos.ignition+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.cosmocaller": {
          "source": "iana",
          "extensions": ["cmc"]
        },
        "application/vnd.crick.clicker": {
          "source": "iana",
          "extensions": ["clkx"]
        },
        "application/vnd.crick.clicker.keyboard": {
          "source": "iana",
          "extensions": ["clkk"]
        },
        "application/vnd.crick.clicker.palette": {
          "source": "iana",
          "extensions": ["clkp"]
        },
        "application/vnd.crick.clicker.template": {
          "source": "iana",
          "extensions": ["clkt"]
        },
        "application/vnd.crick.clicker.wordbank": {
          "source": "iana",
          "extensions": ["clkw"]
        },
        "application/vnd.criticaltools.wbs+xml": {
          "source": "iana",
          "extensions": ["wbs"]
        },
        "application/vnd.ctc-posml": {
          "source": "iana",
          "extensions": ["pml"]
        },
        "application/vnd.ctct.ws+xml": {
          "source": "iana"
        },
        "application/vnd.cups-pdf": {
          "source": "iana"
        },
        "application/vnd.cups-postscript": {
          "source": "iana"
        },
        "application/vnd.cups-ppd": {
          "source": "iana",
          "extensions": ["ppd"]
        },
        "application/vnd.cups-raster": {
          "source": "iana"
        },
        "application/vnd.cups-raw": {
          "source": "iana"
        },
        "application/vnd.curl": {
          "source": "iana"
        },
        "application/vnd.curl.car": {
          "source": "apache",
          "extensions": ["car"]
        },
        "application/vnd.curl.pcurl": {
          "source": "apache",
          "extensions": ["pcurl"]
        },
        "application/vnd.cyan.dean.root+xml": {
          "source": "iana"
        },
        "application/vnd.cybank": {
          "source": "iana"
        },
        "application/vnd.d2l.coursepackage1p0+zip": {
          "source": "iana"
        },
        "application/vnd.dart": {
          "source": "iana",
          "compressible": true,
          "extensions": ["dart"]
        },
        "application/vnd.data-vision.rdz": {
          "source": "iana",
          "extensions": ["rdz"]
        },
        "application/vnd.datapackage+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.dataresource+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.debian.binary-package": {
          "source": "iana"
        },
        "application/vnd.dece.data": {
          "source": "iana",
          "extensions": ["uvf", "uvvf", "uvd", "uvvd"]
        },
        "application/vnd.dece.ttml+xml": {
          "source": "iana",
          "extensions": ["uvt", "uvvt"]
        },
        "application/vnd.dece.unspecified": {
          "source": "iana",
          "extensions": ["uvx", "uvvx"]
        },
        "application/vnd.dece.zip": {
          "source": "iana",
          "extensions": ["uvz", "uvvz"]
        },
        "application/vnd.denovo.fcselayout-link": {
          "source": "iana",
          "extensions": ["fe_launch"]
        },
        "application/vnd.desmume-movie": {
          "source": "iana"
        },
        "application/vnd.desmume.movie": {
          "source": "apache"
        },
        "application/vnd.dir-bi.plate-dl-nosuffix": {
          "source": "iana"
        },
        "application/vnd.dm.delegation+xml": {
          "source": "iana"
        },
        "application/vnd.dna": {
          "source": "iana",
          "extensions": ["dna"]
        },
        "application/vnd.document+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.dolby.mlp": {
          "source": "apache",
          "extensions": ["mlp"]
        },
        "application/vnd.dolby.mobile.1": {
          "source": "iana"
        },
        "application/vnd.dolby.mobile.2": {
          "source": "iana"
        },
        "application/vnd.doremir.scorecloud-binary-document": {
          "source": "iana"
        },
        "application/vnd.dpgraph": {
          "source": "iana",
          "extensions": ["dpg"]
        },
        "application/vnd.dreamfactory": {
          "source": "iana",
          "extensions": ["dfac"]
        },
        "application/vnd.drive+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ds-keypoint": {
          "source": "apache",
          "extensions": ["kpxx"]
        },
        "application/vnd.dtg.local": {
          "source": "iana"
        },
        "application/vnd.dtg.local.flash": {
          "source": "iana"
        },
        "application/vnd.dtg.local.html": {
          "source": "iana"
        },
        "application/vnd.dvb.ait": {
          "source": "iana",
          "extensions": ["ait"]
        },
        "application/vnd.dvb.dvbj": {
          "source": "iana"
        },
        "application/vnd.dvb.esgcontainer": {
          "source": "iana"
        },
        "application/vnd.dvb.ipdcdftnotifaccess": {
          "source": "iana"
        },
        "application/vnd.dvb.ipdcesgaccess": {
          "source": "iana"
        },
        "application/vnd.dvb.ipdcesgaccess2": {
          "source": "iana"
        },
        "application/vnd.dvb.ipdcesgpdd": {
          "source": "iana"
        },
        "application/vnd.dvb.ipdcroaming": {
          "source": "iana"
        },
        "application/vnd.dvb.iptv.alfec-base": {
          "source": "iana"
        },
        "application/vnd.dvb.iptv.alfec-enhancement": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-aggregate-root+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-container+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-generic+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-ia-msglist+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-ia-registration-request+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-ia-registration-response+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.notif-init+xml": {
          "source": "iana"
        },
        "application/vnd.dvb.pfr": {
          "source": "iana"
        },
        "application/vnd.dvb.service": {
          "source": "iana",
          "extensions": ["svc"]
        },
        "application/vnd.dxr": {
          "source": "iana"
        },
        "application/vnd.dynageo": {
          "source": "iana",
          "extensions": ["geo"]
        },
        "application/vnd.dzr": {
          "source": "iana"
        },
        "application/vnd.easykaraoke.cdgdownload": {
          "source": "iana"
        },
        "application/vnd.ecdis-update": {
          "source": "iana"
        },
        "application/vnd.ecowin.chart": {
          "source": "iana",
          "extensions": ["mag"]
        },
        "application/vnd.ecowin.filerequest": {
          "source": "iana"
        },
        "application/vnd.ecowin.fileupdate": {
          "source": "iana"
        },
        "application/vnd.ecowin.series": {
          "source": "iana"
        },
        "application/vnd.ecowin.seriesrequest": {
          "source": "iana"
        },
        "application/vnd.ecowin.seriesupdate": {
          "source": "iana"
        },
        "application/vnd.efi.img": {
          "source": "iana"
        },
        "application/vnd.efi.iso": {
          "source": "iana"
        },
        "application/vnd.emclient.accessrequest+xml": {
          "source": "iana"
        },
        "application/vnd.enliven": {
          "source": "iana",
          "extensions": ["nml"]
        },
        "application/vnd.enphase.envoy": {
          "source": "iana"
        },
        "application/vnd.eprints.data+xml": {
          "source": "iana"
        },
        "application/vnd.epson.esf": {
          "source": "iana",
          "extensions": ["esf"]
        },
        "application/vnd.epson.msf": {
          "source": "iana",
          "extensions": ["msf"]
        },
        "application/vnd.epson.quickanime": {
          "source": "iana",
          "extensions": ["qam"]
        },
        "application/vnd.epson.salt": {
          "source": "iana",
          "extensions": ["slt"]
        },
        "application/vnd.epson.ssf": {
          "source": "iana",
          "extensions": ["ssf"]
        },
        "application/vnd.ericsson.quickcall": {
          "source": "iana"
        },
        "application/vnd.espass-espass+zip": {
          "source": "iana"
        },
        "application/vnd.eszigno3+xml": {
          "source": "iana",
          "extensions": ["es3", "et3"]
        },
        "application/vnd.etsi.aoc+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.asic-e+zip": {
          "source": "iana"
        },
        "application/vnd.etsi.asic-s+zip": {
          "source": "iana"
        },
        "application/vnd.etsi.cug+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvcommand+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvdiscovery+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvprofile+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvsad-bc+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvsad-cod+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvsad-npvr+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvservice+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvsync+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.iptvueprofile+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.mcid+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.mheg5": {
          "source": "iana"
        },
        "application/vnd.etsi.overload-control-policy-dataset+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.pstn+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.sci+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.simservs+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.timestamp-token": {
          "source": "iana"
        },
        "application/vnd.etsi.tsl+xml": {
          "source": "iana"
        },
        "application/vnd.etsi.tsl.der": {
          "source": "iana"
        },
        "application/vnd.eudora.data": {
          "source": "iana"
        },
        "application/vnd.evolv.ecig.profile": {
          "source": "iana"
        },
        "application/vnd.evolv.ecig.settings": {
          "source": "iana"
        },
        "application/vnd.evolv.ecig.theme": {
          "source": "iana"
        },
        "application/vnd.ezpix-album": {
          "source": "iana",
          "extensions": ["ez2"]
        },
        "application/vnd.ezpix-package": {
          "source": "iana",
          "extensions": ["ez3"]
        },
        "application/vnd.f-secure.mobile": {
          "source": "iana"
        },
        "application/vnd.fastcopy-disk-image": {
          "source": "iana"
        },
        "application/vnd.fdf": {
          "source": "iana",
          "extensions": ["fdf"]
        },
        "application/vnd.fdsn.mseed": {
          "source": "iana",
          "extensions": ["mseed"]
        },
        "application/vnd.fdsn.seed": {
          "source": "iana",
          "extensions": ["seed", "dataless"]
        },
        "application/vnd.ffsns": {
          "source": "iana"
        },
        "application/vnd.filmit.zfc": {
          "source": "iana"
        },
        "application/vnd.fints": {
          "source": "iana"
        },
        "application/vnd.firemonkeys.cloudcell": {
          "source": "iana"
        },
        "application/vnd.flographit": {
          "source": "iana",
          "extensions": ["gph"]
        },
        "application/vnd.fluxtime.clip": {
          "source": "iana",
          "extensions": ["ftc"]
        },
        "application/vnd.font-fontforge-sfd": {
          "source": "iana"
        },
        "application/vnd.framemaker": {
          "source": "iana",
          "extensions": ["fm", "frame", "maker", "book"]
        },
        "application/vnd.frogans.fnc": {
          "source": "iana",
          "extensions": ["fnc"]
        },
        "application/vnd.frogans.ltf": {
          "source": "iana",
          "extensions": ["ltf"]
        },
        "application/vnd.fsc.weblaunch": {
          "source": "iana",
          "extensions": ["fsc"]
        },
        "application/vnd.fujitsu.oasys": {
          "source": "iana",
          "extensions": ["oas"]
        },
        "application/vnd.fujitsu.oasys2": {
          "source": "iana",
          "extensions": ["oa2"]
        },
        "application/vnd.fujitsu.oasys3": {
          "source": "iana",
          "extensions": ["oa3"]
        },
        "application/vnd.fujitsu.oasysgp": {
          "source": "iana",
          "extensions": ["fg5"]
        },
        "application/vnd.fujitsu.oasysprs": {
          "source": "iana",
          "extensions": ["bh2"]
        },
        "application/vnd.fujixerox.art-ex": {
          "source": "iana"
        },
        "application/vnd.fujixerox.art4": {
          "source": "iana"
        },
        "application/vnd.fujixerox.ddd": {
          "source": "iana",
          "extensions": ["ddd"]
        },
        "application/vnd.fujixerox.docuworks": {
          "source": "iana",
          "extensions": ["xdw"]
        },
        "application/vnd.fujixerox.docuworks.binder": {
          "source": "iana",
          "extensions": ["xbd"]
        },
        "application/vnd.fujixerox.docuworks.container": {
          "source": "iana"
        },
        "application/vnd.fujixerox.hbpl": {
          "source": "iana"
        },
        "application/vnd.fut-misnet": {
          "source": "iana"
        },
        "application/vnd.fuzzysheet": {
          "source": "iana",
          "extensions": ["fzs"]
        },
        "application/vnd.genomatix.tuxedo": {
          "source": "iana",
          "extensions": ["txd"]
        },
        "application/vnd.geo+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.geocube+xml": {
          "source": "iana"
        },
        "application/vnd.geogebra.file": {
          "source": "iana",
          "extensions": ["ggb"]
        },
        "application/vnd.geogebra.tool": {
          "source": "iana",
          "extensions": ["ggt"]
        },
        "application/vnd.geometry-explorer": {
          "source": "iana",
          "extensions": ["gex", "gre"]
        },
        "application/vnd.geonext": {
          "source": "iana",
          "extensions": ["gxt"]
        },
        "application/vnd.geoplan": {
          "source": "iana",
          "extensions": ["g2w"]
        },
        "application/vnd.geospace": {
          "source": "iana",
          "extensions": ["g3w"]
        },
        "application/vnd.gerber": {
          "source": "iana"
        },
        "application/vnd.globalplatform.card-content-mgt": {
          "source": "iana"
        },
        "application/vnd.globalplatform.card-content-mgt-response": {
          "source": "iana"
        },
        "application/vnd.gmx": {
          "source": "iana",
          "extensions": ["gmx"]
        },
        "application/vnd.google-apps.document": {
          "compressible": false,
          "extensions": ["gdoc"]
        },
        "application/vnd.google-apps.presentation": {
          "compressible": false,
          "extensions": ["gslides"]
        },
        "application/vnd.google-apps.spreadsheet": {
          "compressible": false,
          "extensions": ["gsheet"]
        },
        "application/vnd.google-earth.kml+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["kml"]
        },
        "application/vnd.google-earth.kmz": {
          "source": "iana",
          "compressible": false,
          "extensions": ["kmz"]
        },
        "application/vnd.gov.sk.e-form+xml": {
          "source": "iana"
        },
        "application/vnd.gov.sk.e-form+zip": {
          "source": "iana"
        },
        "application/vnd.gov.sk.xmldatacontainer+xml": {
          "source": "iana"
        },
        "application/vnd.grafeq": {
          "source": "iana",
          "extensions": ["gqf", "gqs"]
        },
        "application/vnd.gridmp": {
          "source": "iana"
        },
        "application/vnd.groove-account": {
          "source": "iana",
          "extensions": ["gac"]
        },
        "application/vnd.groove-help": {
          "source": "iana",
          "extensions": ["ghf"]
        },
        "application/vnd.groove-identity-message": {
          "source": "iana",
          "extensions": ["gim"]
        },
        "application/vnd.groove-injector": {
          "source": "iana",
          "extensions": ["grv"]
        },
        "application/vnd.groove-tool-message": {
          "source": "iana",
          "extensions": ["gtm"]
        },
        "application/vnd.groove-tool-template": {
          "source": "iana",
          "extensions": ["tpl"]
        },
        "application/vnd.groove-vcard": {
          "source": "iana",
          "extensions": ["vcg"]
        },
        "application/vnd.hal+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.hal+xml": {
          "source": "iana",
          "extensions": ["hal"]
        },
        "application/vnd.handheld-entertainment+xml": {
          "source": "iana",
          "extensions": ["zmm"]
        },
        "application/vnd.hbci": {
          "source": "iana",
          "extensions": ["hbci"]
        },
        "application/vnd.hc+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.hcl-bireports": {
          "source": "iana"
        },
        "application/vnd.hdt": {
          "source": "iana"
        },
        "application/vnd.heroku+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.hhe.lesson-player": {
          "source": "iana",
          "extensions": ["les"]
        },
        "application/vnd.hp-hpgl": {
          "source": "iana",
          "extensions": ["hpgl"]
        },
        "application/vnd.hp-hpid": {
          "source": "iana",
          "extensions": ["hpid"]
        },
        "application/vnd.hp-hps": {
          "source": "iana",
          "extensions": ["hps"]
        },
        "application/vnd.hp-jlyt": {
          "source": "iana",
          "extensions": ["jlt"]
        },
        "application/vnd.hp-pcl": {
          "source": "iana",
          "extensions": ["pcl"]
        },
        "application/vnd.hp-pclxl": {
          "source": "iana",
          "extensions": ["pclxl"]
        },
        "application/vnd.httphone": {
          "source": "iana"
        },
        "application/vnd.hydrostatix.sof-data": {
          "source": "iana",
          "extensions": ["sfd-hdstx"]
        },
        "application/vnd.hyper-item+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.hyperdrive+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.hzn-3d-crossword": {
          "source": "iana"
        },
        "application/vnd.ibm.afplinedata": {
          "source": "iana"
        },
        "application/vnd.ibm.electronic-media": {
          "source": "iana"
        },
        "application/vnd.ibm.minipay": {
          "source": "iana",
          "extensions": ["mpy"]
        },
        "application/vnd.ibm.modcap": {
          "source": "iana",
          "extensions": ["afp", "listafp", "list3820"]
        },
        "application/vnd.ibm.rights-management": {
          "source": "iana",
          "extensions": ["irm"]
        },
        "application/vnd.ibm.secure-container": {
          "source": "iana",
          "extensions": ["sc"]
        },
        "application/vnd.iccprofile": {
          "source": "iana",
          "extensions": ["icc", "icm"]
        },
        "application/vnd.ieee.1905": {
          "source": "iana"
        },
        "application/vnd.igloader": {
          "source": "iana",
          "extensions": ["igl"]
        },
        "application/vnd.imagemeter.folder+zip": {
          "source": "iana"
        },
        "application/vnd.imagemeter.image+zip": {
          "source": "iana"
        },
        "application/vnd.immervision-ivp": {
          "source": "iana",
          "extensions": ["ivp"]
        },
        "application/vnd.immervision-ivu": {
          "source": "iana",
          "extensions": ["ivu"]
        },
        "application/vnd.ims.imsccv1p1": {
          "source": "iana"
        },
        "application/vnd.ims.imsccv1p2": {
          "source": "iana"
        },
        "application/vnd.ims.imsccv1p3": {
          "source": "iana"
        },
        "application/vnd.ims.lis.v2.result+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ims.lti.v2.toolproxy+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ims.lti.v2.toolproxy.id+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ims.lti.v2.toolsettings+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.ims.lti.v2.toolsettings.simple+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.informedcontrol.rms+xml": {
          "source": "iana"
        },
        "application/vnd.informix-visionary": {
          "source": "iana"
        },
        "application/vnd.infotech.project": {
          "source": "iana"
        },
        "application/vnd.infotech.project+xml": {
          "source": "iana"
        },
        "application/vnd.innopath.wamp.notification": {
          "source": "iana"
        },
        "application/vnd.insors.igm": {
          "source": "iana",
          "extensions": ["igm"]
        },
        "application/vnd.intercon.formnet": {
          "source": "iana",
          "extensions": ["xpw", "xpx"]
        },
        "application/vnd.intergeo": {
          "source": "iana",
          "extensions": ["i2g"]
        },
        "application/vnd.intertrust.digibox": {
          "source": "iana"
        },
        "application/vnd.intertrust.nncp": {
          "source": "iana"
        },
        "application/vnd.intu.qbo": {
          "source": "iana",
          "extensions": ["qbo"]
        },
        "application/vnd.intu.qfx": {
          "source": "iana",
          "extensions": ["qfx"]
        },
        "application/vnd.iptc.g2.catalogitem+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.conceptitem+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.knowledgeitem+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.newsitem+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.newsmessage+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.packageitem+xml": {
          "source": "iana"
        },
        "application/vnd.iptc.g2.planningitem+xml": {
          "source": "iana"
        },
        "application/vnd.ipunplugged.rcprofile": {
          "source": "iana",
          "extensions": ["rcprofile"]
        },
        "application/vnd.irepository.package+xml": {
          "source": "iana",
          "extensions": ["irp"]
        },
        "application/vnd.is-xpr": {
          "source": "iana",
          "extensions": ["xpr"]
        },
        "application/vnd.isac.fcs": {
          "source": "iana",
          "extensions": ["fcs"]
        },
        "application/vnd.jam": {
          "source": "iana",
          "extensions": ["jam"]
        },
        "application/vnd.japannet-directory-service": {
          "source": "iana"
        },
        "application/vnd.japannet-jpnstore-wakeup": {
          "source": "iana"
        },
        "application/vnd.japannet-payment-wakeup": {
          "source": "iana"
        },
        "application/vnd.japannet-registration": {
          "source": "iana"
        },
        "application/vnd.japannet-registration-wakeup": {
          "source": "iana"
        },
        "application/vnd.japannet-setstore-wakeup": {
          "source": "iana"
        },
        "application/vnd.japannet-verification": {
          "source": "iana"
        },
        "application/vnd.japannet-verification-wakeup": {
          "source": "iana"
        },
        "application/vnd.jcp.javame.midlet-rms": {
          "source": "iana",
          "extensions": ["rms"]
        },
        "application/vnd.jisp": {
          "source": "iana",
          "extensions": ["jisp"]
        },
        "application/vnd.joost.joda-archive": {
          "source": "iana",
          "extensions": ["joda"]
        },
        "application/vnd.jsk.isdn-ngn": {
          "source": "iana"
        },
        "application/vnd.kahootz": {
          "source": "iana",
          "extensions": ["ktz", "ktr"]
        },
        "application/vnd.kde.karbon": {
          "source": "iana",
          "extensions": ["karbon"]
        },
        "application/vnd.kde.kchart": {
          "source": "iana",
          "extensions": ["chrt"]
        },
        "application/vnd.kde.kformula": {
          "source": "iana",
          "extensions": ["kfo"]
        },
        "application/vnd.kde.kivio": {
          "source": "iana",
          "extensions": ["flw"]
        },
        "application/vnd.kde.kontour": {
          "source": "iana",
          "extensions": ["kon"]
        },
        "application/vnd.kde.kpresenter": {
          "source": "iana",
          "extensions": ["kpr", "kpt"]
        },
        "application/vnd.kde.kspread": {
          "source": "iana",
          "extensions": ["ksp"]
        },
        "application/vnd.kde.kword": {
          "source": "iana",
          "extensions": ["kwd", "kwt"]
        },
        "application/vnd.kenameaapp": {
          "source": "iana",
          "extensions": ["htke"]
        },
        "application/vnd.kidspiration": {
          "source": "iana",
          "extensions": ["kia"]
        },
        "application/vnd.kinar": {
          "source": "iana",
          "extensions": ["kne", "knp"]
        },
        "application/vnd.koan": {
          "source": "iana",
          "extensions": ["skp", "skd", "skt", "skm"]
        },
        "application/vnd.kodak-descriptor": {
          "source": "iana",
          "extensions": ["sse"]
        },
        "application/vnd.las.las+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.las.las+xml": {
          "source": "iana",
          "extensions": ["lasxml"]
        },
        "application/vnd.liberty-request+xml": {
          "source": "iana"
        },
        "application/vnd.llamagraphics.life-balance.desktop": {
          "source": "iana",
          "extensions": ["lbd"]
        },
        "application/vnd.llamagraphics.life-balance.exchange+xml": {
          "source": "iana",
          "extensions": ["lbe"]
        },
        "application/vnd.lotus-1-2-3": {
          "source": "iana",
          "extensions": ["123"]
        },
        "application/vnd.lotus-approach": {
          "source": "iana",
          "extensions": ["apr"]
        },
        "application/vnd.lotus-freelance": {
          "source": "iana",
          "extensions": ["pre"]
        },
        "application/vnd.lotus-notes": {
          "source": "iana",
          "extensions": ["nsf"]
        },
        "application/vnd.lotus-organizer": {
          "source": "iana",
          "extensions": ["org"]
        },
        "application/vnd.lotus-screencam": {
          "source": "iana",
          "extensions": ["scm"]
        },
        "application/vnd.lotus-wordpro": {
          "source": "iana",
          "extensions": ["lwp"]
        },
        "application/vnd.macports.portpkg": {
          "source": "iana",
          "extensions": ["portpkg"]
        },
        "application/vnd.mapbox-vector-tile": {
          "source": "iana"
        },
        "application/vnd.marlin.drm.actiontoken+xml": {
          "source": "iana"
        },
        "application/vnd.marlin.drm.conftoken+xml": {
          "source": "iana"
        },
        "application/vnd.marlin.drm.license+xml": {
          "source": "iana"
        },
        "application/vnd.marlin.drm.mdcf": {
          "source": "iana"
        },
        "application/vnd.mason+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.maxmind.maxmind-db": {
          "source": "iana"
        },
        "application/vnd.mcd": {
          "source": "iana",
          "extensions": ["mcd"]
        },
        "application/vnd.medcalcdata": {
          "source": "iana",
          "extensions": ["mc1"]
        },
        "application/vnd.mediastation.cdkey": {
          "source": "iana",
          "extensions": ["cdkey"]
        },
        "application/vnd.meridian-slingshot": {
          "source": "iana"
        },
        "application/vnd.mfer": {
          "source": "iana",
          "extensions": ["mwf"]
        },
        "application/vnd.mfmp": {
          "source": "iana",
          "extensions": ["mfm"]
        },
        "application/vnd.micro+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.micrografx.flo": {
          "source": "iana",
          "extensions": ["flo"]
        },
        "application/vnd.micrografx.igx": {
          "source": "iana",
          "extensions": ["igx"]
        },
        "application/vnd.microsoft.portable-executable": {
          "source": "iana"
        },
        "application/vnd.microsoft.windows.thumbnail-cache": {
          "source": "iana"
        },
        "application/vnd.miele+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.mif": {
          "source": "iana",
          "extensions": ["mif"]
        },
        "application/vnd.minisoft-hp3000-save": {
          "source": "iana"
        },
        "application/vnd.mitsubishi.misty-guard.trustweb": {
          "source": "iana"
        },
        "application/vnd.mobius.daf": {
          "source": "iana",
          "extensions": ["daf"]
        },
        "application/vnd.mobius.dis": {
          "source": "iana",
          "extensions": ["dis"]
        },
        "application/vnd.mobius.mbk": {
          "source": "iana",
          "extensions": ["mbk"]
        },
        "application/vnd.mobius.mqy": {
          "source": "iana",
          "extensions": ["mqy"]
        },
        "application/vnd.mobius.msl": {
          "source": "iana",
          "extensions": ["msl"]
        },
        "application/vnd.mobius.plc": {
          "source": "iana",
          "extensions": ["plc"]
        },
        "application/vnd.mobius.txf": {
          "source": "iana",
          "extensions": ["txf"]
        },
        "application/vnd.mophun.application": {
          "source": "iana",
          "extensions": ["mpn"]
        },
        "application/vnd.mophun.certificate": {
          "source": "iana",
          "extensions": ["mpc"]
        },
        "application/vnd.motorola.flexsuite": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.adsi": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.fis": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.gotap": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.kmr": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.ttc": {
          "source": "iana"
        },
        "application/vnd.motorola.flexsuite.wem": {
          "source": "iana"
        },
        "application/vnd.motorola.iprm": {
          "source": "iana"
        },
        "application/vnd.mozilla.xul+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["xul"]
        },
        "application/vnd.ms-3mfdocument": {
          "source": "iana"
        },
        "application/vnd.ms-artgalry": {
          "source": "iana",
          "extensions": ["cil"]
        },
        "application/vnd.ms-asf": {
          "source": "iana"
        },
        "application/vnd.ms-cab-compressed": {
          "source": "iana",
          "extensions": ["cab"]
        },
        "application/vnd.ms-color.iccprofile": {
          "source": "apache"
        },
        "application/vnd.ms-excel": {
          "source": "iana",
          "compressible": false,
          "extensions": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
        },
        "application/vnd.ms-excel.addin.macroenabled.12": {
          "source": "iana",
          "extensions": ["xlam"]
        },
        "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
          "source": "iana",
          "extensions": ["xlsb"]
        },
        "application/vnd.ms-excel.sheet.macroenabled.12": {
          "source": "iana",
          "extensions": ["xlsm"]
        },
        "application/vnd.ms-excel.template.macroenabled.12": {
          "source": "iana",
          "extensions": ["xltm"]
        },
        "application/vnd.ms-fontobject": {
          "source": "iana",
          "compressible": true,
          "extensions": ["eot"]
        },
        "application/vnd.ms-htmlhelp": {
          "source": "iana",
          "extensions": ["chm"]
        },
        "application/vnd.ms-ims": {
          "source": "iana",
          "extensions": ["ims"]
        },
        "application/vnd.ms-lrm": {
          "source": "iana",
          "extensions": ["lrm"]
        },
        "application/vnd.ms-office.activex+xml": {
          "source": "iana"
        },
        "application/vnd.ms-officetheme": {
          "source": "iana",
          "extensions": ["thmx"]
        },
        "application/vnd.ms-opentype": {
          "source": "apache",
          "compressible": true
        },
        "application/vnd.ms-outlook": {
          "compressible": false,
          "extensions": ["msg"]
        },
        "application/vnd.ms-package.obfuscated-opentype": {
          "source": "apache"
        },
        "application/vnd.ms-pki.seccat": {
          "source": "apache",
          "extensions": ["cat"]
        },
        "application/vnd.ms-pki.stl": {
          "source": "apache",
          "extensions": ["stl"]
        },
        "application/vnd.ms-playready.initiator+xml": {
          "source": "iana"
        },
        "application/vnd.ms-powerpoint": {
          "source": "iana",
          "compressible": false,
          "extensions": ["ppt", "pps", "pot"]
        },
        "application/vnd.ms-powerpoint.addin.macroenabled.12": {
          "source": "iana",
          "extensions": ["ppam"]
        },
        "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
          "source": "iana",
          "extensions": ["pptm"]
        },
        "application/vnd.ms-powerpoint.slide.macroenabled.12": {
          "source": "iana",
          "extensions": ["sldm"]
        },
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
          "source": "iana",
          "extensions": ["ppsm"]
        },
        "application/vnd.ms-powerpoint.template.macroenabled.12": {
          "source": "iana",
          "extensions": ["potm"]
        },
        "application/vnd.ms-printdevicecapabilities+xml": {
          "source": "iana"
        },
        "application/vnd.ms-printing.printticket+xml": {
          "source": "apache"
        },
        "application/vnd.ms-printschematicket+xml": {
          "source": "iana"
        },
        "application/vnd.ms-project": {
          "source": "iana",
          "extensions": ["mpp", "mpt"]
        },
        "application/vnd.ms-tnef": {
          "source": "iana"
        },
        "application/vnd.ms-windows.devicepairing": {
          "source": "iana"
        },
        "application/vnd.ms-windows.nwprinting.oob": {
          "source": "iana"
        },
        "application/vnd.ms-windows.printerpairing": {
          "source": "iana"
        },
        "application/vnd.ms-windows.wsd.oob": {
          "source": "iana"
        },
        "application/vnd.ms-wmdrm.lic-chlg-req": {
          "source": "iana"
        },
        "application/vnd.ms-wmdrm.lic-resp": {
          "source": "iana"
        },
        "application/vnd.ms-wmdrm.meter-chlg-req": {
          "source": "iana"
        },
        "application/vnd.ms-wmdrm.meter-resp": {
          "source": "iana"
        },
        "application/vnd.ms-word.document.macroenabled.12": {
          "source": "iana",
          "extensions": ["docm"]
        },
        "application/vnd.ms-word.template.macroenabled.12": {
          "source": "iana",
          "extensions": ["dotm"]
        },
        "application/vnd.ms-works": {
          "source": "iana",
          "extensions": ["wps", "wks", "wcm", "wdb"]
        },
        "application/vnd.ms-wpl": {
          "source": "iana",
          "extensions": ["wpl"]
        },
        "application/vnd.ms-xpsdocument": {
          "source": "iana",
          "compressible": false,
          "extensions": ["xps"]
        },
        "application/vnd.msa-disk-image": {
          "source": "iana"
        },
        "application/vnd.mseq": {
          "source": "iana",
          "extensions": ["mseq"]
        },
        "application/vnd.msign": {
          "source": "iana"
        },
        "application/vnd.multiad.creator": {
          "source": "iana"
        },
        "application/vnd.multiad.creator.cif": {
          "source": "iana"
        },
        "application/vnd.music-niff": {
          "source": "iana"
        },
        "application/vnd.musician": {
          "source": "iana",
          "extensions": ["mus"]
        },
        "application/vnd.muvee.style": {
          "source": "iana",
          "extensions": ["msty"]
        },
        "application/vnd.mynfc": {
          "source": "iana",
          "extensions": ["taglet"]
        },
        "application/vnd.ncd.control": {
          "source": "iana"
        },
        "application/vnd.ncd.reference": {
          "source": "iana"
        },
        "application/vnd.nearst.inv+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.nervana": {
          "source": "iana"
        },
        "application/vnd.netfpx": {
          "source": "iana"
        },
        "application/vnd.neurolanguage.nlu": {
          "source": "iana",
          "extensions": ["nlu"]
        },
        "application/vnd.nintendo.nitro.rom": {
          "source": "iana"
        },
        "application/vnd.nintendo.snes.rom": {
          "source": "iana"
        },
        "application/vnd.nitf": {
          "source": "iana",
          "extensions": ["ntf", "nitf"]
        },
        "application/vnd.noblenet-directory": {
          "source": "iana",
          "extensions": ["nnd"]
        },
        "application/vnd.noblenet-sealer": {
          "source": "iana",
          "extensions": ["nns"]
        },
        "application/vnd.noblenet-web": {
          "source": "iana",
          "extensions": ["nnw"]
        },
        "application/vnd.nokia.catalogs": {
          "source": "iana"
        },
        "application/vnd.nokia.conml+wbxml": {
          "source": "iana"
        },
        "application/vnd.nokia.conml+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.iptv.config+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.isds-radio-presets": {
          "source": "iana"
        },
        "application/vnd.nokia.landmark+wbxml": {
          "source": "iana"
        },
        "application/vnd.nokia.landmark+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.landmarkcollection+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.n-gage.ac+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.n-gage.data": {
          "source": "iana",
          "extensions": ["ngdat"]
        },
        "application/vnd.nokia.n-gage.symbian.install": {
          "source": "iana",
          "extensions": ["n-gage"]
        },
        "application/vnd.nokia.ncd": {
          "source": "iana"
        },
        "application/vnd.nokia.pcd+wbxml": {
          "source": "iana"
        },
        "application/vnd.nokia.pcd+xml": {
          "source": "iana"
        },
        "application/vnd.nokia.radio-preset": {
          "source": "iana",
          "extensions": ["rpst"]
        },
        "application/vnd.nokia.radio-presets": {
          "source": "iana",
          "extensions": ["rpss"]
        },
        "application/vnd.novadigm.edm": {
          "source": "iana",
          "extensions": ["edm"]
        },
        "application/vnd.novadigm.edx": {
          "source": "iana",
          "extensions": ["edx"]
        },
        "application/vnd.novadigm.ext": {
          "source": "iana",
          "extensions": ["ext"]
        },
        "application/vnd.ntt-local.content-share": {
          "source": "iana"
        },
        "application/vnd.ntt-local.file-transfer": {
          "source": "iana"
        },
        "application/vnd.ntt-local.ogw_remote-access": {
          "source": "iana"
        },
        "application/vnd.ntt-local.sip-ta_remote": {
          "source": "iana"
        },
        "application/vnd.ntt-local.sip-ta_tcp_stream": {
          "source": "iana"
        },
        "application/vnd.oasis.opendocument.chart": {
          "source": "iana",
          "extensions": ["odc"]
        },
        "application/vnd.oasis.opendocument.chart-template": {
          "source": "iana",
          "extensions": ["otc"]
        },
        "application/vnd.oasis.opendocument.database": {
          "source": "iana",
          "extensions": ["odb"]
        },
        "application/vnd.oasis.opendocument.formula": {
          "source": "iana",
          "extensions": ["odf"]
        },
        "application/vnd.oasis.opendocument.formula-template": {
          "source": "iana",
          "extensions": ["odft"]
        },
        "application/vnd.oasis.opendocument.graphics": {
          "source": "iana",
          "compressible": false,
          "extensions": ["odg"]
        },
        "application/vnd.oasis.opendocument.graphics-template": {
          "source": "iana",
          "extensions": ["otg"]
        },
        "application/vnd.oasis.opendocument.image": {
          "source": "iana",
          "extensions": ["odi"]
        },
        "application/vnd.oasis.opendocument.image-template": {
          "source": "iana",
          "extensions": ["oti"]
        },
        "application/vnd.oasis.opendocument.presentation": {
          "source": "iana",
          "compressible": false,
          "extensions": ["odp"]
        },
        "application/vnd.oasis.opendocument.presentation-template": {
          "source": "iana",
          "extensions": ["otp"]
        },
        "application/vnd.oasis.opendocument.spreadsheet": {
          "source": "iana",
          "compressible": false,
          "extensions": ["ods"]
        },
        "application/vnd.oasis.opendocument.spreadsheet-template": {
          "source": "iana",
          "extensions": ["ots"]
        },
        "application/vnd.oasis.opendocument.text": {
          "source": "iana",
          "compressible": false,
          "extensions": ["odt"]
        },
        "application/vnd.oasis.opendocument.text-master": {
          "source": "iana",
          "extensions": ["odm"]
        },
        "application/vnd.oasis.opendocument.text-template": {
          "source": "iana",
          "extensions": ["ott"]
        },
        "application/vnd.oasis.opendocument.text-web": {
          "source": "iana",
          "extensions": ["oth"]
        },
        "application/vnd.obn": {
          "source": "iana"
        },
        "application/vnd.ocf+cbor": {
          "source": "iana"
        },
        "application/vnd.oftn.l10n+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.oipf.contentaccessdownload+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.contentaccessstreaming+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.cspg-hexbinary": {
          "source": "iana"
        },
        "application/vnd.oipf.dae.svg+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.dae.xhtml+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.mippvcontrolmessage+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.pae.gem": {
          "source": "iana"
        },
        "application/vnd.oipf.spdiscovery+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.spdlist+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.ueprofile+xml": {
          "source": "iana"
        },
        "application/vnd.oipf.userprofile+xml": {
          "source": "iana"
        },
        "application/vnd.olpc-sugar": {
          "source": "iana",
          "extensions": ["xo"]
        },
        "application/vnd.oma-scws-config": {
          "source": "iana"
        },
        "application/vnd.oma-scws-http-request": {
          "source": "iana"
        },
        "application/vnd.oma-scws-http-response": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.drm-trigger+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.imd+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.ltkm": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.notification+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.provisioningtrigger": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.sgboot": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.sgdd+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.sgdu": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.simple-symbol-container": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.smartcard-trigger+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.sprov+xml": {
          "source": "iana"
        },
        "application/vnd.oma.bcast.stkm": {
          "source": "iana"
        },
        "application/vnd.oma.cab-address-book+xml": {
          "source": "iana"
        },
        "application/vnd.oma.cab-feature-handler+xml": {
          "source": "iana"
        },
        "application/vnd.oma.cab-pcc+xml": {
          "source": "iana"
        },
        "application/vnd.oma.cab-subs-invite+xml": {
          "source": "iana"
        },
        "application/vnd.oma.cab-user-prefs+xml": {
          "source": "iana"
        },
        "application/vnd.oma.dcd": {
          "source": "iana"
        },
        "application/vnd.oma.dcdc": {
          "source": "iana"
        },
        "application/vnd.oma.dd2+xml": {
          "source": "iana",
          "extensions": ["dd2"]
        },
        "application/vnd.oma.drm.risd+xml": {
          "source": "iana"
        },
        "application/vnd.oma.group-usage-list+xml": {
          "source": "iana"
        },
        "application/vnd.oma.lwm2m+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.oma.lwm2m+tlv": {
          "source": "iana"
        },
        "application/vnd.oma.pal+xml": {
          "source": "iana"
        },
        "application/vnd.oma.poc.detailed-progress-report+xml": {
          "source": "iana"
        },
        "application/vnd.oma.poc.final-report+xml": {
          "source": "iana"
        },
        "application/vnd.oma.poc.groups+xml": {
          "source": "iana"
        },
        "application/vnd.oma.poc.invocation-descriptor+xml": {
          "source": "iana"
        },
        "application/vnd.oma.poc.optimized-progress-report+xml": {
          "source": "iana"
        },
        "application/vnd.oma.push": {
          "source": "iana"
        },
        "application/vnd.oma.scidm.messages+xml": {
          "source": "iana"
        },
        "application/vnd.oma.xcap-directory+xml": {
          "source": "iana"
        },
        "application/vnd.omads-email+xml": {
          "source": "iana"
        },
        "application/vnd.omads-file+xml": {
          "source": "iana"
        },
        "application/vnd.omads-folder+xml": {
          "source": "iana"
        },
        "application/vnd.omaloc-supl-init": {
          "source": "iana"
        },
        "application/vnd.onepager": {
          "source": "iana"
        },
        "application/vnd.onepagertamp": {
          "source": "iana"
        },
        "application/vnd.onepagertamx": {
          "source": "iana"
        },
        "application/vnd.onepagertat": {
          "source": "iana"
        },
        "application/vnd.onepagertatp": {
          "source": "iana"
        },
        "application/vnd.onepagertatx": {
          "source": "iana"
        },
        "application/vnd.openblox.game+xml": {
          "source": "iana"
        },
        "application/vnd.openblox.game-binary": {
          "source": "iana"
        },
        "application/vnd.openeye.oeb": {
          "source": "iana"
        },
        "application/vnd.openofficeorg.extension": {
          "source": "apache",
          "extensions": ["oxt"]
        },
        "application/vnd.openstreetmap.data+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawing+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml-template": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
          "source": "iana",
          "compressible": false,
          "extensions": ["pptx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slide": {
          "source": "iana",
          "extensions": ["sldx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
          "source": "iana",
          "extensions": ["ppsx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.template": {
          "source": "apache",
          "extensions": ["potx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml-template": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
          "source": "iana",
          "compressible": false,
          "extensions": ["xlsx"]
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
          "source": "apache",
          "extensions": ["xltx"]
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.theme+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.vmldrawing": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml-template": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
          "source": "iana",
          "compressible": false,
          "extensions": ["docx"]
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
          "source": "apache",
          "extensions": ["dotx"]
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-package.core-properties+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
          "source": "iana"
        },
        "application/vnd.openxmlformats-package.relationships+xml": {
          "source": "iana"
        },
        "application/vnd.oracle.resource+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.orange.indata": {
          "source": "iana"
        },
        "application/vnd.osa.netdeploy": {
          "source": "iana"
        },
        "application/vnd.osgeo.mapguide.package": {
          "source": "iana",
          "extensions": ["mgp"]
        },
        "application/vnd.osgi.bundle": {
          "source": "iana"
        },
        "application/vnd.osgi.dp": {
          "source": "iana",
          "extensions": ["dp"]
        },
        "application/vnd.osgi.subsystem": {
          "source": "iana",
          "extensions": ["esa"]
        },
        "application/vnd.otps.ct-kip+xml": {
          "source": "iana"
        },
        "application/vnd.oxli.countgraph": {
          "source": "iana"
        },
        "application/vnd.pagerduty+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.palm": {
          "source": "iana",
          "extensions": ["pdb", "pqa", "oprc"]
        },
        "application/vnd.panoply": {
          "source": "iana"
        },
        "application/vnd.paos+xml": {
          "source": "iana"
        },
        "application/vnd.paos.xml": {
          "source": "apache"
        },
        "application/vnd.pawaafile": {
          "source": "iana",
          "extensions": ["paw"]
        },
        "application/vnd.pcos": {
          "source": "iana"
        },
        "application/vnd.pg.format": {
          "source": "iana",
          "extensions": ["str"]
        },
        "application/vnd.pg.osasli": {
          "source": "iana",
          "extensions": ["ei6"]
        },
        "application/vnd.piaccess.application-licence": {
          "source": "iana"
        },
        "application/vnd.picsel": {
          "source": "iana",
          "extensions": ["efif"]
        },
        "application/vnd.pmi.widget": {
          "source": "iana",
          "extensions": ["wg"]
        },
        "application/vnd.poc.group-advertisement+xml": {
          "source": "iana"
        },
        "application/vnd.pocketlearn": {
          "source": "iana",
          "extensions": ["plf"]
        },
        "application/vnd.powerbuilder6": {
          "source": "iana",
          "extensions": ["pbd"]
        },
        "application/vnd.powerbuilder6-s": {
          "source": "iana"
        },
        "application/vnd.powerbuilder7": {
          "source": "iana"
        },
        "application/vnd.powerbuilder7-s": {
          "source": "iana"
        },
        "application/vnd.powerbuilder75": {
          "source": "iana"
        },
        "application/vnd.powerbuilder75-s": {
          "source": "iana"
        },
        "application/vnd.preminet": {
          "source": "iana"
        },
        "application/vnd.previewsystems.box": {
          "source": "iana",
          "extensions": ["box"]
        },
        "application/vnd.proteus.magazine": {
          "source": "iana",
          "extensions": ["mgz"]
        },
        "application/vnd.publishare-delta-tree": {
          "source": "iana",
          "extensions": ["qps"]
        },
        "application/vnd.pvi.ptid1": {
          "source": "iana",
          "extensions": ["ptid"]
        },
        "application/vnd.pwg-multiplexed": {
          "source": "iana"
        },
        "application/vnd.pwg-xhtml-print+xml": {
          "source": "iana"
        },
        "application/vnd.qualcomm.brew-app-res": {
          "source": "iana"
        },
        "application/vnd.quarantainenet": {
          "source": "iana"
        },
        "application/vnd.quark.quarkxpress": {
          "source": "iana",
          "extensions": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
        },
        "application/vnd.quobject-quoxdocument": {
          "source": "iana"
        },
        "application/vnd.radisys.moml+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-audit+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-audit-conf+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-audit-conn+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-audit-dialog+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-audit-stream+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-conf+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-base+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-fax-detect+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-group+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-speech+xml": {
          "source": "iana"
        },
        "application/vnd.radisys.msml-dialog-transform+xml": {
          "source": "iana"
        },
        "application/vnd.rainstor.data": {
          "source": "iana"
        },
        "application/vnd.rapid": {
          "source": "iana"
        },
        "application/vnd.rar": {
          "source": "iana"
        },
        "application/vnd.realvnc.bed": {
          "source": "iana",
          "extensions": ["bed"]
        },
        "application/vnd.recordare.musicxml": {
          "source": "iana",
          "extensions": ["mxl"]
        },
        "application/vnd.recordare.musicxml+xml": {
          "source": "iana",
          "extensions": ["musicxml"]
        },
        "application/vnd.renlearn.rlprint": {
          "source": "iana"
        },
        "application/vnd.rig.cryptonote": {
          "source": "iana",
          "extensions": ["cryptonote"]
        },
        "application/vnd.rim.cod": {
          "source": "apache",
          "extensions": ["cod"]
        },
        "application/vnd.rn-realmedia": {
          "source": "apache",
          "extensions": ["rm"]
        },
        "application/vnd.rn-realmedia-vbr": {
          "source": "apache",
          "extensions": ["rmvb"]
        },
        "application/vnd.route66.link66+xml": {
          "source": "iana",
          "extensions": ["link66"]
        },
        "application/vnd.rs-274x": {
          "source": "iana"
        },
        "application/vnd.ruckus.download": {
          "source": "iana"
        },
        "application/vnd.s3sms": {
          "source": "iana"
        },
        "application/vnd.sailingtracker.track": {
          "source": "iana",
          "extensions": ["st"]
        },
        "application/vnd.sbm.cid": {
          "source": "iana"
        },
        "application/vnd.sbm.mid2": {
          "source": "iana"
        },
        "application/vnd.scribus": {
          "source": "iana"
        },
        "application/vnd.sealed.3df": {
          "source": "iana"
        },
        "application/vnd.sealed.csf": {
          "source": "iana"
        },
        "application/vnd.sealed.doc": {
          "source": "iana"
        },
        "application/vnd.sealed.eml": {
          "source": "iana"
        },
        "application/vnd.sealed.mht": {
          "source": "iana"
        },
        "application/vnd.sealed.net": {
          "source": "iana"
        },
        "application/vnd.sealed.ppt": {
          "source": "iana"
        },
        "application/vnd.sealed.tiff": {
          "source": "iana"
        },
        "application/vnd.sealed.xls": {
          "source": "iana"
        },
        "application/vnd.sealedmedia.softseal.html": {
          "source": "iana"
        },
        "application/vnd.sealedmedia.softseal.pdf": {
          "source": "iana"
        },
        "application/vnd.seemail": {
          "source": "iana",
          "extensions": ["see"]
        },
        "application/vnd.sema": {
          "source": "iana",
          "extensions": ["sema"]
        },
        "application/vnd.semd": {
          "source": "iana",
          "extensions": ["semd"]
        },
        "application/vnd.semf": {
          "source": "iana",
          "extensions": ["semf"]
        },
        "application/vnd.shana.informed.formdata": {
          "source": "iana",
          "extensions": ["ifm"]
        },
        "application/vnd.shana.informed.formtemplate": {
          "source": "iana",
          "extensions": ["itp"]
        },
        "application/vnd.shana.informed.interchange": {
          "source": "iana",
          "extensions": ["iif"]
        },
        "application/vnd.shana.informed.package": {
          "source": "iana",
          "extensions": ["ipk"]
        },
        "application/vnd.sigrok.session": {
          "source": "iana"
        },
        "application/vnd.simtech-mindmapper": {
          "source": "iana",
          "extensions": ["twd", "twds"]
        },
        "application/vnd.siren+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.smaf": {
          "source": "iana",
          "extensions": ["mmf"]
        },
        "application/vnd.smart.notebook": {
          "source": "iana"
        },
        "application/vnd.smart.teacher": {
          "source": "iana",
          "extensions": ["teacher"]
        },
        "application/vnd.software602.filler.form+xml": {
          "source": "iana"
        },
        "application/vnd.software602.filler.form-xml-zip": {
          "source": "iana"
        },
        "application/vnd.solent.sdkm+xml": {
          "source": "iana",
          "extensions": ["sdkm", "sdkd"]
        },
        "application/vnd.spotfire.dxp": {
          "source": "iana",
          "extensions": ["dxp"]
        },
        "application/vnd.spotfire.sfs": {
          "source": "iana",
          "extensions": ["sfs"]
        },
        "application/vnd.sss-cod": {
          "source": "iana"
        },
        "application/vnd.sss-dtf": {
          "source": "iana"
        },
        "application/vnd.sss-ntf": {
          "source": "iana"
        },
        "application/vnd.stardivision.calc": {
          "source": "apache",
          "extensions": ["sdc"]
        },
        "application/vnd.stardivision.draw": {
          "source": "apache",
          "extensions": ["sda"]
        },
        "application/vnd.stardivision.impress": {
          "source": "apache",
          "extensions": ["sdd"]
        },
        "application/vnd.stardivision.math": {
          "source": "apache",
          "extensions": ["smf"]
        },
        "application/vnd.stardivision.writer": {
          "source": "apache",
          "extensions": ["sdw", "vor"]
        },
        "application/vnd.stardivision.writer-global": {
          "source": "apache",
          "extensions": ["sgl"]
        },
        "application/vnd.stepmania.package": {
          "source": "iana",
          "extensions": ["smzip"]
        },
        "application/vnd.stepmania.stepchart": {
          "source": "iana",
          "extensions": ["sm"]
        },
        "application/vnd.street-stream": {
          "source": "iana"
        },
        "application/vnd.sun.wadl+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["wadl"]
        },
        "application/vnd.sun.xml.calc": {
          "source": "apache",
          "extensions": ["sxc"]
        },
        "application/vnd.sun.xml.calc.template": {
          "source": "apache",
          "extensions": ["stc"]
        },
        "application/vnd.sun.xml.draw": {
          "source": "apache",
          "extensions": ["sxd"]
        },
        "application/vnd.sun.xml.draw.template": {
          "source": "apache",
          "extensions": ["std"]
        },
        "application/vnd.sun.xml.impress": {
          "source": "apache",
          "extensions": ["sxi"]
        },
        "application/vnd.sun.xml.impress.template": {
          "source": "apache",
          "extensions": ["sti"]
        },
        "application/vnd.sun.xml.math": {
          "source": "apache",
          "extensions": ["sxm"]
        },
        "application/vnd.sun.xml.writer": {
          "source": "apache",
          "extensions": ["sxw"]
        },
        "application/vnd.sun.xml.writer.global": {
          "source": "apache",
          "extensions": ["sxg"]
        },
        "application/vnd.sun.xml.writer.template": {
          "source": "apache",
          "extensions": ["stw"]
        },
        "application/vnd.sus-calendar": {
          "source": "iana",
          "extensions": ["sus", "susp"]
        },
        "application/vnd.svd": {
          "source": "iana",
          "extensions": ["svd"]
        },
        "application/vnd.swiftview-ics": {
          "source": "iana"
        },
        "application/vnd.symbian.install": {
          "source": "apache",
          "extensions": ["sis", "sisx"]
        },
        "application/vnd.syncml+xml": {
          "source": "iana",
          "extensions": ["xsm"]
        },
        "application/vnd.syncml.dm+wbxml": {
          "source": "iana",
          "extensions": ["bdm"]
        },
        "application/vnd.syncml.dm+xml": {
          "source": "iana",
          "extensions": ["xdm"]
        },
        "application/vnd.syncml.dm.notification": {
          "source": "iana"
        },
        "application/vnd.syncml.dmddf+wbxml": {
          "source": "iana"
        },
        "application/vnd.syncml.dmddf+xml": {
          "source": "iana"
        },
        "application/vnd.syncml.dmtnds+wbxml": {
          "source": "iana"
        },
        "application/vnd.syncml.dmtnds+xml": {
          "source": "iana"
        },
        "application/vnd.syncml.ds.notification": {
          "source": "iana"
        },
        "application/vnd.tableschema+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.tao.intent-module-archive": {
          "source": "iana",
          "extensions": ["tao"]
        },
        "application/vnd.tcpdump.pcap": {
          "source": "iana",
          "extensions": ["pcap", "cap", "dmp"]
        },
        "application/vnd.tmd.mediaflex.api+xml": {
          "source": "iana"
        },
        "application/vnd.tml": {
          "source": "iana"
        },
        "application/vnd.tmobile-livetv": {
          "source": "iana",
          "extensions": ["tmo"]
        },
        "application/vnd.tri.onesource": {
          "source": "iana"
        },
        "application/vnd.trid.tpt": {
          "source": "iana",
          "extensions": ["tpt"]
        },
        "application/vnd.triscape.mxs": {
          "source": "iana",
          "extensions": ["mxs"]
        },
        "application/vnd.trueapp": {
          "source": "iana",
          "extensions": ["tra"]
        },
        "application/vnd.truedoc": {
          "source": "iana"
        },
        "application/vnd.ubisoft.webplayer": {
          "source": "iana"
        },
        "application/vnd.ufdl": {
          "source": "iana",
          "extensions": ["ufd", "ufdl"]
        },
        "application/vnd.uiq.theme": {
          "source": "iana",
          "extensions": ["utz"]
        },
        "application/vnd.umajin": {
          "source": "iana",
          "extensions": ["umj"]
        },
        "application/vnd.unity": {
          "source": "iana",
          "extensions": ["unityweb"]
        },
        "application/vnd.uoml+xml": {
          "source": "iana",
          "extensions": ["uoml"]
        },
        "application/vnd.uplanet.alert": {
          "source": "iana"
        },
        "application/vnd.uplanet.alert-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.bearer-choice": {
          "source": "iana"
        },
        "application/vnd.uplanet.bearer-choice-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.cacheop": {
          "source": "iana"
        },
        "application/vnd.uplanet.cacheop-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.channel": {
          "source": "iana"
        },
        "application/vnd.uplanet.channel-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.list": {
          "source": "iana"
        },
        "application/vnd.uplanet.list-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.listcmd": {
          "source": "iana"
        },
        "application/vnd.uplanet.listcmd-wbxml": {
          "source": "iana"
        },
        "application/vnd.uplanet.signal": {
          "source": "iana"
        },
        "application/vnd.uri-map": {
          "source": "iana"
        },
        "application/vnd.valve.source.material": {
          "source": "iana"
        },
        "application/vnd.vcx": {
          "source": "iana",
          "extensions": ["vcx"]
        },
        "application/vnd.vd-study": {
          "source": "iana"
        },
        "application/vnd.vectorworks": {
          "source": "iana"
        },
        "application/vnd.vel+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.verimatrix.vcas": {
          "source": "iana"
        },
        "application/vnd.vidsoft.vidconference": {
          "source": "iana"
        },
        "application/vnd.visio": {
          "source": "iana",
          "extensions": ["vsd", "vst", "vss", "vsw"]
        },
        "application/vnd.visionary": {
          "source": "iana",
          "extensions": ["vis"]
        },
        "application/vnd.vividence.scriptfile": {
          "source": "iana"
        },
        "application/vnd.vsf": {
          "source": "iana",
          "extensions": ["vsf"]
        },
        "application/vnd.wap.sic": {
          "source": "iana"
        },
        "application/vnd.wap.slc": {
          "source": "iana"
        },
        "application/vnd.wap.wbxml": {
          "source": "iana",
          "extensions": ["wbxml"]
        },
        "application/vnd.wap.wmlc": {
          "source": "iana",
          "extensions": ["wmlc"]
        },
        "application/vnd.wap.wmlscriptc": {
          "source": "iana",
          "extensions": ["wmlsc"]
        },
        "application/vnd.webturbo": {
          "source": "iana",
          "extensions": ["wtb"]
        },
        "application/vnd.wfa.p2p": {
          "source": "iana"
        },
        "application/vnd.wfa.wsc": {
          "source": "iana"
        },
        "application/vnd.windows.devicepairing": {
          "source": "iana"
        },
        "application/vnd.wmc": {
          "source": "iana"
        },
        "application/vnd.wmf.bootstrap": {
          "source": "iana"
        },
        "application/vnd.wolfram.mathematica": {
          "source": "iana"
        },
        "application/vnd.wolfram.mathematica.package": {
          "source": "iana"
        },
        "application/vnd.wolfram.player": {
          "source": "iana",
          "extensions": ["nbp"]
        },
        "application/vnd.wordperfect": {
          "source": "iana",
          "extensions": ["wpd"]
        },
        "application/vnd.wqd": {
          "source": "iana",
          "extensions": ["wqd"]
        },
        "application/vnd.wrq-hp3000-labelled": {
          "source": "iana"
        },
        "application/vnd.wt.stf": {
          "source": "iana",
          "extensions": ["stf"]
        },
        "application/vnd.wv.csp+wbxml": {
          "source": "iana"
        },
        "application/vnd.wv.csp+xml": {
          "source": "iana"
        },
        "application/vnd.wv.ssp+xml": {
          "source": "iana"
        },
        "application/vnd.xacml+json": {
          "source": "iana",
          "compressible": true
        },
        "application/vnd.xara": {
          "source": "iana",
          "extensions": ["xar"]
        },
        "application/vnd.xfdl": {
          "source": "iana",
          "extensions": ["xfdl"]
        },
        "application/vnd.xfdl.webform": {
          "source": "iana"
        },
        "application/vnd.xmi+xml": {
          "source": "iana"
        },
        "application/vnd.xmpie.cpkg": {
          "source": "iana"
        },
        "application/vnd.xmpie.dpkg": {
          "source": "iana"
        },
        "application/vnd.xmpie.plan": {
          "source": "iana"
        },
        "application/vnd.xmpie.ppkg": {
          "source": "iana"
        },
        "application/vnd.xmpie.xlim": {
          "source": "iana"
        },
        "application/vnd.yamaha.hv-dic": {
          "source": "iana",
          "extensions": ["hvd"]
        },
        "application/vnd.yamaha.hv-script": {
          "source": "iana",
          "extensions": ["hvs"]
        },
        "application/vnd.yamaha.hv-voice": {
          "source": "iana",
          "extensions": ["hvp"]
        },
        "application/vnd.yamaha.openscoreformat": {
          "source": "iana",
          "extensions": ["osf"]
        },
        "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
          "source": "iana",
          "extensions": ["osfpvg"]
        },
        "application/vnd.yamaha.remote-setup": {
          "source": "iana"
        },
        "application/vnd.yamaha.smaf-audio": {
          "source": "iana",
          "extensions": ["saf"]
        },
        "application/vnd.yamaha.smaf-phrase": {
          "source": "iana",
          "extensions": ["spf"]
        },
        "application/vnd.yamaha.through-ngn": {
          "source": "iana"
        },
        "application/vnd.yamaha.tunnel-udpencap": {
          "source": "iana"
        },
        "application/vnd.yaoweme": {
          "source": "iana"
        },
        "application/vnd.yellowriver-custom-menu": {
          "source": "iana",
          "extensions": ["cmp"]
        },
        "application/vnd.zul": {
          "source": "iana",
          "extensions": ["zir", "zirz"]
        },
        "application/vnd.zzazz.deck+xml": {
          "source": "iana",
          "extensions": ["zaz"]
        },
        "application/voicexml+xml": {
          "source": "iana",
          "extensions": ["vxml"]
        },
        "application/vq-rtcpxr": {
          "source": "iana"
        },
        "application/watcherinfo+xml": {
          "source": "iana"
        },
        "application/whoispp-query": {
          "source": "iana"
        },
        "application/whoispp-response": {
          "source": "iana"
        },
        "application/widget": {
          "source": "iana",
          "extensions": ["wgt"]
        },
        "application/winhlp": {
          "source": "apache",
          "extensions": ["hlp"]
        },
        "application/wita": {
          "source": "iana"
        },
        "application/wordperfect5.1": {
          "source": "iana"
        },
        "application/wsdl+xml": {
          "source": "iana",
          "extensions": ["wsdl"]
        },
        "application/wspolicy+xml": {
          "source": "iana",
          "extensions": ["wspolicy"]
        },
        "application/x-7z-compressed": {
          "source": "apache",
          "compressible": false,
          "extensions": ["7z"]
        },
        "application/x-abiword": {
          "source": "apache",
          "extensions": ["abw"]
        },
        "application/x-ace-compressed": {
          "source": "apache",
          "extensions": ["ace"]
        },
        "application/x-amf": {
          "source": "apache"
        },
        "application/x-apple-diskimage": {
          "source": "apache",
          "extensions": ["dmg"]
        },
        "application/x-arj": {
          "compressible": false,
          "extensions": ["arj"]
        },
        "application/x-authorware-bin": {
          "source": "apache",
          "extensions": ["aab", "x32", "u32", "vox"]
        },
        "application/x-authorware-map": {
          "source": "apache",
          "extensions": ["aam"]
        },
        "application/x-authorware-seg": {
          "source": "apache",
          "extensions": ["aas"]
        },
        "application/x-bcpio": {
          "source": "apache",
          "extensions": ["bcpio"]
        },
        "application/x-bdoc": {
          "compressible": false,
          "extensions": ["bdoc"]
        },
        "application/x-bittorrent": {
          "source": "apache",
          "extensions": ["torrent"]
        },
        "application/x-blorb": {
          "source": "apache",
          "extensions": ["blb", "blorb"]
        },
        "application/x-bzip": {
          "source": "apache",
          "compressible": false,
          "extensions": ["bz"]
        },
        "application/x-bzip2": {
          "source": "apache",
          "compressible": false,
          "extensions": ["bz2", "boz"]
        },
        "application/x-cbr": {
          "source": "apache",
          "extensions": ["cbr", "cba", "cbt", "cbz", "cb7"]
        },
        "application/x-cdlink": {
          "source": "apache",
          "extensions": ["vcd"]
        },
        "application/x-cfs-compressed": {
          "source": "apache",
          "extensions": ["cfs"]
        },
        "application/x-chat": {
          "source": "apache",
          "extensions": ["chat"]
        },
        "application/x-chess-pgn": {
          "source": "apache",
          "extensions": ["pgn"]
        },
        "application/x-chrome-extension": {
          "extensions": ["crx"]
        },
        "application/x-cocoa": {
          "source": "nginx",
          "extensions": ["cco"]
        },
        "application/x-compress": {
          "source": "apache"
        },
        "application/x-conference": {
          "source": "apache",
          "extensions": ["nsc"]
        },
        "application/x-cpio": {
          "source": "apache",
          "extensions": ["cpio"]
        },
        "application/x-csh": {
          "source": "apache",
          "extensions": ["csh"]
        },
        "application/x-deb": {
          "compressible": false
        },
        "application/x-debian-package": {
          "source": "apache",
          "extensions": ["deb", "udeb"]
        },
        "application/x-dgc-compressed": {
          "source": "apache",
          "extensions": ["dgc"]
        },
        "application/x-director": {
          "source": "apache",
          "extensions": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
        },
        "application/x-doom": {
          "source": "apache",
          "extensions": ["wad"]
        },
        "application/x-dtbncx+xml": {
          "source": "apache",
          "extensions": ["ncx"]
        },
        "application/x-dtbook+xml": {
          "source": "apache",
          "extensions": ["dtb"]
        },
        "application/x-dtbresource+xml": {
          "source": "apache",
          "extensions": ["res"]
        },
        "application/x-dvi": {
          "source": "apache",
          "compressible": false,
          "extensions": ["dvi"]
        },
        "application/x-envoy": {
          "source": "apache",
          "extensions": ["evy"]
        },
        "application/x-eva": {
          "source": "apache",
          "extensions": ["eva"]
        },
        "application/x-font-bdf": {
          "source": "apache",
          "extensions": ["bdf"]
        },
        "application/x-font-dos": {
          "source": "apache"
        },
        "application/x-font-framemaker": {
          "source": "apache"
        },
        "application/x-font-ghostscript": {
          "source": "apache",
          "extensions": ["gsf"]
        },
        "application/x-font-libgrx": {
          "source": "apache"
        },
        "application/x-font-linux-psf": {
          "source": "apache",
          "extensions": ["psf"]
        },
        "application/x-font-otf": {
          "source": "apache",
          "compressible": true,
          "extensions": ["otf"]
        },
        "application/x-font-pcf": {
          "source": "apache",
          "extensions": ["pcf"]
        },
        "application/x-font-snf": {
          "source": "apache",
          "extensions": ["snf"]
        },
        "application/x-font-speedo": {
          "source": "apache"
        },
        "application/x-font-sunos-news": {
          "source": "apache"
        },
        "application/x-font-ttf": {
          "source": "apache",
          "compressible": true,
          "extensions": ["ttf", "ttc"]
        },
        "application/x-font-type1": {
          "source": "apache",
          "extensions": ["pfa", "pfb", "pfm", "afm"]
        },
        "application/x-font-vfont": {
          "source": "apache"
        },
        "application/x-freearc": {
          "source": "apache",
          "extensions": ["arc"]
        },
        "application/x-futuresplash": {
          "source": "apache",
          "extensions": ["spl"]
        },
        "application/x-gca-compressed": {
          "source": "apache",
          "extensions": ["gca"]
        },
        "application/x-glulx": {
          "source": "apache",
          "extensions": ["ulx"]
        },
        "application/x-gnumeric": {
          "source": "apache",
          "extensions": ["gnumeric"]
        },
        "application/x-gramps-xml": {
          "source": "apache",
          "extensions": ["gramps"]
        },
        "application/x-gtar": {
          "source": "apache",
          "extensions": ["gtar"]
        },
        "application/x-gzip": {
          "source": "apache"
        },
        "application/x-hdf": {
          "source": "apache",
          "extensions": ["hdf"]
        },
        "application/x-httpd-php": {
          "compressible": true,
          "extensions": ["php"]
        },
        "application/x-install-instructions": {
          "source": "apache",
          "extensions": ["install"]
        },
        "application/x-iso9660-image": {
          "source": "apache",
          "extensions": ["iso"]
        },
        "application/x-java-archive-diff": {
          "source": "nginx",
          "extensions": ["jardiff"]
        },
        "application/x-java-jnlp-file": {
          "source": "apache",
          "compressible": false,
          "extensions": ["jnlp"]
        },
        "application/x-javascript": {
          "compressible": true
        },
        "application/x-latex": {
          "source": "apache",
          "compressible": false,
          "extensions": ["latex"]
        },
        "application/x-lua-bytecode": {
          "extensions": ["luac"]
        },
        "application/x-lzh-compressed": {
          "source": "apache",
          "extensions": ["lzh", "lha"]
        },
        "application/x-makeself": {
          "source": "nginx",
          "extensions": ["run"]
        },
        "application/x-mie": {
          "source": "apache",
          "extensions": ["mie"]
        },
        "application/x-mobipocket-ebook": {
          "source": "apache",
          "extensions": ["prc", "mobi"]
        },
        "application/x-mpegurl": {
          "compressible": false
        },
        "application/x-ms-application": {
          "source": "apache",
          "extensions": ["application"]
        },
        "application/x-ms-shortcut": {
          "source": "apache",
          "extensions": ["lnk"]
        },
        "application/x-ms-wmd": {
          "source": "apache",
          "extensions": ["wmd"]
        },
        "application/x-ms-wmz": {
          "source": "apache",
          "extensions": ["wmz"]
        },
        "application/x-ms-xbap": {
          "source": "apache",
          "extensions": ["xbap"]
        },
        "application/x-msaccess": {
          "source": "apache",
          "extensions": ["mdb"]
        },
        "application/x-msbinder": {
          "source": "apache",
          "extensions": ["obd"]
        },
        "application/x-mscardfile": {
          "source": "apache",
          "extensions": ["crd"]
        },
        "application/x-msclip": {
          "source": "apache",
          "extensions": ["clp"]
        },
        "application/x-msdos-program": {
          "extensions": ["exe"]
        },
        "application/x-msdownload": {
          "source": "apache",
          "extensions": ["exe", "dll", "com", "bat", "msi"]
        },
        "application/x-msmediaview": {
          "source": "apache",
          "extensions": ["mvb", "m13", "m14"]
        },
        "application/x-msmetafile": {
          "source": "apache",
          "extensions": ["wmf", "wmz", "emf", "emz"]
        },
        "application/x-msmoney": {
          "source": "apache",
          "extensions": ["mny"]
        },
        "application/x-mspublisher": {
          "source": "apache",
          "extensions": ["pub"]
        },
        "application/x-msschedule": {
          "source": "apache",
          "extensions": ["scd"]
        },
        "application/x-msterminal": {
          "source": "apache",
          "extensions": ["trm"]
        },
        "application/x-mswrite": {
          "source": "apache",
          "extensions": ["wri"]
        },
        "application/x-netcdf": {
          "source": "apache",
          "extensions": ["nc", "cdf"]
        },
        "application/x-ns-proxy-autoconfig": {
          "compressible": true,
          "extensions": ["pac"]
        },
        "application/x-nzb": {
          "source": "apache",
          "extensions": ["nzb"]
        },
        "application/x-perl": {
          "source": "nginx",
          "extensions": ["pl", "pm"]
        },
        "application/x-pilot": {
          "source": "nginx",
          "extensions": ["prc", "pdb"]
        },
        "application/x-pkcs12": {
          "source": "apache",
          "compressible": false,
          "extensions": ["p12", "pfx"]
        },
        "application/x-pkcs7-certificates": {
          "source": "apache",
          "extensions": ["p7b", "spc"]
        },
        "application/x-pkcs7-certreqresp": {
          "source": "apache",
          "extensions": ["p7r"]
        },
        "application/x-rar-compressed": {
          "source": "apache",
          "compressible": false,
          "extensions": ["rar"]
        },
        "application/x-redhat-package-manager": {
          "source": "nginx",
          "extensions": ["rpm"]
        },
        "application/x-research-info-systems": {
          "source": "apache",
          "extensions": ["ris"]
        },
        "application/x-sea": {
          "source": "nginx",
          "extensions": ["sea"]
        },
        "application/x-sh": {
          "source": "apache",
          "compressible": true,
          "extensions": ["sh"]
        },
        "application/x-shar": {
          "source": "apache",
          "extensions": ["shar"]
        },
        "application/x-shockwave-flash": {
          "source": "apache",
          "compressible": false,
          "extensions": ["swf"]
        },
        "application/x-silverlight-app": {
          "source": "apache",
          "extensions": ["xap"]
        },
        "application/x-sql": {
          "source": "apache",
          "extensions": ["sql"]
        },
        "application/x-stuffit": {
          "source": "apache",
          "compressible": false,
          "extensions": ["sit"]
        },
        "application/x-stuffitx": {
          "source": "apache",
          "extensions": ["sitx"]
        },
        "application/x-subrip": {
          "source": "apache",
          "extensions": ["srt"]
        },
        "application/x-sv4cpio": {
          "source": "apache",
          "extensions": ["sv4cpio"]
        },
        "application/x-sv4crc": {
          "source": "apache",
          "extensions": ["sv4crc"]
        },
        "application/x-t3vm-image": {
          "source": "apache",
          "extensions": ["t3"]
        },
        "application/x-tads": {
          "source": "apache",
          "extensions": ["gam"]
        },
        "application/x-tar": {
          "source": "apache",
          "compressible": true,
          "extensions": ["tar"]
        },
        "application/x-tcl": {
          "source": "apache",
          "extensions": ["tcl", "tk"]
        },
        "application/x-tex": {
          "source": "apache",
          "extensions": ["tex"]
        },
        "application/x-tex-tfm": {
          "source": "apache",
          "extensions": ["tfm"]
        },
        "application/x-texinfo": {
          "source": "apache",
          "extensions": ["texinfo", "texi"]
        },
        "application/x-tgif": {
          "source": "apache",
          "extensions": ["obj"]
        },
        "application/x-ustar": {
          "source": "apache",
          "extensions": ["ustar"]
        },
        "application/x-virtualbox-hdd": {
          "compressible": true,
          "extensions": ["hdd"]
        },
        "application/x-virtualbox-ova": {
          "compressible": true,
          "extensions": ["ova"]
        },
        "application/x-virtualbox-ovf": {
          "compressible": true,
          "extensions": ["ovf"]
        },
        "application/x-virtualbox-vbox": {
          "compressible": true,
          "extensions": ["vbox"]
        },
        "application/x-virtualbox-vbox-extpack": {
          "compressible": false,
          "extensions": ["vbox-extpack"]
        },
        "application/x-virtualbox-vdi": {
          "compressible": true,
          "extensions": ["vdi"]
        },
        "application/x-virtualbox-vhd": {
          "compressible": true,
          "extensions": ["vhd"]
        },
        "application/x-virtualbox-vmdk": {
          "compressible": true,
          "extensions": ["vmdk"]
        },
        "application/x-wais-source": {
          "source": "apache",
          "extensions": ["src"]
        },
        "application/x-web-app-manifest+json": {
          "compressible": true,
          "extensions": ["webapp"]
        },
        "application/x-www-form-urlencoded": {
          "source": "iana",
          "compressible": true
        },
        "application/x-x509-ca-cert": {
          "source": "apache",
          "extensions": ["der", "crt", "pem"]
        },
        "application/x-xfig": {
          "source": "apache",
          "extensions": ["fig"]
        },
        "application/x-xliff+xml": {
          "source": "apache",
          "extensions": ["xlf"]
        },
        "application/x-xpinstall": {
          "source": "apache",
          "compressible": false,
          "extensions": ["xpi"]
        },
        "application/x-xz": {
          "source": "apache",
          "extensions": ["xz"]
        },
        "application/x-zmachine": {
          "source": "apache",
          "extensions": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
        },
        "application/x400-bp": {
          "source": "iana"
        },
        "application/xacml+xml": {
          "source": "iana"
        },
        "application/xaml+xml": {
          "source": "apache",
          "extensions": ["xaml"]
        },
        "application/xcap-att+xml": {
          "source": "iana"
        },
        "application/xcap-caps+xml": {
          "source": "iana"
        },
        "application/xcap-diff+xml": {
          "source": "iana",
          "extensions": ["xdf"]
        },
        "application/xcap-el+xml": {
          "source": "iana"
        },
        "application/xcap-error+xml": {
          "source": "iana"
        },
        "application/xcap-ns+xml": {
          "source": "iana"
        },
        "application/xcon-conference-info+xml": {
          "source": "iana"
        },
        "application/xcon-conference-info-diff+xml": {
          "source": "iana"
        },
        "application/xenc+xml": {
          "source": "iana",
          "extensions": ["xenc"]
        },
        "application/xhtml+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["xhtml", "xht"]
        },
        "application/xhtml-voice+xml": {
          "source": "apache"
        },
        "application/xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["xml", "xsl", "xsd", "rng"]
        },
        "application/xml-dtd": {
          "source": "iana",
          "compressible": true,
          "extensions": ["dtd"]
        },
        "application/xml-external-parsed-entity": {
          "source": "iana"
        },
        "application/xml-patch+xml": {
          "source": "iana"
        },
        "application/xmpp+xml": {
          "source": "iana"
        },
        "application/xop+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["xop"]
        },
        "application/xproc+xml": {
          "source": "apache",
          "extensions": ["xpl"]
        },
        "application/xslt+xml": {
          "source": "iana",
          "extensions": ["xslt"]
        },
        "application/xspf+xml": {
          "source": "apache",
          "extensions": ["xspf"]
        },
        "application/xv+xml": {
          "source": "iana",
          "extensions": ["mxml", "xhvml", "xvml", "xvm"]
        },
        "application/yang": {
          "source": "iana",
          "extensions": ["yang"]
        },
        "application/yang-data+json": {
          "source": "iana",
          "compressible": true
        },
        "application/yang-data+xml": {
          "source": "iana"
        },
        "application/yang-patch+json": {
          "source": "iana",
          "compressible": true
        },
        "application/yang-patch+xml": {
          "source": "iana"
        },
        "application/yin+xml": {
          "source": "iana",
          "extensions": ["yin"]
        },
        "application/zip": {
          "source": "iana",
          "compressible": false,
          "extensions": ["zip"]
        },
        "application/zlib": {
          "source": "iana"
        },
        "audio/1d-interleaved-parityfec": {
          "source": "iana"
        },
        "audio/32kadpcm": {
          "source": "iana"
        },
        "audio/3gpp": {
          "source": "iana",
          "compressible": false,
          "extensions": ["3gpp"]
        },
        "audio/3gpp2": {
          "source": "iana"
        },
        "audio/ac3": {
          "source": "iana"
        },
        "audio/adpcm": {
          "source": "apache",
          "extensions": ["adp"]
        },
        "audio/amr": {
          "source": "iana"
        },
        "audio/amr-wb": {
          "source": "iana"
        },
        "audio/amr-wb+": {
          "source": "iana"
        },
        "audio/aptx": {
          "source": "iana"
        },
        "audio/asc": {
          "source": "iana"
        },
        "audio/atrac-advanced-lossless": {
          "source": "iana"
        },
        "audio/atrac-x": {
          "source": "iana"
        },
        "audio/atrac3": {
          "source": "iana"
        },
        "audio/basic": {
          "source": "iana",
          "compressible": false,
          "extensions": ["au", "snd"]
        },
        "audio/bv16": {
          "source": "iana"
        },
        "audio/bv32": {
          "source": "iana"
        },
        "audio/clearmode": {
          "source": "iana"
        },
        "audio/cn": {
          "source": "iana"
        },
        "audio/dat12": {
          "source": "iana"
        },
        "audio/dls": {
          "source": "iana"
        },
        "audio/dsr-es201108": {
          "source": "iana"
        },
        "audio/dsr-es202050": {
          "source": "iana"
        },
        "audio/dsr-es202211": {
          "source": "iana"
        },
        "audio/dsr-es202212": {
          "source": "iana"
        },
        "audio/dv": {
          "source": "iana"
        },
        "audio/dvi4": {
          "source": "iana"
        },
        "audio/eac3": {
          "source": "iana"
        },
        "audio/encaprtp": {
          "source": "iana"
        },
        "audio/evrc": {
          "source": "iana"
        },
        "audio/evrc-qcp": {
          "source": "iana"
        },
        "audio/evrc0": {
          "source": "iana"
        },
        "audio/evrc1": {
          "source": "iana"
        },
        "audio/evrcb": {
          "source": "iana"
        },
        "audio/evrcb0": {
          "source": "iana"
        },
        "audio/evrcb1": {
          "source": "iana"
        },
        "audio/evrcnw": {
          "source": "iana"
        },
        "audio/evrcnw0": {
          "source": "iana"
        },
        "audio/evrcnw1": {
          "source": "iana"
        },
        "audio/evrcwb": {
          "source": "iana"
        },
        "audio/evrcwb0": {
          "source": "iana"
        },
        "audio/evrcwb1": {
          "source": "iana"
        },
        "audio/evs": {
          "source": "iana"
        },
        "audio/fwdred": {
          "source": "iana"
        },
        "audio/g711-0": {
          "source": "iana"
        },
        "audio/g719": {
          "source": "iana"
        },
        "audio/g722": {
          "source": "iana"
        },
        "audio/g7221": {
          "source": "iana"
        },
        "audio/g723": {
          "source": "iana"
        },
        "audio/g726-16": {
          "source": "iana"
        },
        "audio/g726-24": {
          "source": "iana"
        },
        "audio/g726-32": {
          "source": "iana"
        },
        "audio/g726-40": {
          "source": "iana"
        },
        "audio/g728": {
          "source": "iana"
        },
        "audio/g729": {
          "source": "iana"
        },
        "audio/g7291": {
          "source": "iana"
        },
        "audio/g729d": {
          "source": "iana"
        },
        "audio/g729e": {
          "source": "iana"
        },
        "audio/gsm": {
          "source": "iana"
        },
        "audio/gsm-efr": {
          "source": "iana"
        },
        "audio/gsm-hr-08": {
          "source": "iana"
        },
        "audio/ilbc": {
          "source": "iana"
        },
        "audio/ip-mr_v2.5": {
          "source": "iana"
        },
        "audio/isac": {
          "source": "apache"
        },
        "audio/l16": {
          "source": "iana"
        },
        "audio/l20": {
          "source": "iana"
        },
        "audio/l24": {
          "source": "iana",
          "compressible": false
        },
        "audio/l8": {
          "source": "iana"
        },
        "audio/lpc": {
          "source": "iana"
        },
        "audio/melp": {
          "source": "iana"
        },
        "audio/melp1200": {
          "source": "iana"
        },
        "audio/melp2400": {
          "source": "iana"
        },
        "audio/melp600": {
          "source": "iana"
        },
        "audio/midi": {
          "source": "apache",
          "extensions": ["mid", "midi", "kar", "rmi"]
        },
        "audio/mobile-xmf": {
          "source": "iana"
        },
        "audio/mp3": {
          "compressible": false,
          "extensions": ["mp3"]
        },
        "audio/mp4": {
          "source": "iana",
          "compressible": false,
          "extensions": ["m4a", "mp4a"]
        },
        "audio/mp4a-latm": {
          "source": "iana"
        },
        "audio/mpa": {
          "source": "iana"
        },
        "audio/mpa-robust": {
          "source": "iana"
        },
        "audio/mpeg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
        },
        "audio/mpeg4-generic": {
          "source": "iana"
        },
        "audio/musepack": {
          "source": "apache"
        },
        "audio/ogg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["oga", "ogg", "spx"]
        },
        "audio/opus": {
          "source": "iana"
        },
        "audio/parityfec": {
          "source": "iana"
        },
        "audio/pcma": {
          "source": "iana"
        },
        "audio/pcma-wb": {
          "source": "iana"
        },
        "audio/pcmu": {
          "source": "iana"
        },
        "audio/pcmu-wb": {
          "source": "iana"
        },
        "audio/prs.sid": {
          "source": "iana"
        },
        "audio/qcelp": {
          "source": "iana"
        },
        "audio/raptorfec": {
          "source": "iana"
        },
        "audio/red": {
          "source": "iana"
        },
        "audio/rtp-enc-aescm128": {
          "source": "iana"
        },
        "audio/rtp-midi": {
          "source": "iana"
        },
        "audio/rtploopback": {
          "source": "iana"
        },
        "audio/rtx": {
          "source": "iana"
        },
        "audio/s3m": {
          "source": "apache",
          "extensions": ["s3m"]
        },
        "audio/silk": {
          "source": "apache",
          "extensions": ["sil"]
        },
        "audio/smv": {
          "source": "iana"
        },
        "audio/smv-qcp": {
          "source": "iana"
        },
        "audio/smv0": {
          "source": "iana"
        },
        "audio/sp-midi": {
          "source": "iana"
        },
        "audio/speex": {
          "source": "iana"
        },
        "audio/t140c": {
          "source": "iana"
        },
        "audio/t38": {
          "source": "iana"
        },
        "audio/telephone-event": {
          "source": "iana"
        },
        "audio/tone": {
          "source": "iana"
        },
        "audio/uemclip": {
          "source": "iana"
        },
        "audio/ulpfec": {
          "source": "iana"
        },
        "audio/vdvi": {
          "source": "iana"
        },
        "audio/vmr-wb": {
          "source": "iana"
        },
        "audio/vnd.3gpp.iufp": {
          "source": "iana"
        },
        "audio/vnd.4sb": {
          "source": "iana"
        },
        "audio/vnd.audiokoz": {
          "source": "iana"
        },
        "audio/vnd.celp": {
          "source": "iana"
        },
        "audio/vnd.cisco.nse": {
          "source": "iana"
        },
        "audio/vnd.cmles.radio-events": {
          "source": "iana"
        },
        "audio/vnd.cns.anp1": {
          "source": "iana"
        },
        "audio/vnd.cns.inf1": {
          "source": "iana"
        },
        "audio/vnd.dece.audio": {
          "source": "iana",
          "extensions": ["uva", "uvva"]
        },
        "audio/vnd.digital-winds": {
          "source": "iana",
          "extensions": ["eol"]
        },
        "audio/vnd.dlna.adts": {
          "source": "iana"
        },
        "audio/vnd.dolby.heaac.1": {
          "source": "iana"
        },
        "audio/vnd.dolby.heaac.2": {
          "source": "iana"
        },
        "audio/vnd.dolby.mlp": {
          "source": "iana"
        },
        "audio/vnd.dolby.mps": {
          "source": "iana"
        },
        "audio/vnd.dolby.pl2": {
          "source": "iana"
        },
        "audio/vnd.dolby.pl2x": {
          "source": "iana"
        },
        "audio/vnd.dolby.pl2z": {
          "source": "iana"
        },
        "audio/vnd.dolby.pulse.1": {
          "source": "iana"
        },
        "audio/vnd.dra": {
          "source": "iana",
          "extensions": ["dra"]
        },
        "audio/vnd.dts": {
          "source": "iana",
          "extensions": ["dts"]
        },
        "audio/vnd.dts.hd": {
          "source": "iana",
          "extensions": ["dtshd"]
        },
        "audio/vnd.dvb.file": {
          "source": "iana"
        },
        "audio/vnd.everad.plj": {
          "source": "iana"
        },
        "audio/vnd.hns.audio": {
          "source": "iana"
        },
        "audio/vnd.lucent.voice": {
          "source": "iana",
          "extensions": ["lvp"]
        },
        "audio/vnd.ms-playready.media.pya": {
          "source": "iana",
          "extensions": ["pya"]
        },
        "audio/vnd.nokia.mobile-xmf": {
          "source": "iana"
        },
        "audio/vnd.nortel.vbk": {
          "source": "iana"
        },
        "audio/vnd.nuera.ecelp4800": {
          "source": "iana",
          "extensions": ["ecelp4800"]
        },
        "audio/vnd.nuera.ecelp7470": {
          "source": "iana",
          "extensions": ["ecelp7470"]
        },
        "audio/vnd.nuera.ecelp9600": {
          "source": "iana",
          "extensions": ["ecelp9600"]
        },
        "audio/vnd.octel.sbc": {
          "source": "iana"
        },
        "audio/vnd.presonus.multitrack": {
          "source": "iana"
        },
        "audio/vnd.qcelp": {
          "source": "iana"
        },
        "audio/vnd.rhetorex.32kadpcm": {
          "source": "iana"
        },
        "audio/vnd.rip": {
          "source": "iana",
          "extensions": ["rip"]
        },
        "audio/vnd.rn-realaudio": {
          "compressible": false
        },
        "audio/vnd.sealedmedia.softseal.mpeg": {
          "source": "iana"
        },
        "audio/vnd.vmx.cvsd": {
          "source": "iana"
        },
        "audio/vnd.wave": {
          "compressible": false
        },
        "audio/vorbis": {
          "source": "iana",
          "compressible": false
        },
        "audio/vorbis-config": {
          "source": "iana"
        },
        "audio/wav": {
          "compressible": false,
          "extensions": ["wav"]
        },
        "audio/wave": {
          "compressible": false,
          "extensions": ["wav"]
        },
        "audio/webm": {
          "source": "apache",
          "compressible": false,
          "extensions": ["weba"]
        },
        "audio/x-aac": {
          "source": "apache",
          "compressible": false,
          "extensions": ["aac"]
        },
        "audio/x-aiff": {
          "source": "apache",
          "extensions": ["aif", "aiff", "aifc"]
        },
        "audio/x-caf": {
          "source": "apache",
          "compressible": false,
          "extensions": ["caf"]
        },
        "audio/x-flac": {
          "source": "apache",
          "extensions": ["flac"]
        },
        "audio/x-m4a": {
          "source": "nginx",
          "extensions": ["m4a"]
        },
        "audio/x-matroska": {
          "source": "apache",
          "extensions": ["mka"]
        },
        "audio/x-mpegurl": {
          "source": "apache",
          "extensions": ["m3u"]
        },
        "audio/x-ms-wax": {
          "source": "apache",
          "extensions": ["wax"]
        },
        "audio/x-ms-wma": {
          "source": "apache",
          "extensions": ["wma"]
        },
        "audio/x-pn-realaudio": {
          "source": "apache",
          "extensions": ["ram", "ra"]
        },
        "audio/x-pn-realaudio-plugin": {
          "source": "apache",
          "extensions": ["rmp"]
        },
        "audio/x-realaudio": {
          "source": "nginx",
          "extensions": ["ra"]
        },
        "audio/x-tta": {
          "source": "apache"
        },
        "audio/x-wav": {
          "source": "apache",
          "extensions": ["wav"]
        },
        "audio/xm": {
          "source": "apache",
          "extensions": ["xm"]
        },
        "chemical/x-cdx": {
          "source": "apache",
          "extensions": ["cdx"]
        },
        "chemical/x-cif": {
          "source": "apache",
          "extensions": ["cif"]
        },
        "chemical/x-cmdf": {
          "source": "apache",
          "extensions": ["cmdf"]
        },
        "chemical/x-cml": {
          "source": "apache",
          "extensions": ["cml"]
        },
        "chemical/x-csml": {
          "source": "apache",
          "extensions": ["csml"]
        },
        "chemical/x-pdb": {
          "source": "apache"
        },
        "chemical/x-xyz": {
          "source": "apache",
          "extensions": ["xyz"]
        },
        "font/otf": {
          "compressible": true,
          "extensions": ["otf"]
        },
        "image/apng": {
          "compressible": false,
          "extensions": ["apng"]
        },
        "image/bmp": {
          "source": "iana",
          "compressible": true,
          "extensions": ["bmp"]
        },
        "image/cgm": {
          "source": "iana",
          "extensions": ["cgm"]
        },
        "image/dicom-rle": {
          "source": "iana"
        },
        "image/emf": {
          "source": "iana"
        },
        "image/fits": {
          "source": "iana"
        },
        "image/g3fax": {
          "source": "iana",
          "extensions": ["g3"]
        },
        "image/gif": {
          "source": "iana",
          "compressible": false,
          "extensions": ["gif"]
        },
        "image/ief": {
          "source": "iana",
          "extensions": ["ief"]
        },
        "image/jls": {
          "source": "iana"
        },
        "image/jp2": {
          "source": "iana"
        },
        "image/jpeg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["jpeg", "jpg", "jpe"]
        },
        "image/jpm": {
          "source": "iana"
        },
        "image/jpx": {
          "source": "iana"
        },
        "image/ktx": {
          "source": "iana",
          "extensions": ["ktx"]
        },
        "image/naplps": {
          "source": "iana"
        },
        "image/pjpeg": {
          "compressible": false
        },
        "image/png": {
          "source": "iana",
          "compressible": false,
          "extensions": ["png"]
        },
        "image/prs.btif": {
          "source": "iana",
          "extensions": ["btif"]
        },
        "image/prs.pti": {
          "source": "iana"
        },
        "image/pwg-raster": {
          "source": "iana"
        },
        "image/sgi": {
          "source": "apache",
          "extensions": ["sgi"]
        },
        "image/svg+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["svg", "svgz"]
        },
        "image/t38": {
          "source": "iana"
        },
        "image/tiff": {
          "source": "iana",
          "compressible": false,
          "extensions": ["tiff", "tif"]
        },
        "image/tiff-fx": {
          "source": "iana"
        },
        "image/vnd.adobe.photoshop": {
          "source": "iana",
          "compressible": true,
          "extensions": ["psd"]
        },
        "image/vnd.airzip.accelerator.azv": {
          "source": "iana"
        },
        "image/vnd.cns.inf2": {
          "source": "iana"
        },
        "image/vnd.dece.graphic": {
          "source": "iana",
          "extensions": ["uvi", "uvvi", "uvg", "uvvg"]
        },
        "image/vnd.djvu": {
          "source": "iana",
          "extensions": ["djvu", "djv"]
        },
        "image/vnd.dvb.subtitle": {
          "source": "iana",
          "extensions": ["sub"]
        },
        "image/vnd.dwg": {
          "source": "iana",
          "extensions": ["dwg"]
        },
        "image/vnd.dxf": {
          "source": "iana",
          "extensions": ["dxf"]
        },
        "image/vnd.fastbidsheet": {
          "source": "iana",
          "extensions": ["fbs"]
        },
        "image/vnd.fpx": {
          "source": "iana",
          "extensions": ["fpx"]
        },
        "image/vnd.fst": {
          "source": "iana",
          "extensions": ["fst"]
        },
        "image/vnd.fujixerox.edmics-mmr": {
          "source": "iana",
          "extensions": ["mmr"]
        },
        "image/vnd.fujixerox.edmics-rlc": {
          "source": "iana",
          "extensions": ["rlc"]
        },
        "image/vnd.globalgraphics.pgb": {
          "source": "iana"
        },
        "image/vnd.microsoft.icon": {
          "source": "iana"
        },
        "image/vnd.mix": {
          "source": "iana"
        },
        "image/vnd.mozilla.apng": {
          "source": "iana"
        },
        "image/vnd.ms-modi": {
          "source": "iana",
          "extensions": ["mdi"]
        },
        "image/vnd.ms-photo": {
          "source": "apache",
          "extensions": ["wdp"]
        },
        "image/vnd.net-fpx": {
          "source": "iana",
          "extensions": ["npx"]
        },
        "image/vnd.radiance": {
          "source": "iana"
        },
        "image/vnd.sealed.png": {
          "source": "iana"
        },
        "image/vnd.sealedmedia.softseal.gif": {
          "source": "iana"
        },
        "image/vnd.sealedmedia.softseal.jpg": {
          "source": "iana"
        },
        "image/vnd.svf": {
          "source": "iana"
        },
        "image/vnd.tencent.tap": {
          "source": "iana"
        },
        "image/vnd.valve.source.texture": {
          "source": "iana"
        },
        "image/vnd.wap.wbmp": {
          "source": "iana",
          "extensions": ["wbmp"]
        },
        "image/vnd.xiff": {
          "source": "iana",
          "extensions": ["xif"]
        },
        "image/vnd.zbrush.pcx": {
          "source": "iana"
        },
        "image/webp": {
          "source": "apache",
          "extensions": ["webp"]
        },
        "image/wmf": {
          "source": "iana"
        },
        "image/x-3ds": {
          "source": "apache",
          "extensions": ["3ds"]
        },
        "image/x-cmu-raster": {
          "source": "apache",
          "extensions": ["ras"]
        },
        "image/x-cmx": {
          "source": "apache",
          "extensions": ["cmx"]
        },
        "image/x-freehand": {
          "source": "apache",
          "extensions": ["fh", "fhc", "fh4", "fh5", "fh7"]
        },
        "image/x-icon": {
          "source": "apache",
          "compressible": true,
          "extensions": ["ico"]
        },
        "image/x-jng": {
          "source": "nginx",
          "extensions": ["jng"]
        },
        "image/x-mrsid-image": {
          "source": "apache",
          "extensions": ["sid"]
        },
        "image/x-ms-bmp": {
          "source": "nginx",
          "compressible": true,
          "extensions": ["bmp"]
        },
        "image/x-pcx": {
          "source": "apache",
          "extensions": ["pcx"]
        },
        "image/x-pict": {
          "source": "apache",
          "extensions": ["pic", "pct"]
        },
        "image/x-portable-anymap": {
          "source": "apache",
          "extensions": ["pnm"]
        },
        "image/x-portable-bitmap": {
          "source": "apache",
          "extensions": ["pbm"]
        },
        "image/x-portable-graymap": {
          "source": "apache",
          "extensions": ["pgm"]
        },
        "image/x-portable-pixmap": {
          "source": "apache",
          "extensions": ["ppm"]
        },
        "image/x-rgb": {
          "source": "apache",
          "extensions": ["rgb"]
        },
        "image/x-tga": {
          "source": "apache",
          "extensions": ["tga"]
        },
        "image/x-xbitmap": {
          "source": "apache",
          "extensions": ["xbm"]
        },
        "image/x-xcf": {
          "compressible": false
        },
        "image/x-xpixmap": {
          "source": "apache",
          "extensions": ["xpm"]
        },
        "image/x-xwindowdump": {
          "source": "apache",
          "extensions": ["xwd"]
        },
        "message/cpim": {
          "source": "iana"
        },
        "message/delivery-status": {
          "source": "iana"
        },
        "message/disposition-notification": {
          "source": "iana"
        },
        "message/external-body": {
          "source": "iana"
        },
        "message/feedback-report": {
          "source": "iana"
        },
        "message/global": {
          "source": "iana"
        },
        "message/global-delivery-status": {
          "source": "iana"
        },
        "message/global-disposition-notification": {
          "source": "iana"
        },
        "message/global-headers": {
          "source": "iana"
        },
        "message/http": {
          "source": "iana",
          "compressible": false
        },
        "message/imdn+xml": {
          "source": "iana",
          "compressible": true
        },
        "message/news": {
          "source": "iana"
        },
        "message/partial": {
          "source": "iana",
          "compressible": false
        },
        "message/rfc822": {
          "source": "iana",
          "compressible": true,
          "extensions": ["eml", "mime"]
        },
        "message/s-http": {
          "source": "iana"
        },
        "message/sip": {
          "source": "iana"
        },
        "message/sipfrag": {
          "source": "iana"
        },
        "message/tracking-status": {
          "source": "iana"
        },
        "message/vnd.si.simp": {
          "source": "iana"
        },
        "message/vnd.wfa.wsc": {
          "source": "iana"
        },
        "model/3mf": {
          "source": "iana"
        },
        "model/gltf+json": {
          "source": "iana",
          "compressible": true,
          "extensions": ["gltf"]
        },
        "model/gltf-binary": {
          "compressible": true,
          "extensions": ["glb"]
        },
        "model/iges": {
          "source": "iana",
          "compressible": false,
          "extensions": ["igs", "iges"]
        },
        "model/mesh": {
          "source": "iana",
          "compressible": false,
          "extensions": ["msh", "mesh", "silo"]
        },
        "model/vnd.collada+xml": {
          "source": "iana",
          "extensions": ["dae"]
        },
        "model/vnd.dwf": {
          "source": "iana",
          "extensions": ["dwf"]
        },
        "model/vnd.flatland.3dml": {
          "source": "iana"
        },
        "model/vnd.gdl": {
          "source": "iana",
          "extensions": ["gdl"]
        },
        "model/vnd.gs-gdl": {
          "source": "apache"
        },
        "model/vnd.gs.gdl": {
          "source": "iana"
        },
        "model/vnd.gtw": {
          "source": "iana",
          "extensions": ["gtw"]
        },
        "model/vnd.moml+xml": {
          "source": "iana"
        },
        "model/vnd.mts": {
          "source": "iana",
          "extensions": ["mts"]
        },
        "model/vnd.opengex": {
          "source": "iana"
        },
        "model/vnd.parasolid.transmit.binary": {
          "source": "iana"
        },
        "model/vnd.parasolid.transmit.text": {
          "source": "iana"
        },
        "model/vnd.rosette.annotated-data-model": {
          "source": "iana"
        },
        "model/vnd.valve.source.compiled-map": {
          "source": "iana"
        },
        "model/vnd.vtu": {
          "source": "iana",
          "extensions": ["vtu"]
        },
        "model/vrml": {
          "source": "iana",
          "compressible": false,
          "extensions": ["wrl", "vrml"]
        },
        "model/x3d+binary": {
          "source": "apache",
          "compressible": false,
          "extensions": ["x3db", "x3dbz"]
        },
        "model/x3d+fastinfoset": {
          "source": "iana"
        },
        "model/x3d+vrml": {
          "source": "apache",
          "compressible": false,
          "extensions": ["x3dv", "x3dvz"]
        },
        "model/x3d+xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["x3d", "x3dz"]
        },
        "model/x3d-vrml": {
          "source": "iana"
        },
        "multipart/alternative": {
          "source": "iana",
          "compressible": false
        },
        "multipart/appledouble": {
          "source": "iana"
        },
        "multipart/byteranges": {
          "source": "iana"
        },
        "multipart/digest": {
          "source": "iana"
        },
        "multipart/encrypted": {
          "source": "iana",
          "compressible": false
        },
        "multipart/form-data": {
          "source": "iana",
          "compressible": false
        },
        "multipart/header-set": {
          "source": "iana"
        },
        "multipart/mixed": {
          "source": "iana",
          "compressible": false
        },
        "multipart/parallel": {
          "source": "iana"
        },
        "multipart/related": {
          "source": "iana",
          "compressible": false
        },
        "multipart/report": {
          "source": "iana"
        },
        "multipart/signed": {
          "source": "iana",
          "compressible": false
        },
        "multipart/vnd.bint.med-plus": {
          "source": "iana"
        },
        "multipart/voice-message": {
          "source": "iana"
        },
        "multipart/x-mixed-replace": {
          "source": "iana"
        },
        "text/1d-interleaved-parityfec": {
          "source": "iana"
        },
        "text/cache-manifest": {
          "source": "iana",
          "compressible": true,
          "extensions": ["appcache", "manifest"]
        },
        "text/calendar": {
          "source": "iana",
          "extensions": ["ics", "ifb"]
        },
        "text/calender": {
          "compressible": true
        },
        "text/cmd": {
          "compressible": true
        },
        "text/coffeescript": {
          "extensions": ["coffee", "litcoffee"]
        },
        "text/css": {
          "source": "iana",
          "charset": "UTF-8",
          "compressible": true,
          "extensions": ["css"]
        },
        "text/csv": {
          "source": "iana",
          "compressible": true,
          "extensions": ["csv"]
        },
        "text/csv-schema": {
          "source": "iana"
        },
        "text/directory": {
          "source": "iana"
        },
        "text/dns": {
          "source": "iana"
        },
        "text/ecmascript": {
          "source": "iana"
        },
        "text/encaprtp": {
          "source": "iana"
        },
        "text/enriched": {
          "source": "iana"
        },
        "text/fwdred": {
          "source": "iana"
        },
        "text/grammar-ref-list": {
          "source": "iana"
        },
        "text/hjson": {
          "extensions": ["hjson"]
        },
        "text/html": {
          "source": "iana",
          "compressible": true,
          "extensions": ["html", "htm", "shtml"]
        },
        "text/jade": {
          "extensions": ["jade"]
        },
        "text/javascript": {
          "source": "iana",
          "compressible": true
        },
        "text/jcr-cnd": {
          "source": "iana"
        },
        "text/jsx": {
          "compressible": true,
          "extensions": ["jsx"]
        },
        "text/less": {
          "extensions": ["less"]
        },
        "text/markdown": {
          "source": "iana",
          "compressible": true,
          "extensions": ["markdown", "md"]
        },
        "text/mathml": {
          "source": "nginx",
          "extensions": ["mml"]
        },
        "text/mizar": {
          "source": "iana"
        },
        "text/n3": {
          "source": "iana",
          "compressible": true,
          "extensions": ["n3"]
        },
        "text/parameters": {
          "source": "iana"
        },
        "text/parityfec": {
          "source": "iana"
        },
        "text/plain": {
          "source": "iana",
          "compressible": true,
          "extensions": ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
        },
        "text/provenance-notation": {
          "source": "iana"
        },
        "text/prs.fallenstein.rst": {
          "source": "iana"
        },
        "text/prs.lines.tag": {
          "source": "iana",
          "extensions": ["dsc"]
        },
        "text/prs.prop.logic": {
          "source": "iana"
        },
        "text/raptorfec": {
          "source": "iana"
        },
        "text/red": {
          "source": "iana"
        },
        "text/rfc822-headers": {
          "source": "iana"
        },
        "text/richtext": {
          "source": "iana",
          "compressible": true,
          "extensions": ["rtx"]
        },
        "text/rtf": {
          "source": "iana",
          "compressible": true,
          "extensions": ["rtf"]
        },
        "text/rtp-enc-aescm128": {
          "source": "iana"
        },
        "text/rtploopback": {
          "source": "iana"
        },
        "text/rtx": {
          "source": "iana"
        },
        "text/sgml": {
          "source": "iana",
          "extensions": ["sgml", "sgm"]
        },
        "text/slim": {
          "extensions": ["slim", "slm"]
        },
        "text/strings": {
          "source": "iana"
        },
        "text/stylus": {
          "extensions": ["stylus", "styl"]
        },
        "text/t140": {
          "source": "iana"
        },
        "text/tab-separated-values": {
          "source": "iana",
          "compressible": true,
          "extensions": ["tsv"]
        },
        "text/troff": {
          "source": "iana",
          "extensions": ["t", "tr", "roff", "man", "me", "ms"]
        },
        "text/turtle": {
          "source": "iana",
          "extensions": ["ttl"]
        },
        "text/ulpfec": {
          "source": "iana"
        },
        "text/uri-list": {
          "source": "iana",
          "compressible": true,
          "extensions": ["uri", "uris", "urls"]
        },
        "text/vcard": {
          "source": "iana",
          "compressible": true,
          "extensions": ["vcard"]
        },
        "text/vnd.a": {
          "source": "iana"
        },
        "text/vnd.abc": {
          "source": "iana"
        },
        "text/vnd.ascii-art": {
          "source": "iana"
        },
        "text/vnd.curl": {
          "source": "iana",
          "extensions": ["curl"]
        },
        "text/vnd.curl.dcurl": {
          "source": "apache",
          "extensions": ["dcurl"]
        },
        "text/vnd.curl.mcurl": {
          "source": "apache",
          "extensions": ["mcurl"]
        },
        "text/vnd.curl.scurl": {
          "source": "apache",
          "extensions": ["scurl"]
        },
        "text/vnd.debian.copyright": {
          "source": "iana"
        },
        "text/vnd.dmclientscript": {
          "source": "iana"
        },
        "text/vnd.dvb.subtitle": {
          "source": "iana",
          "extensions": ["sub"]
        },
        "text/vnd.esmertec.theme-descriptor": {
          "source": "iana"
        },
        "text/vnd.fly": {
          "source": "iana",
          "extensions": ["fly"]
        },
        "text/vnd.fmi.flexstor": {
          "source": "iana",
          "extensions": ["flx"]
        },
        "text/vnd.graphviz": {
          "source": "iana",
          "extensions": ["gv"]
        },
        "text/vnd.in3d.3dml": {
          "source": "iana",
          "extensions": ["3dml"]
        },
        "text/vnd.in3d.spot": {
          "source": "iana",
          "extensions": ["spot"]
        },
        "text/vnd.iptc.newsml": {
          "source": "iana"
        },
        "text/vnd.iptc.nitf": {
          "source": "iana"
        },
        "text/vnd.latex-z": {
          "source": "iana"
        },
        "text/vnd.motorola.reflex": {
          "source": "iana"
        },
        "text/vnd.ms-mediapackage": {
          "source": "iana"
        },
        "text/vnd.net2phone.commcenter.command": {
          "source": "iana"
        },
        "text/vnd.radisys.msml-basic-layout": {
          "source": "iana"
        },
        "text/vnd.si.uricatalogue": {
          "source": "iana"
        },
        "text/vnd.sun.j2me.app-descriptor": {
          "source": "iana",
          "extensions": ["jad"]
        },
        "text/vnd.trolltech.linguist": {
          "source": "iana"
        },
        "text/vnd.wap.si": {
          "source": "iana"
        },
        "text/vnd.wap.sl": {
          "source": "iana"
        },
        "text/vnd.wap.wml": {
          "source": "iana",
          "extensions": ["wml"]
        },
        "text/vnd.wap.wmlscript": {
          "source": "iana",
          "extensions": ["wmls"]
        },
        "text/vtt": {
          "charset": "UTF-8",
          "compressible": true,
          "extensions": ["vtt"]
        },
        "text/x-asm": {
          "source": "apache",
          "extensions": ["s", "asm"]
        },
        "text/x-c": {
          "source": "apache",
          "extensions": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
        },
        "text/x-component": {
          "source": "nginx",
          "extensions": ["htc"]
        },
        "text/x-fortran": {
          "source": "apache",
          "extensions": ["f", "for", "f77", "f90"]
        },
        "text/x-gwt-rpc": {
          "compressible": true
        },
        "text/x-handlebars-template": {
          "extensions": ["hbs"]
        },
        "text/x-java-source": {
          "source": "apache",
          "extensions": ["java"]
        },
        "text/x-jquery-tmpl": {
          "compressible": true
        },
        "text/x-lua": {
          "extensions": ["lua"]
        },
        "text/x-markdown": {
          "compressible": true,
          "extensions": ["mkd"]
        },
        "text/x-nfo": {
          "source": "apache",
          "extensions": ["nfo"]
        },
        "text/x-opml": {
          "source": "apache",
          "extensions": ["opml"]
        },
        "text/x-org": {
          "compressible": true,
          "extensions": ["org"]
        },
        "text/x-pascal": {
          "source": "apache",
          "extensions": ["p", "pas"]
        },
        "text/x-processing": {
          "compressible": true,
          "extensions": ["pde"]
        },
        "text/x-sass": {
          "extensions": ["sass"]
        },
        "text/x-scss": {
          "extensions": ["scss"]
        },
        "text/x-setext": {
          "source": "apache",
          "extensions": ["etx"]
        },
        "text/x-sfv": {
          "source": "apache",
          "extensions": ["sfv"]
        },
        "text/x-suse-ymp": {
          "compressible": true,
          "extensions": ["ymp"]
        },
        "text/x-uuencode": {
          "source": "apache",
          "extensions": ["uu"]
        },
        "text/x-vcalendar": {
          "source": "apache",
          "extensions": ["vcs"]
        },
        "text/x-vcard": {
          "source": "apache",
          "extensions": ["vcf"]
        },
        "text/xml": {
          "source": "iana",
          "compressible": true,
          "extensions": ["xml"]
        },
        "text/xml-external-parsed-entity": {
          "source": "iana"
        },
        "text/yaml": {
          "extensions": ["yaml", "yml"]
        },
        "video/1d-interleaved-parityfec": {
          "source": "iana"
        },
        "video/3gpp": {
          "source": "iana",
          "extensions": ["3gp", "3gpp"]
        },
        "video/3gpp-tt": {
          "source": "iana"
        },
        "video/3gpp2": {
          "source": "iana",
          "extensions": ["3g2"]
        },
        "video/bmpeg": {
          "source": "iana"
        },
        "video/bt656": {
          "source": "iana"
        },
        "video/celb": {
          "source": "iana"
        },
        "video/dv": {
          "source": "iana"
        },
        "video/encaprtp": {
          "source": "iana"
        },
        "video/h261": {
          "source": "iana",
          "extensions": ["h261"]
        },
        "video/h263": {
          "source": "iana",
          "extensions": ["h263"]
        },
        "video/h263-1998": {
          "source": "iana"
        },
        "video/h263-2000": {
          "source": "iana"
        },
        "video/h264": {
          "source": "iana",
          "extensions": ["h264"]
        },
        "video/h264-rcdo": {
          "source": "iana"
        },
        "video/h264-svc": {
          "source": "iana"
        },
        "video/h265": {
          "source": "iana"
        },
        "video/iso.segment": {
          "source": "iana"
        },
        "video/jpeg": {
          "source": "iana",
          "extensions": ["jpgv"]
        },
        "video/jpeg2000": {
          "source": "iana"
        },
        "video/jpm": {
          "source": "apache",
          "extensions": ["jpm", "jpgm"]
        },
        "video/mj2": {
          "source": "iana",
          "extensions": ["mj2", "mjp2"]
        },
        "video/mp1s": {
          "source": "iana"
        },
        "video/mp2p": {
          "source": "iana"
        },
        "video/mp2t": {
          "source": "iana",
          "extensions": ["ts"]
        },
        "video/mp4": {
          "source": "iana",
          "compressible": false,
          "extensions": ["mp4", "mp4v", "mpg4"]
        },
        "video/mp4v-es": {
          "source": "iana"
        },
        "video/mpeg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["mpeg", "mpg", "mpe", "m1v", "m2v"]
        },
        "video/mpeg4-generic": {
          "source": "iana"
        },
        "video/mpv": {
          "source": "iana"
        },
        "video/nv": {
          "source": "iana"
        },
        "video/ogg": {
          "source": "iana",
          "compressible": false,
          "extensions": ["ogv"]
        },
        "video/parityfec": {
          "source": "iana"
        },
        "video/pointer": {
          "source": "iana"
        },
        "video/quicktime": {
          "source": "iana",
          "compressible": false,
          "extensions": ["qt", "mov"]
        },
        "video/raptorfec": {
          "source": "iana"
        },
        "video/raw": {
          "source": "iana"
        },
        "video/rtp-enc-aescm128": {
          "source": "iana"
        },
        "video/rtploopback": {
          "source": "iana"
        },
        "video/rtx": {
          "source": "iana"
        },
        "video/smpte292m": {
          "source": "iana"
        },
        "video/ulpfec": {
          "source": "iana"
        },
        "video/vc1": {
          "source": "iana"
        },
        "video/vnd.cctv": {
          "source": "iana"
        },
        "video/vnd.dece.hd": {
          "source": "iana",
          "extensions": ["uvh", "uvvh"]
        },
        "video/vnd.dece.mobile": {
          "source": "iana",
          "extensions": ["uvm", "uvvm"]
        },
        "video/vnd.dece.mp4": {
          "source": "iana"
        },
        "video/vnd.dece.pd": {
          "source": "iana",
          "extensions": ["uvp", "uvvp"]
        },
        "video/vnd.dece.sd": {
          "source": "iana",
          "extensions": ["uvs", "uvvs"]
        },
        "video/vnd.dece.video": {
          "source": "iana",
          "extensions": ["uvv", "uvvv"]
        },
        "video/vnd.directv.mpeg": {
          "source": "iana"
        },
        "video/vnd.directv.mpeg-tts": {
          "source": "iana"
        },
        "video/vnd.dlna.mpeg-tts": {
          "source": "iana"
        },
        "video/vnd.dvb.file": {
          "source": "iana",
          "extensions": ["dvb"]
        },
        "video/vnd.fvt": {
          "source": "iana",
          "extensions": ["fvt"]
        },
        "video/vnd.hns.video": {
          "source": "iana"
        },
        "video/vnd.iptvforum.1dparityfec-1010": {
          "source": "iana"
        },
        "video/vnd.iptvforum.1dparityfec-2005": {
          "source": "iana"
        },
        "video/vnd.iptvforum.2dparityfec-1010": {
          "source": "iana"
        },
        "video/vnd.iptvforum.2dparityfec-2005": {
          "source": "iana"
        },
        "video/vnd.iptvforum.ttsavc": {
          "source": "iana"
        },
        "video/vnd.iptvforum.ttsmpeg2": {
          "source": "iana"
        },
        "video/vnd.motorola.video": {
          "source": "iana"
        },
        "video/vnd.motorola.videop": {
          "source": "iana"
        },
        "video/vnd.mpegurl": {
          "source": "iana",
          "extensions": ["mxu", "m4u"]
        },
        "video/vnd.ms-playready.media.pyv": {
          "source": "iana",
          "extensions": ["pyv"]
        },
        "video/vnd.nokia.interleaved-multimedia": {
          "source": "iana"
        },
        "video/vnd.nokia.videovoip": {
          "source": "iana"
        },
        "video/vnd.objectvideo": {
          "source": "iana"
        },
        "video/vnd.radgamettools.bink": {
          "source": "iana"
        },
        "video/vnd.radgamettools.smacker": {
          "source": "iana"
        },
        "video/vnd.sealed.mpeg1": {
          "source": "iana"
        },
        "video/vnd.sealed.mpeg4": {
          "source": "iana"
        },
        "video/vnd.sealed.swf": {
          "source": "iana"
        },
        "video/vnd.sealedmedia.softseal.mov": {
          "source": "iana"
        },
        "video/vnd.uvvu.mp4": {
          "source": "iana",
          "extensions": ["uvu", "uvvu"]
        },
        "video/vnd.vivo": {
          "source": "iana",
          "extensions": ["viv"]
        },
        "video/vp8": {
          "source": "iana"
        },
        "video/webm": {
          "source": "apache",
          "compressible": false,
          "extensions": ["webm"]
        },
        "video/x-f4v": {
          "source": "apache",
          "extensions": ["f4v"]
        },
        "video/x-fli": {
          "source": "apache",
          "extensions": ["fli"]
        },
        "video/x-flv": {
          "source": "apache",
          "compressible": false,
          "extensions": ["flv"]
        },
        "video/x-m4v": {
          "source": "apache",
          "extensions": ["m4v"]
        },
        "video/x-matroska": {
          "source": "apache",
          "compressible": false,
          "extensions": ["mkv", "mk3d", "mks"]
        },
        "video/x-mng": {
          "source": "apache",
          "extensions": ["mng"]
        },
        "video/x-ms-asf": {
          "source": "apache",
          "extensions": ["asf", "asx"]
        },
        "video/x-ms-vob": {
          "source": "apache",
          "extensions": ["vob"]
        },
        "video/x-ms-wm": {
          "source": "apache",
          "extensions": ["wm"]
        },
        "video/x-ms-wmv": {
          "source": "apache",
          "compressible": false,
          "extensions": ["wmv"]
        },
        "video/x-ms-wmx": {
          "source": "apache",
          "extensions": ["wmx"]
        },
        "video/x-ms-wvx": {
          "source": "apache",
          "extensions": ["wvx"]
        },
        "video/x-msvideo": {
          "source": "apache",
          "extensions": ["avi"]
        },
        "video/x-sgi-movie": {
          "source": "apache",
          "extensions": ["movie"]
        },
        "video/x-smv": {
          "source": "apache",
          "extensions": ["smv"]
        },
        "x-conference/x-cooltalk": {
          "source": "apache",
          "extensions": ["ice"]
        },
        "x-shader/x-fragment": {
          "compressible": true
        },
        "x-shader/x-vertex": {
          "compressible": true
        }
      };
    }, {}], 11: [function (require, module, exports) {
      /*!
       * mime-db
       * Copyright(c) 2014 Jonathan Ong
       * MIT Licensed
       */

      /**
       * Module exports.
       */

      module.exports = require('./db.json');
    }, { "./db.json": 10 }], 12: [function (require, module, exports) {
      /*!
       * mime-types
       * Copyright(c) 2014 Jonathan Ong
       * Copyright(c) 2015 Douglas Christopher Wilson
       * MIT Licensed
       */

      'use strict';

      /**
       * Module dependencies.
       * @private
       */

      var db = require('mime-db');
      var extname = require('path').extname;

      /**
       * Module variables.
       * @private
       */

      var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
      var TEXT_TYPE_REGEXP = /^text\//i;

      /**
       * Module exports.
       * @public
       */

      exports.charset = charset;
      exports.charsets = { lookup: charset };
      exports.contentType = contentType;
      exports.extension = extension;
      exports.extensions = Object.create(null);
      exports.lookup = lookup;
      exports.types = Object.create(null);

      // Populate the extensions/types maps
      populateMaps(exports.extensions, exports.types);

      /**
       * Get the default charset for a MIME type.
       *
       * @param {string} type
       * @return {boolean|string}
       */

      function charset(type) {
        if (!type || typeof type !== 'string') {
          return false;
        }

        // TODO: use media-typer
        var match = EXTRACT_TYPE_REGEXP.exec(type);
        var mime = match && db[match[1].toLowerCase()];

        if (mime && mime.charset) {
          return mime.charset;
        }

        // default text/* to utf-8
        if (match && TEXT_TYPE_REGEXP.test(match[1])) {
          return 'UTF-8';
        }

        return false;
      }

      /**
       * Create a full Content-Type header given a MIME type or extension.
       *
       * @param {string} str
       * @return {boolean|string}
       */

      function contentType(str) {
        // TODO: should this even be in this module?
        if (!str || typeof str !== 'string') {
          return false;
        }

        var mime = str.indexOf('/') === -1 ? exports.lookup(str) : str;

        if (!mime) {
          return false;
        }

        // TODO: use content-type or other module
        if (mime.indexOf('charset') === -1) {
          var charset = exports.charset(mime);
          if (charset) mime += '; charset=' + charset.toLowerCase();
        }

        return mime;
      }

      /**
       * Get the default extension for a MIME type.
       *
       * @param {string} type
       * @return {boolean|string}
       */

      function extension(type) {
        if (!type || typeof type !== 'string') {
          return false;
        }

        // TODO: use media-typer
        var match = EXTRACT_TYPE_REGEXP.exec(type);

        // get extensions
        var exts = match && exports.extensions[match[1].toLowerCase()];

        if (!exts || !exts.length) {
          return false;
        }

        return exts[0];
      }

      /**
       * Lookup the MIME type for a file path/extension.
       *
       * @param {string} path
       * @return {boolean|string}
       */

      function lookup(path) {
        if (!path || typeof path !== 'string') {
          return false;
        }

        // get the extension ("ext" or ".ext" or full path)
        var extension = extname('x.' + path).toLowerCase().substr(1);

        if (!extension) {
          return false;
        }

        return exports.types[extension] || false;
      }

      /**
       * Populate the extensions and types maps.
       * @private
       */

      function populateMaps(extensions, types) {
        // source preference (least -> most)
        var preference = ['nginx', 'apache', undefined, 'iana'];

        Object.keys(db).forEach(function forEachMimeType(type) {
          var mime = db[type];
          var exts = mime.extensions;

          if (!exts || !exts.length) {
            return;
          }

          // mime -> extensions
          extensions[type] = exts;

          // extension -> mime
          for (var i = 0; i < exts.length; i++) {
            var extension = exts[i];

            if (types[extension]) {
              var from = preference.indexOf(db[types[extension]].source);
              var to = preference.indexOf(mime.source);

              if (types[extension] !== 'application/octet-stream' && (from > to || from === to && types[extension].substr(0, 12) === 'application/')) {
                // skip the remapping
                continue;
              }
            }

            // set the extension -> mime
            types[extension] = type;
          }
        });
      }
    }, { "mime-db": 11, "path": 5 }], 13: [function (require, module, exports) {
      var trim = require('trim'),
          forEach = require('for-each'),
          isArray = function isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };

      module.exports = function (headers) {
        if (!headers) return {};

        var result = {};

        forEach(trim(headers).split('\n'), function (row) {
          var index = row.indexOf(':'),
              key = trim(row.slice(0, index)).toLowerCase(),
              value = trim(row.slice(index + 1));

          if (typeof result[key] === 'undefined') {
            result[key] = value;
          } else if (isArray(result[key])) {
            result[key].push(value);
          } else {
            result[key] = [result[key], value];
          }
        });

        return result;
      };
    }, { "for-each": 7, "trim": 20 }], 14: [function (require, module, exports) {
      'use strict';

      var strictUriEncode = require('strict-uri-encode');

      exports.extract = function (str) {
        return str.split('?')[1] || '';
      };

      exports.parse = function (str) {
        if (typeof str !== 'string') {
          return {};
        }

        str = str.trim().replace(/^(\?|#|&)/, '');

        if (!str) {
          return {};
        }

        return str.split('&').reduce(function (ret, param) {
          var parts = param.replace(/\+/g, ' ').split('=');
          // Firefox (pre 40) decodes `%3D` to `=`
          // https://github.com/sindresorhus/query-string/pull/37
          var key = parts.shift();
          var val = parts.length > 0 ? parts.join('=') : undefined;

          key = decodeURIComponent(key);

          // missing `=` should be `null`:
          // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
          val = val === undefined ? null : decodeURIComponent(val);

          if (!ret.hasOwnProperty(key)) {
            ret[key] = val;
          } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
          } else {
            ret[key] = [ret[key], val];
          }

          return ret;
        }, {});
      };

      exports.stringify = function (obj) {
        return obj ? Object.keys(obj).sort().map(function (key) {
          var val = obj[key];

          if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
              return strictUriEncode(key) + '=' + strictUriEncode(val2);
            }).join('&');
          }

          return strictUriEncode(key) + '=' + strictUriEncode(val);
        }).filter(function (x) {
          return x.length > 0;
        }).join('&') : '';
      };
    }, { "strict-uri-encode": 15 }], 15: [function (require, module, exports) {
      'use strict';

      module.exports = function (str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
          return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
      };
    }, {}], 16: [function (require, module, exports) {
      module.exports = {
        "windows-amd64": {
          "archive": "swarm-windows-amd64-1.6.7.exe",
          "binaryMD5": "c2d827dc4553d9b91a7d6c1d5a6140fd",
          "archiveMD5": "059196d21548060a18a12e17cc0ee59a"
        },
        "linux-amd64": {
          "archive": "swarm-linux-amd64-1.6.7",
          "binaryMD5": "85002d79b8ebc2d2f2f10fb198636a81",
          "archiveMD5": "3e8874299ab8c0e3043d70ebb6673879"
        },
        "linux-386": {
          "archive": "swarm-linux-386-1.6.7",
          "binaryMD5": "35bc2ab976f60f96a2cede117e0df19d",
          "archiveMD5": "7868a86c9cbdf8ac7ac2e5682b4ce40f"
        },
        "darwin-amd64": {
          "archive": "swarm-darwin-amd64-1.6.7",
          "binaryMD5": "c499b186645229260dd6ab685dd58f07",
          "archiveMD5": "0794d111e5018eac3b657bcb29851121"
        },
        "linux-arm5": {
          "archive": "swarm-linux-arm5-1.6.7",
          "binaryMD5": "516fcd85246c905529442cd9b689c12f",
          "archiveMD5": "47312708d417cb196b07ba0af1d3abb4"
        },
        "linux-arm6": {
          "archive": "swarm-linux-arm6-1.6.7",
          "binaryMD5": "82ff7bdbe388b4a190f4101c5150d3b4",
          "archiveMD5": "350276de7bb175a15c314cfc4cb7f8fd"
        },
        "linux-mips": {
          "archive": "swarm-linux-mips-1.6.7",
          "binaryMD5": "e1e95280441c0ca35633927792ef5317",
          "archiveMD5": "8fb4b64e94cd73aa718db787b9d4c53e"
        },
        "linux-arm7": {
          "archive": "swarm-linux-arm7-1.6.7",
          "binaryMD5": "bfc0b4d1c86d8a975af052fc7854bdd3",
          "archiveMD5": "4378641d8e1e1fbb947f941c8fca8613"
        },
        "linux-arm64": {
          "archive": "swarm-linux-arm64-1.6.7",
          "binaryMD5": "bbac21a6c6fa8208f67ca4123d3f948a",
          "archiveMD5": "4e503160327c5fbcca0414f17c54e5ee"
        },
        "linux-mipsle": {
          "archive": "swarm-linux-mipsle-1.6.7",
          "binaryMD5": "a82f191b2f9d2c470d0273219c820657",
          "archiveMD5": "3016bdb6d237ae654c0cdf36fe85dc7c"
        },
        "windows-386": {
          "archive": "swarm-windows-386-1.6.7.exe",
          "binaryMD5": "ce0b34640642e58068ae5a359faef102",
          "archiveMD5": "640aede4da08a3a9d8a6ac0434ba7c0f"
        },
        "linux-mips64": {
          "archive": "swarm-linux-mips64-1.6.7",
          "binaryMD5": "9da967664f384817adb5083fd1ffe8f1",
          "archiveMD5": "357a33be470f8f89ba2619957a08deff"
        },
        "linux-mips64le": {
          "archive": "swarm-linux-mips64le-1.6.7",
          "binaryMD5": "ec1abcf7b216e87645ec83954d8344cd",
          "archiveMD5": "a81fd0158190d99813c738ffa4f87627"
        }
      };
    }, {}], 17: [function (require, module, exports) {
      var unavailable = function unavailable() {
        throw "This swarm.js function isn't available on the browser.";
      };

      var fsp = { readFile: unavailable };
      var files = { download: unavailable, safeDownloadArchived: unavailable, directoryTree: unavailable };
      var os = { platform: unavailable, arch: unavailable };
      var path = { join: unavailable, slice: unavailable };
      var child_process = { spawn: unavailable };
      var swarm = require("./swarm");

      module.exports = swarm({ fsp: fsp, files: files, os: os, path: path, child_process: child_process });
    }, { "./swarm": 19 }], 18: [function (require, module, exports) {
      (function (Buffer) {
        var picker = function picker(type) {
          return function () {
            return new Promise(function (resolve, reject) {
              var fileLoader = function fileLoader(e) {
                var directory = {};
                var totalFiles = e.target.files.length;
                var loadedFiles = 0;
                [].map.call(e.target.files, function (file) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    var data = new Buffer(e.target.result);
                    if (type === "directory") {
                      var path = file.webkitRelativePath;
                      directory[path.slice(path.indexOf("/") + 1)] = {
                        type: "text/plain",
                        data: data
                      };
                      if (++loadedFiles === totalFiles) resolve(directory);
                    } else if (type === "file") {
                      var _path = file.webkitRelativePath;
                      resolve({ "type": mimetype.lookup(_path), "data": data });
                    } else {
                      resolve(data);
                    }
                  };
                  reader.readAsArrayBuffer(file);
                });
              };

              var fileInput = void 0;
              if (type === "directory") {
                fileInput = document.createElement("input");
                fileInput.addEventListener("change", fileLoader);
                fileInput.type = "file";
                fileInput.webkitdirectory = true;
                fileInput.mozdirectory = true;
                fileInput.msdirectory = true;
                fileInput.odirectory = true;
                fileInput.directory = true;
              } else {
                fileInput = document.createElement("input");
                fileInput.addEventListener("change", fileLoader);
                fileInput.type = "file";
              };

              var mouseEvent = document.createEvent("MouseEvents");
              mouseEvent.initEvent("click", true, false);
              fileInput.dispatchEvent(mouseEvent);
            });
          };
        };

        module.exports = {
          data: picker("data"),
          file: picker("file"),
          directory: picker("directory")
        };
      }).call(this, require("buffer").Buffer);
    }, { "buffer": 3 }], 19: [function (require, module, exports) {
      var mimetype = require('mime-types');
      var pick = require("./pick.js");
      var request = require("xhr-request-promise");
      var downloadUrl = "http://ethereum-mist.s3.amazonaws.com/swarm/";
      var defaultArchives = require("./../archives/archives.json");
      var Buffer = require("buffer").Buffer;

      // TODO: this is a temporary fix to hide those libraries from the browser. A
      // slightly better long-term solution would be to split this file into two,
      // separating the functions that are used on Node.js from the functions that
      // are used only on the browser.
      module.exports = function (_ref) {
        var fsp = _ref.fsp,
            files = _ref.files,
            os = _ref.os,
            path = _ref.path,
            child_process = _ref.child_process;

        // ∀ a . String -> JSON -> Map String a -o Map String a
        //   Inserts a key/val pair in an object impurely.
        var impureInsert = function impureInsert(key) {
          return function (val) {
            return function (map) {
              return map[key] = val, map;
            };
          };
        };

        // String -> JSON -> Map String JSON
        //   Merges an array of keys and an array of vals into an object.
        var toMap = function toMap(keys) {
          return function (vals) {
            var map = {};
            for (var i = 0, l = keys.length; i < l; ++i) {
              map[keys[i]] = vals[i];
            }return map;
          };
        };

        // ∀ a . Map String a -> Map String a -> Map String a
        //   Merges two maps into one.
        var merge = function merge(a) {
          return function (b) {
            var map = {};
            for (var key in a) {
              map[key] = a[key];
            }for (var _key in b) {
              map[_key] = b[_key];
            }return map;
          };
        };

        // String -> String -> String
        var rawUrl = function rawUrl(swarmUrl) {
          return function (hash) {
            return swarmUrl + "/bzzr:/" + hash;
          };
        };

        // String -> String -> Promise Buffer
        //   Gets the raw contents of a Swarm hash address.
        var downloadData = function downloadData(swarmUrl) {
          return function (hash) {
            return request(rawUrl(swarmUrl)(hash), { responseType: "arraybuffer" }).then(function (arrayBuffer) {
              return new Buffer(arrayBuffer);
            });
          };
        };

        // type Entry = {"type": String, "hash": String}
        // type File = {"type": String, "data": Buffer}

        // String -> String -> Promise (Map String Entry)
        //   Solves the manifest of a Swarm address recursively.
        //   Returns a map from full paths to entries.
        var downloadEntries = function downloadEntries(swarmUrl) {
          return function (hash) {
            var search = function search(hash) {
              return function (path) {
                return function (routes) {
                  // Formats an entry to the Swarm.js type.
                  var format = function format(entry) {
                    return {
                      type: entry.contentType,
                      hash: entry.hash };
                  };

                  // To download a single entry:
                  //   if type is bzz-manifest, go deeper
                  //   if not, add it to the routing table
                  var downloadEntry = function downloadEntry(entry) {
                    if (entry.path === undefined) {
                      return Promise.resolve();
                    } else {
                      return entry.contentType === "application/bzz-manifest+json" ? search(entry.hash)(path + entry.path)(routes) : Promise.resolve(impureInsert(path + entry.path)(format(entry))(routes));
                    }
                  };

                  // Downloads the initial manifest and then each entry.
                  return downloadData(swarmUrl)(hash).then(function (text) {
                    return JSON.parse(text.toString()).entries;
                  }).then(function (entries) {
                    return Promise.all(entries.map(downloadEntry));
                  }).then(function () {
                    return routes;
                  });
                };
              };
            };

            return search(hash)("")({});
          };
        };

        // String -> String -> Promise (Map String String)
        //   Same as `downloadEntries`, but returns only hashes (no types).
        var downloadRoutes = function downloadRoutes(swarmUrl) {
          return function (hash) {
            return downloadEntries(swarmUrl)(hash).then(function (entries) {
              return toMap(Object.keys(entries))(Object.keys(entries).map(function (route) {
                return entries[route].hash;
              }));
            });
          };
        };

        // String -> String -> Promise (Map String File)
        //   Gets the entire directory tree in a Swarm address.
        //   Returns a promise mapping paths to file contents.
        var downloadDirectory = function downloadDirectory(swarmUrl) {
          return function (hash) {
            return downloadEntries(swarmUrl)(hash).then(function (entries) {
              var paths = Object.keys(entries);
              var hashs = paths.map(function (path) {
                return entries[path].hash;
              });
              var types = paths.map(function (path) {
                return entries[path].type;
              });
              var datas = hashs.map(downloadData(swarmUrl));
              var files = function files(datas) {
                return datas.map(function (data, i) {
                  return { type: types[i], data: data };
                });
              };
              return Promise.all(datas).then(function (datas) {
                return toMap(paths)(files(datas));
              });
            });
          };
        };

        // String -> String -> String -> Promise String
        //   Gets the raw contents of a Swarm hash address.
        //   Returns a promise with the downloaded file path.
        var downloadDataToDisk = function downloadDataToDisk(swarmUrl) {
          return function (hash) {
            return function (filePath) {
              return files.download(rawUrl(swarmUrl)(hash))(filePath);
            };
          };
        };

        // String -> String -> String -> Promise (Map String String)
        //   Gets the entire directory tree in a Swarm address.
        //   Returns a promise mapping paths to file contents.
        var downloadDirectoryToDisk = function downloadDirectoryToDisk(swarmUrl) {
          return function (hash) {
            return function (dirPath) {
              return downloadRoutes(swarmUrl)(hash).then(function (routingTable) {
                var downloads = [];
                for (var route in routingTable) {
                  if (route.length > 0) {
                    var filePath = path.join(dirPath, route);
                    downloads.push(downloadDataToDisk(swarmUrl)(routingTable[route])(filePath));
                  };
                };
                return Promise.all(downloads).then(function () {
                  return dirPath;
                });
              });
            };
          };
        };

        // String -> Buffer -> Promise String
        //   Uploads raw data to Swarm.
        //   Returns a promise with the uploaded hash.
        var uploadData = function uploadData(swarmUrl) {
          return function (data) {
            return request(swarmUrl + "/bzzr:/", {
              body: typeof data === "string" ? new Buffer(data) : data,
              method: "POST" });
          };
        };

        // String -> String -> String -> File -> Promise String
        //   Uploads a file to the Swarm manifest at a given hash, under a specific
        //   route. Returns a promise containing the uploaded hash.
        //   FIXME: for some reasons Swarm-Gateways is sometimes returning
        //   error 404 (bad request), so we retry up to 3 times. Why?
        var uploadToManifest = function uploadToManifest(swarmUrl) {
          return function (hash) {
            return function (route) {
              return function (file) {
                var attempt = function attempt(n) {
                  var slashRoute = route[0] === "/" ? route : "/" + route;
                  var url = swarmUrl + "/bzz:/" + hash + slashRoute;
                  var opt = {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: file.data };
                  return request(url, opt).catch(function (e) {
                    return n > 0 && attempt(n - 1);
                  });
                };
                return attempt(3);
              };
            };
          };
        };

        // String -> {type: String, data: Buffer} -> Promise String
        var uploadFile = function uploadFile(swarmUrl) {
          return function (file) {
            return uploadDirectory(swarmUrl)({ "": file });
          };
        };

        // String -> String -> Promise String
        var uploadFileFromDisk = function uploadFileFromDisk(swarmUrl) {
          return function (filePath) {
            return fsp.readFile(filePath).then(function (data) {
              return uploadFile(swarmUrl)({ type: mimetype.lookup(filePath), data: data });
            });
          };
        };

        // String -> Map String File -> Promise String
        //   Uploads a directory to Swarm. The directory is
        //   represented as a map of routes and files.
        //   A default path is encoded by having a "" route.
        var uploadDirectory = function uploadDirectory(swarmUrl) {
          return function (directory) {
            return uploadData(swarmUrl)("{}").then(function (hash) {
              var uploadRoute = function uploadRoute(route) {
                return function (hash) {
                  return uploadToManifest(swarmUrl)(hash)(route)(directory[route]);
                };
              };
              var uploadToHash = function uploadToHash(hash, route) {
                return hash.then(uploadRoute(route));
              };
              return Object.keys(directory).reduce(uploadToHash, Promise.resolve(hash));
            });
          };
        };

        // String -> Promise String
        var uploadDataFromDisk = function uploadDataFromDisk(swarmUrl) {
          return function (filePath) {
            return fsp.readFile(filePath).then(uploadData(swarmUrl));
          };
        };

        // String -> Nullable String -> String -> Promise String
        var uploadDirectoryFromDisk = function uploadDirectoryFromDisk(swarmUrl) {
          return function (defaultPath) {
            return function (dirPath) {
              return files.directoryTree(dirPath).then(function (fullPaths) {
                return Promise.all(fullPaths.map(function (path) {
                  return fsp.readFile(path);
                })).then(function (datas) {
                  var paths = fullPaths.map(function (path) {
                    return path.slice(dirPath.length);
                  });
                  var types = fullPaths.map(function (path) {
                    return mimetype.lookup(path) || "text/plain";
                  });
                  return toMap(paths)(datas.map(function (data, i) {
                    return { type: types[i], data: data };
                  }));
                });
              }).then(function (directory) {
                return merge(defaultPath ? { "": directory[defaultPath] } : {})(directory);
              }).then(uploadDirectory(swarmUrl));
            };
          };
        };

        // String -> UploadInfo -> Promise String
        //   Simplified multi-type upload which calls the correct
        //   one based on the type of the argument given.
        var _upload = function _upload(swarmUrl) {
          return function (arg) {
            // Upload raw data from browser
            if (arg.pick === "data") {
              return pick.data().then(uploadData(swarmUrl));

              // Upload a file from browser
            } else if (arg.pick === "file") {
              return pick.file().then(uploadFile(swarmUrl));

              // Upload a directory from browser
            } else if (arg.pick === "directory") {
              return pick.directory().then(uploadDirectory(swarmUrl));

              // Upload directory/file from disk
            } else if (arg.path) {
              switch (arg.kind) {
                case "data":
                  return uploadDataFromDisk(swarmUrl)(arg.path);
                case "file":
                  return uploadFileFromDisk(swarmUrl)(arg.path);
                case "directory":
                  return uploadDirectoryFromDisk(swarmUrl)(arg.defaultFile)(arg.path);
              };

              // Upload UTF-8 string
            } else if (typeof arg === "string") {
              return uploadData(swarmUrl)(new Buffer(arg));

              // Upload raw data (buffer)
            } else if (arg.length) {
              return uploadData(swarmUrl)(arg);

              // Upload directory with JSON
            } else if (arg instanceof Object) {
              return uploadDirectory(swarmUrl)(arg);
            }

            return Promise.reject(new Error("Bad arguments"));
          };
        };

        // String -> String -> Nullable String -> Promise (String | Buffer | Map String Buffer)
        //   Simplified multi-type download which calls the correct function based on
        //   the type of the argument given, and on whether the Swwarm address has a
        //   directory or a file.
        var _download = function _download(swarmUrl) {
          return function (hash) {
            return function (path) {
              return isDirectory(swarmUrl)(hash).then(function (isDir) {
                if (isDir) {
                  return path ? downloadDirectoryToDisk(swarmUrl)(hash)(path) : downloadDirectory(swarmUrl)(hash);
                } else {
                  return path ? downloadDataToDisk(swarmUrl)(hash)(path) : downloadData(swarmUrl)(hash);
                }
              });
            };
          };
        };

        // String -> Promise String
        //   Downloads the Swarm binaries into a path. Returns a promise that only
        //   resolves when the exact Swarm file is there, and verified to be correct.
        //   If it was already there to begin with, skips the download.
        var downloadBinary = function downloadBinary(path, archives) {
          var system = os.platform().replace("win32", "windows") + "-" + (os.arch() === "x64" ? "amd64" : "386");
          var archive = (archives || defaultArchives)[system];
          var archiveUrl = downloadUrl + archive.archive + ".tar.gz";
          var archiveMD5 = archive.archiveMD5;
          var binaryMD5 = archive.binaryMD5;
          return files.safeDownloadArchived(archiveUrl)(archiveMD5)(binaryMD5)(path);
        };

        // type SwarmSetup = {
        //   account : String,
        //   password : String,
        //   dataDir : String,
        //   binPath : String,
        //   ensApi : String,
        //   onDownloadProgress : Number ~> (),
        //   archives : [{
        //     archive: String,
        //     binaryMD5: String,
        //     archiveMD5: String
        //   }]
        // }

        // SwarmSetup ~> Promise Process
        //   Starts the Swarm process.
        var startProcess = function startProcess(swarmSetup) {
          return new Promise(function (resolve, reject) {
            var spawn = child_process.spawn;

            var hasString = function hasString(str) {
              return function (buffer) {
                return ('' + buffer).indexOf(str) !== -1;
              };
            };
            var account = swarmSetup.account,
                password = swarmSetup.password,
                dataDir = swarmSetup.dataDir,
                ensApi = swarmSetup.ensApi,
                privateKey = swarmSetup.privateKey;

            var STARTUP_TIMEOUT_SECS = 3;
            var WAITING_PASSWORD = 0;
            var STARTING = 1;
            var LISTENING = 2;
            var PASSWORD_PROMPT_HOOK = "Passphrase";
            var LISTENING_HOOK = "Swarm http proxy started";

            var state = WAITING_PASSWORD;

            var swarmProcess = spawn(swarmSetup.binPath, ['--bzzaccount', account || privateKey, '--datadir', dataDir, '--ens-api', ensApi]);

            var handleProcessOutput = function handleProcessOutput(data) {
              if (state === WAITING_PASSWORD && hasString(PASSWORD_PROMPT_HOOK)(data)) {
                setTimeout(function () {
                  state = STARTING;
                  swarmProcess.stdin.write(password + '\n');
                }, 500);
              } else if (hasString(LISTENING_HOOK)(data)) {
                state = LISTENING;
                clearTimeout(timeout);
                resolve(swarmProcess);
              }
            };

            swarmProcess.stdout.on('data', handleProcessOutput);
            swarmProcess.stderr.on('data', handleProcessOutput);
            //swarmProcess.on('close', () => setTimeout(restart, 2000));

            var restart = function restart() {
              return startProcess(swarmSetup).then(resolve).catch(reject);
            };
            var error = function error() {
              return reject(new Error("Couldn't start swarm process."));
            };
            var timeout = setTimeout(error, 20000);
          });
        };

        // Process ~> Promise ()
        //   Stops the Swarm process.
        var stopProcess = function stopProcess(process) {
          return new Promise(function (resolve, reject) {
            process.stderr.removeAllListeners('data');
            process.stdout.removeAllListeners('data');
            process.stdin.removeAllListeners('error');
            process.removeAllListeners('error');
            process.removeAllListeners('exit');
            process.kill('SIGINT');

            var killTimeout = setTimeout(function () {
              return process.kill('SIGKILL');
            }, 8000);

            process.once('close', function () {
              clearTimeout(killTimeout);
              resolve();
            });
          });
        };

        // SwarmSetup -> (SwarmAPI -> Promise ()) -> Promise ()
        //   Receives a Swarm configuration object and a callback function. It then
        //   checks if a local Swarm node is running. If no local Swarm is found, it
        //   downloads the Swarm binaries to the dataDir (if not there), checksums,
        //   starts the Swarm process and calls the callback function with an API
        //   object using the local node. That callback must return a promise which
        //   will resolve when it is done using the API, so that this function can
        //   close the Swarm process properly. Returns a promise that resolves when the
        //   user is done with the API and the Swarm process is closed.
        //   TODO: check if Swarm process is already running (improve `isAvailable`)
        var local = function local(swarmSetup) {
          return function (useAPI) {
            return _isAvailable("http://localhost:8500").then(function (isAvailable) {
              return isAvailable ? useAPI(at("http://localhost:8500")).then(function () {}) : downloadBinary(swarmSetup.binPath, swarmSetup.archives).onData(function (data) {
                return (swarmSetup.onProgress || function () {})(data.length);
              }).then(function () {
                return startProcess(swarmSetup);
              }).then(function (process) {
                return useAPI(at("http://localhost:8500")).then(function () {
                  return process;
                });
              }).then(stopProcess);
            });
          };
        };

        // String ~> Promise Bool
        //   Returns true if Swarm is available on `url`.
        //   Perfoms a test upload to determine that.
        //   TODO: improve this?
        var _isAvailable = function _isAvailable(swarmUrl) {
          var testFile = "test";
          var testHash = "c9a99c7d326dcc6316f32fe2625b311f6dc49a175e6877681ded93137d3569e7";
          return uploadData(swarmUrl)(testFile).then(function (hash) {
            return hash === testHash;
          }).catch(function () {
            return false;
          });
        };

        // String -> String ~> Promise Bool
        //   Returns a Promise which is true if that Swarm address is a directory.
        //   Determines that by checking that it (i) is a JSON, (ii) has a .entries.
        //   TODO: improve this?
        var isDirectory = function isDirectory(swarmUrl) {
          return function (hash) {
            return downloadData(swarmUrl)(hash).then(function (data) {
              return !!JSON.parse(data.toString()).entries;
            }).catch(function () {
              return false;
            });
          };
        };

        // Uncurries a function; used to allow the f(x,y,z) style on exports.
        var uncurry = function uncurry(f) {
          return function (a, b, c, d, e) {
            // Hardcoded because efficiency (`arguments` is very slow).
            if (typeof a !== "undefined") f = f(a);
            if (typeof b !== "undefined") f = f(b);
            if (typeof c !== "undefined") f = f(c);
            if (typeof d !== "undefined") f = f(d);
            if (typeof e !== "undefined") f = f(e);
            return f;
          };
        };

        // () -> Promise Bool
        //   Not sure how to mock Swarm to test it properly. Ideas?
        var test = function test() {
          return Promise.resolve(true);
        };

        // String -> SwarmAPI
        //   Fixes the `swarmUrl`, returning an API where you don't have to pass it.
        var at = function at(swarmUrl) {
          return {
            download: function download(hash, path) {
              return _download(swarmUrl)(hash)(path);
            },
            downloadData: uncurry(downloadData(swarmUrl)),
            downloadDataToDisk: uncurry(downloadDataToDisk(swarmUrl)),
            downloadDirectory: uncurry(downloadDirectory(swarmUrl)),
            downloadDirectoryToDisk: uncurry(downloadDirectoryToDisk(swarmUrl)),
            downloadEntries: uncurry(downloadEntries(swarmUrl)),
            downloadRoutes: uncurry(downloadRoutes(swarmUrl)),
            isAvailable: function isAvailable() {
              return _isAvailable(swarmUrl);
            },
            upload: function upload(arg) {
              return _upload(swarmUrl)(arg);
            },
            uploadData: uncurry(uploadData(swarmUrl)),
            uploadFile: uncurry(uploadFile(swarmUrl)),
            uploadFileFromDisk: uncurry(uploadFile(swarmUrl)),
            uploadDataFromDisk: uncurry(uploadDataFromDisk(swarmUrl)),
            uploadDirectory: uncurry(uploadDirectory(swarmUrl)),
            uploadDirectoryFromDisk: uncurry(uploadDirectoryFromDisk(swarmUrl)),
            uploadToManifest: uncurry(uploadToManifest(swarmUrl)),
            pick: pick
          };
        };

        return {
          at: at,
          local: local,
          download: _download,
          downloadBinary: downloadBinary,
          downloadData: downloadData,
          downloadDataToDisk: downloadDataToDisk,
          downloadDirectory: downloadDirectory,
          downloadDirectoryToDisk: downloadDirectoryToDisk,
          downloadEntries: downloadEntries,
          downloadRoutes: downloadRoutes,
          isAvailable: _isAvailable,
          startProcess: startProcess,
          stopProcess: stopProcess,
          upload: _upload,
          uploadData: uploadData,
          uploadDataFromDisk: uploadDataFromDisk,
          uploadFile: uploadFile,
          uploadFileFromDisk: uploadFileFromDisk,
          uploadDirectory: uploadDirectory,
          uploadDirectoryFromDisk: uploadDirectoryFromDisk,
          uploadToManifest: uploadToManifest,
          pick: pick
        };
      };
    }, { "./../archives/archives.json": 16, "./pick.js": 18, "buffer": 3, "mime-types": 12, "xhr-request-promise": 23 }], 20: [function (require, module, exports) {

      exports = module.exports = trim;

      function trim(str) {
        return str.replace(/^\s*|\s*$/g, '');
      }

      exports.left = function (str) {
        return str.replace(/^\s*/, '');
      };

      exports.right = function (str) {
        return str.replace(/\s*$/, '');
      };
    }, {}], 21: [function (require, module, exports) {
      //     Underscore.js 1.8.3
      //     http://underscorejs.org
      //     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
      //     Underscore may be freely distributed under the MIT license.

      (function () {

        // Baseline setup
        // --------------

        // Establish the root object, `window` in the browser, or `exports` on the server.
        var root = this;

        // Save the previous value of the `_` variable.
        var previousUnderscore = root._;

        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype,
            ObjProto = Object.prototype,
            FuncProto = Function.prototype;

        // Create quick reference variables for speed access to core prototypes.
        var push = ArrayProto.push,
            slice = ArrayProto.slice,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;

        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var nativeIsArray = Array.isArray,
            nativeKeys = Object.keys,
            nativeBind = FuncProto.bind,
            nativeCreate = Object.create;

        // Naked function reference for surrogate-prototype-swapping.
        var Ctor = function Ctor() {};

        // Create a safe reference to the Underscore object for use below.
        var _ = function _(obj) {
          if (obj instanceof _) return obj;
          if (!(this instanceof _)) return new _(obj);
          this._wrapped = obj;
        };

        // Export the Underscore object for **Node.js**, with
        // backwards-compatibility for the old `require()` API. If we're in
        // the browser, add `_` as a global object.
        if (typeof exports !== 'undefined') {
          if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
          }
          exports._ = _;
        } else {
          root._ = _;
        }

        // Current version.
        _.VERSION = '1.8.3';

        // Internal function that returns an efficient (for current engines) version
        // of the passed-in callback, to be repeatedly applied in other Underscore
        // functions.
        var optimizeCb = function optimizeCb(func, context, argCount) {
          if (context === void 0) return func;
          switch (argCount == null ? 3 : argCount) {
            case 1:
              return function (value) {
                return func.call(context, value);
              };
            case 2:
              return function (value, other) {
                return func.call(context, value, other);
              };
            case 3:
              return function (value, index, collection) {
                return func.call(context, value, index, collection);
              };
            case 4:
              return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
              };
          }
          return function () {
            return func.apply(context, arguments);
          };
        };

        // A mostly-internal function to generate callbacks that can be applied
        // to each element in a collection, returning the desired result — either
        // identity, an arbitrary callback, a property matcher, or a property accessor.
        var cb = function cb(value, context, argCount) {
          if (value == null) return _.identity;
          if (_.isFunction(value)) return optimizeCb(value, context, argCount);
          if (_.isObject(value)) return _.matcher(value);
          return _.property(value);
        };
        _.iteratee = function (value, context) {
          return cb(value, context, Infinity);
        };

        // An internal function for creating assigner functions.
        var createAssigner = function createAssigner(keysFunc, undefinedOnly) {
          return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
              var source = arguments[index],
                  keys = keysFunc(source),
                  l = keys.length;
              for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
              }
            }
            return obj;
          };
        };

        // An internal function for creating a new object that inherits from another.
        var baseCreate = function baseCreate(prototype) {
          if (!_.isObject(prototype)) return {};
          if (nativeCreate) return nativeCreate(prototype);
          Ctor.prototype = prototype;
          var result = new Ctor();
          Ctor.prototype = null;
          return result;
        };

        var property = function property(key) {
          return function (obj) {
            return obj == null ? void 0 : obj[key];
          };
        };

        // Helper for collection methods to determine whether a collection
        // should be iterated as an array or as an object
        // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
        // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
        var getLength = property('length');
        var isArrayLike = function isArrayLike(collection) {
          var length = getLength(collection);
          return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
        };

        // Collection Functions
        // --------------------

        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles raw objects in addition to array-likes. Treats all
        // sparse array-likes as if they were dense.
        _.each = _.forEach = function (obj, iteratee, context) {
          iteratee = optimizeCb(iteratee, context);
          var i, length;
          if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
              iteratee(obj[i], i, obj);
            }
          } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
              iteratee(obj[keys[i]], keys[i], obj);
            }
          }
          return obj;
        };

        // Return the results of applying the iteratee to each element.
        _.map = _.collect = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length,
              results = Array(length);
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        };

        // Create a reducing function iterating left or right.
        function createReduce(dir) {
          // Optimized iterator function as using arguments.length
          // in the main function will deoptimize the, see #1991.
          function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
              var currentKey = keys ? keys[index] : index;
              memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
          }

          return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // Determine the initial value if none is provided.
            if (arguments.length < 3) {
              memo = obj[keys ? keys[index] : index];
              index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
          };
        }

        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`.
        _.reduce = _.foldl = _.inject = createReduce(1);

        // The right-associative version of reduce, also known as `foldr`.
        _.reduceRight = _.foldr = createReduce(-1);

        // Return the first value which passes a truth test. Aliased as `detect`.
        _.find = _.detect = function (obj, predicate, context) {
          var key;
          if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
          } else {
            key = _.findKey(obj, predicate, context);
          }
          if (key !== void 0 && key !== -1) return obj[key];
        };

        // Return all the elements that pass a truth test.
        // Aliased as `select`.
        _.filter = _.select = function (obj, predicate, context) {
          var results = [];
          predicate = cb(predicate, context);
          _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
          });
          return results;
        };

        // Return all the elements for which a truth test fails.
        _.reject = function (obj, predicate, context) {
          return _.filter(obj, _.negate(cb(predicate)), context);
        };

        // Determine whether all of the elements match a truth test.
        // Aliased as `all`.
        _.every = _.all = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
          }
          return true;
        };

        // Determine if at least one element in the object matches a truth test.
        // Aliased as `any`.
        _.some = _.any = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length;
          for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
          }
          return false;
        };

        // Determine if the array or object contains a given item (using `===`).
        // Aliased as `includes` and `include`.
        _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
          if (!isArrayLike(obj)) obj = _.values(obj);
          if (typeof fromIndex != 'number' || guard) fromIndex = 0;
          return _.indexOf(obj, item, fromIndex) >= 0;
        };

        // Invoke a method (with arguments) on every item in a collection.
        _.invoke = function (obj, method) {
          var args = slice.call(arguments, 2);
          var isFunc = _.isFunction(method);
          return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
          });
        };

        // Convenience version of a common use case of `map`: fetching a property.
        _.pluck = function (obj, key) {
          return _.map(obj, _.property(key));
        };

        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        _.where = function (obj, attrs) {
          return _.filter(obj, _.matcher(attrs));
        };

        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        _.findWhere = function (obj, attrs) {
          return _.find(obj, _.matcher(attrs));
        };

        // Return the maximum element (or element-based computation).
        _.max = function (obj, iteratee, context) {
          var result = -Infinity,
              lastComputed = -Infinity,
              value,
              computed;
          if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value > result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
              computed = iteratee(value, index, list);
              if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                result = value;
                lastComputed = computed;
              }
            });
          }
          return result;
        };

        // Return the minimum element (or element-based computation).
        _.min = function (obj, iteratee, context) {
          var result = Infinity,
              lastComputed = Infinity,
              value,
              computed;
          if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
              value = obj[i];
              if (value < result) {
                result = value;
              }
            }
          } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
              computed = iteratee(value, index, list);
              if (computed < lastComputed || computed === Infinity && result === Infinity) {
                result = value;
                lastComputed = computed;
              }
            });
          }
          return result;
        };

        // Shuffle a collection, using the modern version of the
        // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
        _.shuffle = function (obj) {
          var set = isArrayLike(obj) ? obj : _.values(obj);
          var length = set.length;
          var shuffled = Array(length);
          for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
          }
          return shuffled;
        };

        // Sample **n** random values from a collection.
        // If **n** is not specified, returns a single random element.
        // The internal `guard` argument allows it to work with `map`.
        _.sample = function (obj, n, guard) {
          if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
          }
          return _.shuffle(obj).slice(0, Math.max(0, n));
        };

        // Sort the object's values by a criterion produced by an iteratee.
        _.sortBy = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          return _.pluck(_.map(obj, function (value, index, list) {
            return {
              value: value,
              index: index,
              criteria: iteratee(value, index, list)
            };
          }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
              if (a > b || a === void 0) return 1;
              if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
          }), 'value');
        };

        // An internal function used for aggregate "group by" operations.
        var group = function group(behavior) {
          return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
              var key = iteratee(value, index, obj);
              behavior(result, value, key);
            });
            return result;
          };
        };

        // Groups the object's values by a criterion. Pass either a string attribute
        // to group by, or a function that returns the criterion.
        _.groupBy = group(function (result, value, key) {
          if (_.has(result, key)) result[key].push(value);else result[key] = [value];
        });

        // Indexes the object's values by a criterion, similar to `groupBy`, but for
        // when you know that your index values will be unique.
        _.indexBy = group(function (result, value, key) {
          result[key] = value;
        });

        // Counts instances of an object that group by a certain criterion. Pass
        // either a string attribute to count by, or a function that returns the
        // criterion.
        _.countBy = group(function (result, value, key) {
          if (_.has(result, key)) result[key]++;else result[key] = 1;
        });

        // Safely create a real, live array from anything iterable.
        _.toArray = function (obj) {
          if (!obj) return [];
          if (_.isArray(obj)) return slice.call(obj);
          if (isArrayLike(obj)) return _.map(obj, _.identity);
          return _.values(obj);
        };

        // Return the number of elements in an object.
        _.size = function (obj) {
          if (obj == null) return 0;
          return isArrayLike(obj) ? obj.length : _.keys(obj).length;
        };

        // Split a collection into two arrays: one whose elements all satisfy the given
        // predicate, and one whose elements all do not satisfy the predicate.
        _.partition = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var pass = [],
              fail = [];
          _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
          });
          return [pass, fail];
        };

        // Array Functions
        // ---------------

        // Get the first element of an array. Passing **n** will return the first N
        // values in the array. Aliased as `head` and `take`. The **guard** check
        // allows it to work with `_.map`.
        _.first = _.head = _.take = function (array, n, guard) {
          if (array == null) return void 0;
          if (n == null || guard) return array[0];
          return _.initial(array, array.length - n);
        };

        // Returns everything but the last entry of the array. Especially useful on
        // the arguments object. Passing **n** will return all the values in
        // the array, excluding the last N.
        _.initial = function (array, n, guard) {
          return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
        };

        // Get the last element of an array. Passing **n** will return the last N
        // values in the array.
        _.last = function (array, n, guard) {
          if (array == null) return void 0;
          if (n == null || guard) return array[array.length - 1];
          return _.rest(array, Math.max(0, array.length - n));
        };

        // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
        // Especially useful on the arguments object. Passing an **n** will return
        // the rest N values in the array.
        _.rest = _.tail = _.drop = function (array, n, guard) {
          return slice.call(array, n == null || guard ? 1 : n);
        };

        // Trim out all falsy values from an array.
        _.compact = function (array) {
          return _.filter(array, _.identity);
        };

        // Internal implementation of a recursive `flatten` function.
        var flatten = function flatten(input, shallow, strict, startIndex) {
          var output = [],
              idx = 0;
          for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
              //flatten current level of array or arguments object
              if (!shallow) value = flatten(value, shallow, strict);
              var j = 0,
                  len = value.length;
              output.length += len;
              while (j < len) {
                output[idx++] = value[j++];
              }
            } else if (!strict) {
              output[idx++] = value;
            }
          }
          return output;
        };

        // Flatten out an array, either recursively (by default), or just one level.
        _.flatten = function (array, shallow) {
          return flatten(array, shallow, false);
        };

        // Return a version of the array that does not contain the specified value(s).
        _.without = function (array) {
          return _.difference(array, slice.call(arguments, 1));
        };

        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function (array, isSorted, iteratee, context) {
          if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
          }
          if (iteratee != null) iteratee = cb(iteratee, context);
          var result = [];
          var seen = [];
          for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
              if (!i || seen !== computed) result.push(value);
              seen = computed;
            } else if (iteratee) {
              if (!_.contains(seen, computed)) {
                seen.push(computed);
                result.push(value);
              }
            } else if (!_.contains(result, value)) {
              result.push(value);
            }
          }
          return result;
        };

        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        _.union = function () {
          return _.uniq(flatten(arguments, true, true));
        };

        // Produce an array that contains every item shared between all the
        // passed-in arrays.
        _.intersection = function (array) {
          var result = [];
          var argsLength = arguments.length;
          for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            for (var j = 1; j < argsLength; j++) {
              if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
          }
          return result;
        };

        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        _.difference = function (array) {
          var rest = flatten(arguments, true, true, 1);
          return _.filter(array, function (value) {
            return !_.contains(rest, value);
          });
        };

        // Zip together multiple lists into a single array -- elements that share
        // an index go together.
        _.zip = function () {
          return _.unzip(arguments);
        };

        // Complement of _.zip. Unzip accepts an array of arrays and groups
        // each array's elements on shared indices
        _.unzip = function (array) {
          var length = array && _.max(array, getLength).length || 0;
          var result = Array(length);

          for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
          }
          return result;
        };

        // Converts lists into objects. Pass either a single array of `[key, value]`
        // pairs, or two parallel arrays of the same length -- one of keys, and one of
        // the corresponding values.
        _.object = function (list, values) {
          var result = {};
          for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
              result[list[i]] = values[i];
            } else {
              result[list[i][0]] = list[i][1];
            }
          }
          return result;
        };

        // Generator function to create the findIndex and findLastIndex functions
        function createPredicateIndexFinder(dir) {
          return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
              if (predicate(array[index], index, array)) return index;
            }
            return -1;
          };
        }

        // Returns the first index on an array-like that passes a predicate test
        _.findIndex = createPredicateIndexFinder(1);
        _.findLastIndex = createPredicateIndexFinder(-1);

        // Use a comparator function to figure out the smallest index at which
        // an object should be inserted so as to maintain order. Uses binary search.
        _.sortedIndex = function (array, obj, iteratee, context) {
          iteratee = cb(iteratee, context, 1);
          var value = iteratee(obj);
          var low = 0,
              high = getLength(array);
          while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
          }
          return low;
        };

        // Generator function to create the indexOf and lastIndexOf functions
        function createIndexFinder(dir, predicateFind, sortedIndex) {
          return function (array, item, idx) {
            var i = 0,
                length = getLength(array);
            if (typeof idx == 'number') {
              if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(idx + length, i);
              } else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
              }
            } else if (sortedIndex && idx && length) {
              idx = sortedIndex(array, item);
              return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
              idx = predicateFind(slice.call(array, i, length), _.isNaN);
              return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
              if (array[idx] === item) return idx;
            }
            return -1;
          };
        }

        // Return the position of the first occurrence of an item in an array,
        // or -1 if the item is not included in the array.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
        _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](http://docs.python.org/library/functions.html#range).
        _.range = function (start, stop, step) {
          if (stop == null) {
            stop = start || 0;
            start = 0;
          }
          step = step || 1;

          var length = Math.max(Math.ceil((stop - start) / step), 0);
          var range = Array(length);

          for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
          }

          return range;
        };

        // Function (ahem) Functions
        // ------------------

        // Determines whether to execute a function as a constructor
        // or a normal function with the provided arguments
        var executeBound = function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
          if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
          var self = baseCreate(sourceFunc.prototype);
          var result = sourceFunc.apply(self, args);
          if (_.isObject(result)) return result;
          return self;
        };

        // Create a function bound to a given object (assigning `this`, and arguments,
        // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
        // available.
        _.bind = function (func, context) {
          if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
          if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
          var args = slice.call(arguments, 2);
          var bound = function bound() {
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
          };
          return bound;
        };

        // Partially apply a function by creating a version that has had some of its
        // arguments pre-filled, without changing its dynamic `this` context. _ acts
        // as a placeholder, allowing any combination of arguments to be pre-filled.
        _.partial = function (func) {
          var boundArgs = slice.call(arguments, 1);
          var bound = function bound() {
            var position = 0,
                length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
              args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) {
              args.push(arguments[position++]);
            }return executeBound(func, bound, this, this, args);
          };
          return bound;
        };

        // Bind a number of an object's methods to that object. Remaining arguments
        // are the method names to be bound. Useful for ensuring that all callbacks
        // defined on an object belong to it.
        _.bindAll = function (obj) {
          var i,
              length = arguments.length,
              key;
          if (length <= 1) throw new Error('bindAll must be passed function names');
          for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
          }
          return obj;
        };

        // Memoize an expensive function by storing its results.
        _.memoize = function (func, hasher) {
          var memoize = function memoize(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
          };
          memoize.cache = {};
          return memoize;
        };

        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        _.delay = function (func, wait) {
          var args = slice.call(arguments, 2);
          return setTimeout(function () {
            return func.apply(null, args);
          }, wait);
        };

        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        _.defer = _.partial(_.delay, _, 1);

        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _.throttle = function (func, wait, options) {
          var context, args, result;
          var timeout = null;
          var previous = 0;
          if (!options) options = {};
          var later = function later() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          };
          return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
              previous = now;
              result = func.apply(context, args);
              if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        };

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        _.debounce = function (func, wait, immediate) {
          var timeout, args, context, timestamp, result;

          var later = function later() {
            var last = _.now() - timestamp;

            if (last < wait && last >= 0) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
              }
            }
          };

          return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
              result = func.apply(context, args);
              context = args = null;
            }

            return result;
          };
        };

        // Returns the first function passed as an argument to the second,
        // allowing you to adjust arguments, run code before and after, and
        // conditionally execute the original function.
        _.wrap = function (func, wrapper) {
          return _.partial(wrapper, func);
        };

        // Returns a negated version of the passed-in predicate.
        _.negate = function (predicate) {
          return function () {
            return !predicate.apply(this, arguments);
          };
        };

        // Returns a function that is the composition of a list of functions, each
        // consuming the return value of the function that follows.
        _.compose = function () {
          var args = arguments;
          var start = args.length - 1;
          return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) {
              result = args[i].call(this, result);
            }return result;
          };
        };

        // Returns a function that will only be executed on and after the Nth call.
        _.after = function (times, func) {
          return function () {
            if (--times < 1) {
              return func.apply(this, arguments);
            }
          };
        };

        // Returns a function that will only be executed up to (but not including) the Nth call.
        _.before = function (times, func) {
          var memo;
          return function () {
            if (--times > 0) {
              memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
          };
        };

        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        _.once = _.partial(_.before, 2);

        // Object Functions
        // ----------------

        // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
        var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
        var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

        function collectNonEnumProps(obj, keys) {
          var nonEnumIdx = nonEnumerableProps.length;
          var constructor = obj.constructor;
          var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

          // Constructor is a special case.
          var prop = 'constructor';
          if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

          while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
              keys.push(prop);
            }
          }
        }

        // Retrieve the names of an object's own properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = function (obj) {
          if (!_.isObject(obj)) return [];
          if (nativeKeys) return nativeKeys(obj);
          var keys = [];
          for (var key in obj) {
            if (_.has(obj, key)) keys.push(key);
          } // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        };

        // Retrieve all the property names of an object.
        _.allKeys = function (obj) {
          if (!_.isObject(obj)) return [];
          var keys = [];
          for (var key in obj) {
            keys.push(key);
          } // Ahem, IE < 9.
          if (hasEnumBug) collectNonEnumProps(obj, keys);
          return keys;
        };

        // Retrieve the values of an object's properties.
        _.values = function (obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var values = Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
          }
          return values;
        };

        // Returns the results of applying the iteratee to each element of the object
        // In contrast to _.map it returns an object
        _.mapObject = function (obj, iteratee, context) {
          iteratee = cb(iteratee, context);
          var keys = _.keys(obj),
              length = keys.length,
              results = {},
              currentKey;
          for (var index = 0; index < length; index++) {
            currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
          }
          return results;
        };

        // Convert an object into a list of `[key, value]` pairs.
        _.pairs = function (obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var pairs = Array(length);
          for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
          }
          return pairs;
        };

        // Invert the keys and values of an object. The values must be serializable.
        _.invert = function (obj) {
          var result = {};
          var keys = _.keys(obj);
          for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
          }
          return result;
        };

        // Return a sorted list of the function names available on the object.
        // Aliased as `methods`
        _.functions = _.methods = function (obj) {
          var names = [];
          for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
          }
          return names.sort();
        };

        // Extend a given object with all the properties in passed-in object(s).
        _.extend = createAssigner(_.allKeys);

        // Assigns a given object with all the own properties in the passed-in object(s)
        // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
        _.extendOwn = _.assign = createAssigner(_.keys);

        // Returns the first key on an object that passes a predicate test
        _.findKey = function (obj, predicate, context) {
          predicate = cb(predicate, context);
          var keys = _.keys(obj),
              key;
          for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
          }
        };

        // Return a copy of the object only containing the whitelisted properties.
        _.pick = function (object, oiteratee, context) {
          var result = {},
              obj = object,
              iteratee,
              keys;
          if (obj == null) return result;
          if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
          } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function iteratee(value, key, obj) {
              return key in obj;
            };
            obj = Object(obj);
          }
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
          }
          return result;
        };

        // Return a copy of the object without the blacklisted properties.
        _.omit = function (obj, iteratee, context) {
          if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
          } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function iteratee(value, key) {
              return !_.contains(keys, key);
            };
          }
          return _.pick(obj, iteratee, context);
        };

        // Fill in a given object with default properties.
        _.defaults = createAssigner(_.allKeys, true);

        // Creates an object that inherits from the given prototype object.
        // If additional properties are provided then they will be added to the
        // created object.
        _.create = function (prototype, props) {
          var result = baseCreate(prototype);
          if (props) _.extendOwn(result, props);
          return result;
        };

        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function (obj) {
          if (!_.isObject(obj)) return obj;
          return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };

        // Invokes interceptor with the obj, and then returns obj.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        _.tap = function (obj, interceptor) {
          interceptor(obj);
          return obj;
        };

        // Returns whether an object has a given set of `key:value` pairs.
        _.isMatch = function (object, attrs) {
          var keys = _.keys(attrs),
              length = keys.length;
          if (object == null) return !length;
          var obj = Object(object);
          for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
          }
          return true;
        };

        // Internal recursive comparison function for `isEqual`.
        var eq = function eq(a, b, aStack, bStack) {
          // Identical objects are equal. `0 === -0`, but they aren't identical.
          // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
          if (a === b) return a !== 0 || 1 / a === 1 / b;
          // A strict comparison is necessary because `null == undefined`.
          if (a == null || b == null) return a === b;
          // Unwrap any wrapped objects.
          if (a instanceof _) a = a._wrapped;
          if (b instanceof _) b = b._wrapped;
          // Compare `[[Class]]` names.
          var className = toString.call(a);
          if (className !== toString.call(b)) return false;
          switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
              // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
              // equivalent to `new String("5")`.
              return '' + a === '' + b;
            case '[object Number]':
              // `NaN`s are equivalent, but non-reflexive.
              // Object(NaN) is equivalent to NaN
              if (+a !== +a) return +b !== +b;
              // An `egal` comparison is performed for other numeric values.
              return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
              // Coerce dates and booleans to numeric primitive values. Dates are compared by their
              // millisecond representations. Note that invalid dates with millisecond representations
              // of `NaN` are not equivalent.
              return +a === +b;
          }

          var areArrays = className === '[object Array]';
          if (!areArrays) {
            if ((typeof a === "undefined" ? "undefined" : _typeof(a)) != 'object' || (typeof b === "undefined" ? "undefined" : _typeof(b)) != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
              return false;
            }
          }
          // Assume equality for cyclic structures. The algorithm for detecting cyclic
          // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

          // Initializing stack of traversed objects.
          // It's done here since we only need them for objects and arrays comparison.
          aStack = aStack || [];
          bStack = bStack || [];
          var length = aStack.length;
          while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
          }

          // Add the first object to the stack of traversed objects.
          aStack.push(a);
          bStack.push(b);

          // Recursively compare objects and arrays.
          if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
              if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
          } else {
            // Deep compare objects.
            var keys = _.keys(a),
                key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
              // Deep compare each member
              key = keys[length];
              if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
          }
          // Remove the first object from the stack of traversed objects.
          aStack.pop();
          bStack.pop();
          return true;
        };

        // Perform a deep comparison to check if two objects are equal.
        _.isEqual = function (a, b) {
          return eq(a, b);
        };

        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function (obj) {
          if (obj == null) return true;
          if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
          return _.keys(obj).length === 0;
        };

        // Is a given value a DOM element?
        _.isElement = function (obj) {
          return !!(obj && obj.nodeType === 1);
        };

        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function (obj) {
          return toString.call(obj) === '[object Array]';
        };

        // Is a given variable an object?
        _.isObject = function (obj) {
          var type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
          return type === 'function' || type === 'object' && !!obj;
        };

        // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
        _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
          _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
          };
        });

        // Define a fallback version of the method in browsers (ahem, IE < 9), where
        // there isn't any inspectable "Arguments" type.
        if (!_.isArguments(arguments)) {
          _.isArguments = function (obj) {
            return _.has(obj, 'callee');
          };
        }

        // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
        // IE 11 (#1621), and in Safari 8 (#1929).
        if (typeof /./ != 'function' && (typeof Int8Array === "undefined" ? "undefined" : _typeof(Int8Array)) != 'object') {
          _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
          };
        }

        // Is a given object a finite number?
        _.isFinite = function (obj) {
          return isFinite(obj) && !isNaN(parseFloat(obj));
        };

        // Is the given value `NaN`? (NaN is the only number which does not equal itself).
        _.isNaN = function (obj) {
          return _.isNumber(obj) && obj !== +obj;
        };

        // Is a given value a boolean?
        _.isBoolean = function (obj) {
          return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
        };

        // Is a given value equal to null?
        _.isNull = function (obj) {
          return obj === null;
        };

        // Is a given variable undefined?
        _.isUndefined = function (obj) {
          return obj === void 0;
        };

        // Shortcut function for checking if an object has a given property directly
        // on itself (in other words, not on a prototype).
        _.has = function (obj, key) {
          return obj != null && hasOwnProperty.call(obj, key);
        };

        // Utility Functions
        // -----------------

        // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
        // previous owner. Returns a reference to the Underscore object.
        _.noConflict = function () {
          root._ = previousUnderscore;
          return this;
        };

        // Keep the identity function around for default iteratees.
        _.identity = function (value) {
          return value;
        };

        // Predicate-generating functions. Often useful outside of Underscore.
        _.constant = function (value) {
          return function () {
            return value;
          };
        };

        _.noop = function () {};

        _.property = property;

        // Generates a function for a given object that returns a given property.
        _.propertyOf = function (obj) {
          return obj == null ? function () {} : function (key) {
            return obj[key];
          };
        };

        // Returns a predicate for checking whether an object has a given set of
        // `key:value` pairs.
        _.matcher = _.matches = function (attrs) {
          attrs = _.extendOwn({}, attrs);
          return function (obj) {
            return _.isMatch(obj, attrs);
          };
        };

        // Run a function **n** times.
        _.times = function (n, iteratee, context) {
          var accum = Array(Math.max(0, n));
          iteratee = optimizeCb(iteratee, context, 1);
          for (var i = 0; i < n; i++) {
            accum[i] = iteratee(i);
          }return accum;
        };

        // Return a random integer between min and max (inclusive).
        _.random = function (min, max) {
          if (max == null) {
            max = min;
            min = 0;
          }
          return min + Math.floor(Math.random() * (max - min + 1));
        };

        // A (possibly faster) way to get the current timestamp as an integer.
        _.now = Date.now || function () {
          return new Date().getTime();
        };

        // List of HTML entities for escaping.
        var escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;'
        };
        var unescapeMap = _.invert(escapeMap);

        // Functions for escaping and unescaping strings to/from HTML interpolation.
        var createEscaper = function createEscaper(map) {
          var escaper = function escaper(match) {
            return map[match];
          };
          // Regexes for identifying a key that needs to be escaped
          var source = '(?:' + _.keys(map).join('|') + ')';
          var testRegexp = RegExp(source);
          var replaceRegexp = RegExp(source, 'g');
          return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
          };
        };
        _.escape = createEscaper(escapeMap);
        _.unescape = createEscaper(unescapeMap);

        // If the value of the named `property` is a function then invoke it with the
        // `object` as context; otherwise, return it.
        _.result = function (object, property, fallback) {
          var value = object == null ? void 0 : object[property];
          if (value === void 0) {
            value = fallback;
          }
          return _.isFunction(value) ? value.call(object) : value;
        };

        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        _.uniqueId = function (prefix) {
          var id = ++idCounter + '';
          return prefix ? prefix + id : id;
        };

        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        _.templateSettings = {
          evaluate: /<%([\s\S]+?)%>/g,
          interpolate: /<%=([\s\S]+?)%>/g,
          escape: /<%-([\s\S]+?)%>/g
        };

        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /(.)^/;

        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
          "'": "'",
          '\\': '\\',
          '\r': 'r',
          '\n': 'n',
          "\u2028": 'u2028',
          "\u2029": 'u2029'
        };

        var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

        var escapeChar = function escapeChar(match) {
          return '\\' + escapes[match];
        };

        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        // NB: `oldSettings` only exists for backwards compatibility.
        _.template = function (text, settings, oldSettings) {
          if (!settings && oldSettings) settings = oldSettings;
          settings = _.defaults({}, settings, _.templateSettings);

          // Combine delimiters into one regular expression via alternation.
          var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

          // Compile the template source, escaping string literals appropriately.
          var index = 0;
          var source = "__p+='";
          text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
              source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
              source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
              source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
          });
          source += "';\n";

          // If a variable is not specified, place data values in local scope.
          if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

          source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

          try {
            var render = new Function(settings.variable || 'obj', '_', source);
          } catch (e) {
            e.source = source;
            throw e;
          }

          var template = function template(data) {
            return render.call(this, data, _);
          };

          // Provide the compiled source as a convenience for precompilation.
          var argument = settings.variable || 'obj';
          template.source = 'function(' + argument + '){\n' + source + '}';

          return template;
        };

        // Add a "chain" function. Start chaining a wrapped Underscore object.
        _.chain = function (obj) {
          var instance = _(obj);
          instance._chain = true;
          return instance;
        };

        // OOP
        // ---------------
        // If Underscore is called as a function, it returns a wrapped object that
        // can be used OO-style. This wrapper holds altered versions of all the
        // underscore functions. Wrapped objects may be chained.

        // Helper function to continue chaining intermediate results.
        var result = function result(instance, obj) {
          return instance._chain ? _(obj).chain() : obj;
        };

        // Add your own custom functions to the Underscore object.
        _.mixin = function (obj) {
          _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
              var args = [this._wrapped];
              push.apply(args, arguments);
              return result(this, func.apply(_, args));
            };
          });
        };

        // Add all of the Underscore functions to the wrapper object.
        _.mixin(_);

        // Add all mutator Array functions to the wrapper.
        _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
          var method = ArrayProto[name];
          _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return result(this, obj);
          };
        });

        // Add all accessor Array functions to the wrapper.
        _.each(['concat', 'join', 'slice'], function (name) {
          var method = ArrayProto[name];
          _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments));
          };
        });

        // Extracts the result from a wrapped and chained object.
        _.prototype.value = function () {
          return this._wrapped;
        };

        // Provide unwrapping proxy for some methods used in engine operations
        // such as arithmetic and JSON stringification.
        _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

        _.prototype.toString = function () {
          return '' + this._wrapped;
        };

        // AMD registration happens at the end for compatibility with AMD loaders
        // that may not enforce next-turn semantics on modules. Even though general
        // practice for AMD registration is to be anonymous, underscore registers
        // as a named module because, like jQuery, it is a base library that is
        // popular enough to be bundled in a third party lib, but not be part of
        // an AMD load request. Those cases could generate an error when an
        // anonymous define() is called outside of a loader request.
        if (typeof define === 'function' && define.amd) {
          define('underscore', [], function () {
            return _;
          });
        }
      }).call(this);
    }, {}], 22: [function (require, module, exports) {
      module.exports = urlSetQuery;
      function urlSetQuery(url, query) {
        if (query) {
          // remove optional leading symbols
          query = query.trim().replace(/^(\?|#|&)/, '');

          // don't append empty query
          query = query ? '?' + query : query;

          var parts = url.split(/[\?\#]/);
          var start = parts[0];
          if (query && /\:\/\/[^\/]*$/.test(start)) {
            // e.g. http://foo.com -> http://foo.com/
            start = start + '/';
          }
          var match = url.match(/(\#.*)$/);
          url = start + query;
          if (match) {
            // add hash back in
            url = url + match[0];
          }
        }
        return url;
      }
    }, {}], 23: [function (require, module, exports) {
      var request = require('xhr-request');

      module.exports = function (url, options) {
        return new Promise(function (resolve, reject) {
          request(url, options, function (err, data) {
            if (err) reject(err);else resolve(data);
          });
        });
      };
    }, { "xhr-request": 24 }], 24: [function (require, module, exports) {
      var queryString = require('query-string');
      var setQuery = require('url-set-query');
      var assign = require('object-assign');
      var ensureHeader = require('./lib/ensure-header.js');

      // this is replaced in the browser
      var request = require('./lib/request.js');

      var mimeTypeJson = 'application/json';
      var noop = function noop() {};

      module.exports = xhrRequest;
      function xhrRequest(url, opt, cb) {
        if (!url || typeof url !== 'string') {
          throw new TypeError('must specify a URL');
        }
        if (typeof opt === 'function') {
          cb = opt;
          opt = {};
        }
        if (cb && typeof cb !== 'function') {
          throw new TypeError('expected cb to be undefined or a function');
        }

        cb = cb || noop;
        opt = opt || {};

        var defaultResponse = opt.json ? 'json' : 'text';
        opt = assign({ responseType: defaultResponse }, opt);

        var headers = opt.headers || {};
        var method = (opt.method || 'GET').toUpperCase();
        var query = opt.query;
        if (query) {
          if (typeof query !== 'string') {
            query = queryString.stringify(query);
          }
          url = setQuery(url, query);
        }

        // allow json response
        if (opt.responseType === 'json') {
          ensureHeader(headers, 'Accept', mimeTypeJson);
        }

        // if body content is json
        if (opt.json && method !== 'GET' && method !== 'HEAD') {
          ensureHeader(headers, 'Content-Type', mimeTypeJson);
          opt.body = JSON.stringify(opt.body);
        }

        opt.method = method;
        opt.url = url;
        opt.headers = headers;
        delete opt.query;
        delete opt.json;

        return request(opt, cb);
      }
    }, { "./lib/ensure-header.js": 25, "./lib/request.js": 27, "object-assign": 28, "query-string": 14, "url-set-query": 22 }], 25: [function (require, module, exports) {
      module.exports = ensureHeader;
      function ensureHeader(headers, key, value) {
        var lower = key.toLowerCase();
        if (!headers[key] && !headers[lower]) {
          headers[key] = value;
        }
      }
    }, {}], 26: [function (require, module, exports) {
      module.exports = getResponse;
      function getResponse(opt, resp) {
        if (!resp) return null;
        return {
          statusCode: resp.statusCode,
          headers: resp.headers,
          method: opt.method,
          url: opt.url,
          // the XHR object in browser, http response in Node
          rawRequest: resp.rawRequest ? resp.rawRequest : resp
        };
      }
    }, {}], 27: [function (require, module, exports) {
      var xhr = require('xhr');
      var normalize = require('./normalize-response');

      module.exports = xhrRequest;
      function xhrRequest(opt, cb) {
        delete opt.uri;

        // for better JSON.parse error handling than xhr module
        var useJson = false;
        if (opt.responseType === 'json') {
          opt.responseType = 'text';
          useJson = true;
        }

        return xhr(opt, function xhrRequestResult(err, resp, body) {
          if (useJson && !err) {
            try {
              var text = resp.rawRequest.responseText;
              body = JSON.parse(text);
            } catch (e) {
              err = e;
            }
          }

          resp = normalize(opt, resp);
          if (err) cb(err, null, resp);else cb(err, body, resp);
        });
      }
    }, { "./normalize-response": 26, "xhr": 29 }], 28: [function (require, module, exports) {
      'use strict';

      var propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function ToObject(val) {
        if (val == null) {
          throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
      }

      function ownEnumerableKeys(obj) {
        var keys = Object.getOwnPropertyNames(obj);

        if (Object.getOwnPropertySymbols) {
          keys = keys.concat(Object.getOwnPropertySymbols(obj));
        }

        return keys.filter(function (key) {
          return propIsEnumerable.call(obj, key);
        });
      }

      module.exports = Object.assign || function (target, source) {
        var from;
        var keys;
        var to = ToObject(target);

        for (var s = 1; s < arguments.length; s++) {
          from = arguments[s];
          keys = ownEnumerableKeys(Object(from));

          for (var i = 0; i < keys.length; i++) {
            to[keys[i]] = from[keys[i]];
          }
        }

        return to;
      };
    }, {}], 29: [function (require, module, exports) {
      "use strict";

      var window = require("global/window");
      var isFunction = require("is-function");
      var parseHeaders = require("parse-headers");
      var xtend = require("xtend");

      module.exports = createXHR;
      createXHR.XMLHttpRequest = window.XMLHttpRequest || noop;
      createXHR.XDomainRequest = "withCredentials" in new createXHR.XMLHttpRequest() ? createXHR.XMLHttpRequest : window.XDomainRequest;

      forEachArray(["get", "put", "post", "patch", "head", "delete"], function (method) {
        createXHR[method === "delete" ? "del" : method] = function (uri, options, callback) {
          options = initParams(uri, options, callback);
          options.method = method.toUpperCase();
          return _createXHR(options);
        };
      });

      function forEachArray(array, iterator) {
        for (var i = 0; i < array.length; i++) {
          iterator(array[i]);
        }
      }

      function isEmpty(obj) {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) return false;
        }
        return true;
      }

      function initParams(uri, options, callback) {
        var params = uri;

        if (isFunction(options)) {
          callback = options;
          if (typeof uri === "string") {
            params = { uri: uri };
          }
        } else {
          params = xtend(options, { uri: uri });
        }

        params.callback = callback;
        return params;
      }

      function createXHR(uri, options, callback) {
        options = initParams(uri, options, callback);
        return _createXHR(options);
      }

      function _createXHR(options) {
        if (typeof options.callback === "undefined") {
          throw new Error("callback argument missing");
        }

        var called = false;
        var callback = function cbOnce(err, response, body) {
          if (!called) {
            called = true;
            options.callback(err, response, body);
          }
        };

        function readystatechange() {
          if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0);
          }
        }

        function getBody() {
          // Chrome with requestType=blob throws errors arround when even testing access to responseText
          var body = undefined;

          if (xhr.response) {
            body = xhr.response;
          } else {
            body = xhr.responseText || getXml(xhr);
          }

          if (isJson) {
            try {
              body = JSON.parse(body);
            } catch (e) {}
          }

          return body;
        }

        function errorFunc(evt) {
          clearTimeout(timeoutTimer);
          if (!(evt instanceof Error)) {
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"));
          }
          evt.statusCode = 0;
          return callback(evt, failureResponse);
        }

        // will load the data & process the response in a special response object
        function loadFunc() {
          if (aborted) return;
          var status;
          clearTimeout(timeoutTimer);
          if (options.useXDR && xhr.status === undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200;
          } else {
            status = xhr.status === 1223 ? 204 : xhr.status;
          }
          var response = failureResponse;
          var err = null;

          if (status !== 0) {
            response = {
              body: getBody(),
              statusCode: status,
              method: method,
              headers: {},
              url: uri,
              rawRequest: xhr
            };
            if (xhr.getAllResponseHeaders) {
              //remember xhr can in fact be XDR for CORS in IE
              response.headers = parseHeaders(xhr.getAllResponseHeaders());
            }
          } else {
            err = new Error("Internal XMLHttpRequest Error");
          }
          return callback(err, response, response.body);
        }

        var xhr = options.xhr || null;

        if (!xhr) {
          if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest();
          } else {
            xhr = new createXHR.XMLHttpRequest();
          }
        }

        var key;
        var aborted;
        var uri = xhr.url = options.uri || options.url;
        var method = xhr.method = options.method || "GET";
        var body = options.body || options.data;
        var headers = xhr.headers = options.headers || {};
        var sync = !!options.sync;
        var isJson = false;
        var timeoutTimer;
        var failureResponse = {
          body: undefined,
          headers: {},
          statusCode: 0,
          method: method,
          url: uri,
          rawRequest: xhr
        };

        if ("json" in options && options.json !== false) {
          isJson = true;
          headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json"); //Don't override existing accept header declared by user
          if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json"); //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json);
          }
        }

        xhr.onreadystatechange = readystatechange;
        xhr.onload = loadFunc;
        xhr.onerror = errorFunc;
        // IE9 must have onprogress be set to a unique function.
        xhr.onprogress = function () {
          // IE must die
        };
        xhr.onabort = function () {
          aborted = true;
        };
        xhr.ontimeout = errorFunc;
        xhr.open(method, uri, !sync, options.username, options.password);
        //has to be after open
        if (!sync) {
          xhr.withCredentials = !!options.withCredentials;
        }
        // Cannot set timeout with sync request
        // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
        // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
        if (!sync && options.timeout > 0) {
          timeoutTimer = setTimeout(function () {
            if (aborted) return;
            aborted = true; //IE9 may still call readystatechange
            xhr.abort("timeout");
            var e = new Error("XMLHttpRequest timeout");
            e.code = "ETIMEDOUT";
            errorFunc(e);
          }, options.timeout);
        }

        if (xhr.setRequestHeader) {
          for (key in headers) {
            if (headers.hasOwnProperty(key)) {
              xhr.setRequestHeader(key, headers[key]);
            }
          }
        } else if (options.headers && !isEmpty(options.headers)) {
          throw new Error("Headers cannot be set on an XDomainRequest object");
        }

        if ("responseType" in options) {
          xhr.responseType = options.responseType;
        }

        if ("beforeSend" in options && typeof options.beforeSend === "function") {
          options.beforeSend(xhr);
        }

        // Microsoft Edge browser sends "undefined" when send is called with undefined value.
        // XMLHttpRequest spec says to pass null as body to indicate no body
        // See https://github.com/naugtur/xhr/issues/100.
        xhr.send(body || null);

        return xhr;
      }

      function getXml(xhr) {
        if (xhr.responseType === "document") {
          return xhr.responseXML;
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror";
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
          return xhr.responseXML;
        }

        return null;
      }

      function noop() {}
    }, { "global/window": 8, "is-function": 9, "parse-headers": 13, "xtend": 30 }], 30: [function (require, module, exports) {
      module.exports = extend;

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      function extend() {
        var target = {};

        for (var i = 0; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      }
    }, {}], "BN": [function (require, module, exports) {
      (function (module, exports) {
        'use strict';

        // Utils

        function assert(val, msg) {
          if (!val) throw new Error(msg || 'Assertion failed');
        }

        // Could use `inherits` module, but don't want to move from single file
        // architecture yet.
        function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function TempCtor() {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }

        // BN

        function BN(number, base, endian) {
          if (BN.isBN(number)) {
            return number;
          }

          this.negative = 0;
          this.words = null;
          this.length = 0;

          // Reduction context
          this.red = null;

          if (number !== null) {
            if (base === 'le' || base === 'be') {
              endian = base;
              base = 10;
            }

            this._init(number || 0, base || 10, endian || 'be');
          }
        }
        if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
          module.exports = BN;
        } else {
          exports.BN = BN;
        }

        BN.BN = BN;
        BN.wordSize = 26;

        var Buffer;
        try {
          Buffer = require('buffer').Buffer;
        } catch (e) {}

        BN.isBN = function isBN(num) {
          if (num instanceof BN) {
            return true;
          }

          return num !== null && (typeof num === "undefined" ? "undefined" : _typeof(num)) === 'object' && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
        };

        BN.max = function max(left, right) {
          if (left.cmp(right) > 0) return left;
          return right;
        };

        BN.min = function min(left, right) {
          if (left.cmp(right) < 0) return left;
          return right;
        };

        BN.prototype._init = function init(number, base, endian) {
          if (typeof number === 'number') {
            return this._initNumber(number, base, endian);
          }

          if ((typeof number === "undefined" ? "undefined" : _typeof(number)) === 'object') {
            return this._initArray(number, base, endian);
          }

          if (base === 'hex') {
            base = 16;
          }
          assert(base === (base | 0) && base >= 2 && base <= 36);

          number = number.toString().replace(/\s+/g, '');
          var start = 0;
          if (number[0] === '-') {
            start++;
          }

          if (base === 16) {
            this._parseHex(number, start);
          } else {
            this._parseBase(number, base, start);
          }

          if (number[0] === '-') {
            this.negative = 1;
          }

          this.strip();

          if (endian !== 'le') return;

          this._initArray(this.toArray(), base, endian);
        };

        BN.prototype._initNumber = function _initNumber(number, base, endian) {
          if (number < 0) {
            this.negative = 1;
            number = -number;
          }
          if (number < 0x4000000) {
            this.words = [number & 0x3ffffff];
            this.length = 1;
          } else if (number < 0x10000000000000) {
            this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff];
            this.length = 2;
          } else {
            assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
            this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff, 1];
            this.length = 3;
          }

          if (endian !== 'le') return;

          // Reverse the bytes
          this._initArray(this.toArray(), base, endian);
        };

        BN.prototype._initArray = function _initArray(number, base, endian) {
          // Perhaps a Uint8Array
          assert(typeof number.length === 'number');
          if (number.length <= 0) {
            this.words = [0];
            this.length = 1;
            return this;
          }

          this.length = Math.ceil(number.length / 3);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }

          var j, w;
          var off = 0;
          if (endian === 'be') {
            for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
              w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
              this.words[j] |= w << off & 0x3ffffff;
              this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          } else if (endian === 'le') {
            for (i = 0, j = 0; i < number.length; i += 3) {
              w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
              this.words[j] |= w << off & 0x3ffffff;
              this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          }
          return this.strip();
        };

        function parseHex(str, start, end) {
          var r = 0;
          var len = Math.min(str.length, end);
          for (var i = start; i < len; i++) {
            var c = str.charCodeAt(i) - 48;

            r <<= 4;

            // 'a' - 'f'
            if (c >= 49 && c <= 54) {
              r |= c - 49 + 0xa;

              // 'A' - 'F'
            } else if (c >= 17 && c <= 22) {
              r |= c - 17 + 0xa;

              // '0' - '9'
            } else {
              r |= c & 0xf;
            }
          }
          return r;
        }

        BN.prototype._parseHex = function _parseHex(number, start) {
          // Create possibly bigger array to ensure that it fits the number
          this.length = Math.ceil((number.length - start) / 6);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }

          var j, w;
          // Scan 24-bit chunks and add them to the number
          var off = 0;
          for (i = number.length - 6, j = 0; i >= start; i -= 6) {
            w = parseHex(number, i, i + 6);
            this.words[j] |= w << off & 0x3ffffff;
            // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
            this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
          if (i + 6 !== start) {
            w = parseHex(number, start, i + 6);
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
          }
          this.strip();
        };

        function parseBase(str, start, end, mul) {
          var r = 0;
          var len = Math.min(str.length, end);
          for (var i = start; i < len; i++) {
            var c = str.charCodeAt(i) - 48;

            r *= mul;

            // 'a'
            if (c >= 49) {
              r += c - 49 + 0xa;

              // 'A'
            } else if (c >= 17) {
              r += c - 17 + 0xa;

              // '0' - '9'
            } else {
              r += c;
            }
          }
          return r;
        }

        BN.prototype._parseBase = function _parseBase(number, base, start) {
          // Initialize as zero
          this.words = [0];
          this.length = 1;

          // Find length of limb in base
          for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
            limbLen++;
          }
          limbLen--;
          limbPow = limbPow / base | 0;

          var total = number.length - start;
          var mod = total % limbLen;
          var end = Math.min(total, total - mod) + start;

          var word = 0;
          for (var i = start; i < end; i += limbLen) {
            word = parseBase(number, i, i + limbLen, base);

            this.imuln(limbPow);
            if (this.words[0] + word < 0x4000000) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }

          if (mod !== 0) {
            var pow = 1;
            word = parseBase(number, i, number.length, base);

            for (i = 0; i < mod; i++) {
              pow *= base;
            }

            this.imuln(pow);
            if (this.words[0] + word < 0x4000000) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }
        };

        BN.prototype.copy = function copy(dest) {
          dest.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            dest.words[i] = this.words[i];
          }
          dest.length = this.length;
          dest.negative = this.negative;
          dest.red = this.red;
        };

        BN.prototype.clone = function clone() {
          var r = new BN(null);
          this.copy(r);
          return r;
        };

        BN.prototype._expand = function _expand(size) {
          while (this.length < size) {
            this.words[this.length++] = 0;
          }
          return this;
        };

        // Remove leading `0` from `this`
        BN.prototype.strip = function strip() {
          while (this.length > 1 && this.words[this.length - 1] === 0) {
            this.length--;
          }
          return this._normSign();
        };

        BN.prototype._normSign = function _normSign() {
          // -0 = 0
          if (this.length === 1 && this.words[0] === 0) {
            this.negative = 0;
          }
          return this;
        };

        BN.prototype.inspect = function inspect() {
          return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
        };

        /*
         var zeros = [];
        var groupSizes = [];
        var groupBases = [];
         var s = '';
        var i = -1;
        while (++i < BN.wordSize) {
          zeros[i] = s;
          s += '0';
        }
        groupSizes[0] = 0;
        groupSizes[1] = 0;
        groupBases[0] = 0;
        groupBases[1] = 0;
        var base = 2 - 1;
        while (++base < 36 + 1) {
          var groupSize = 0;
          var groupBase = 1;
          while (groupBase < (1 << BN.wordSize) / base) {
            groupBase *= base;
            groupSize += 1;
          }
          groupSizes[base] = groupSize;
          groupBases[base] = groupBase;
        }
         */

        var zeros = ['', '0', '00', '000', '0000', '00000', '000000', '0000000', '00000000', '000000000', '0000000000', '00000000000', '000000000000', '0000000000000', '00000000000000', '000000000000000', '0000000000000000', '00000000000000000', '000000000000000000', '0000000000000000000', '00000000000000000000', '000000000000000000000', '0000000000000000000000', '00000000000000000000000', '000000000000000000000000', '0000000000000000000000000'];

        var groupSizes = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

        var groupBases = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

        BN.prototype.toString = function toString(base, padding) {
          base = base || 10;
          padding = padding | 0 || 1;

          var out;
          if (base === 16 || base === 'hex') {
            out = '';
            var off = 0;
            var carry = 0;
            for (var i = 0; i < this.length; i++) {
              var w = this.words[i];
              var word = ((w << off | carry) & 0xffffff).toString(16);
              carry = w >>> 24 - off & 0xffffff;
              if (carry !== 0 || i !== this.length - 1) {
                out = zeros[6 - word.length] + word + out;
              } else {
                out = word + out;
              }
              off += 2;
              if (off >= 26) {
                off -= 26;
                i--;
              }
            }
            if (carry !== 0) {
              out = carry.toString(16) + out;
            }
            while (out.length % padding !== 0) {
              out = '0' + out;
            }
            if (this.negative !== 0) {
              out = '-' + out;
            }
            return out;
          }

          if (base === (base | 0) && base >= 2 && base <= 36) {
            // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
            var groupSize = groupSizes[base];
            // var groupBase = Math.pow(base, groupSize);
            var groupBase = groupBases[base];
            out = '';
            var c = this.clone();
            c.negative = 0;
            while (!c.isZero()) {
              var r = c.modn(groupBase).toString(base);
              c = c.idivn(groupBase);

              if (!c.isZero()) {
                out = zeros[groupSize - r.length] + r + out;
              } else {
                out = r + out;
              }
            }
            if (this.isZero()) {
              out = '0' + out;
            }
            while (out.length % padding !== 0) {
              out = '0' + out;
            }
            if (this.negative !== 0) {
              out = '-' + out;
            }
            return out;
          }

          assert(false, 'Base should be between 2 and 36');
        };

        BN.prototype.toNumber = function toNumber() {
          var ret = this.words[0];
          if (this.length === 2) {
            ret += this.words[1] * 0x4000000;
          } else if (this.length === 3 && this.words[2] === 0x01) {
            // NOTE: at this stage it is known that the top bit is set
            ret += 0x10000000000000 + this.words[1] * 0x4000000;
          } else if (this.length > 2) {
            assert(false, 'Number can only safely store up to 53 bits');
          }
          return this.negative !== 0 ? -ret : ret;
        };

        BN.prototype.toJSON = function toJSON() {
          return this.toString(16);
        };

        BN.prototype.toBuffer = function toBuffer(endian, length) {
          assert(typeof Buffer !== 'undefined');
          return this.toArrayLike(Buffer, endian, length);
        };

        BN.prototype.toArray = function toArray(endian, length) {
          return this.toArrayLike(Array, endian, length);
        };

        BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
          var byteLength = this.byteLength();
          var reqLength = length || Math.max(1, byteLength);
          assert(byteLength <= reqLength, 'byte array longer than desired length');
          assert(reqLength > 0, 'Requested array length <= 0');

          this.strip();
          var littleEndian = endian === 'le';
          var res = new ArrayType(reqLength);

          var b, i;
          var q = this.clone();
          if (!littleEndian) {
            // Assume big-endian
            for (i = 0; i < reqLength - byteLength; i++) {
              res[i] = 0;
            }

            for (i = 0; !q.isZero(); i++) {
              b = q.andln(0xff);
              q.iushrn(8);

              res[reqLength - i - 1] = b;
            }
          } else {
            for (i = 0; !q.isZero(); i++) {
              b = q.andln(0xff);
              q.iushrn(8);

              res[i] = b;
            }

            for (; i < reqLength; i++) {
              res[i] = 0;
            }
          }

          return res;
        };

        if (Math.clz32) {
          BN.prototype._countBits = function _countBits(w) {
            return 32 - Math.clz32(w);
          };
        } else {
          BN.prototype._countBits = function _countBits(w) {
            var t = w;
            var r = 0;
            if (t >= 0x1000) {
              r += 13;
              t >>>= 13;
            }
            if (t >= 0x40) {
              r += 7;
              t >>>= 7;
            }
            if (t >= 0x8) {
              r += 4;
              t >>>= 4;
            }
            if (t >= 0x02) {
              r += 2;
              t >>>= 2;
            }
            return r + t;
          };
        }

        BN.prototype._zeroBits = function _zeroBits(w) {
          // Short-cut
          if (w === 0) return 26;

          var t = w;
          var r = 0;
          if ((t & 0x1fff) === 0) {
            r += 13;
            t >>>= 13;
          }
          if ((t & 0x7f) === 0) {
            r += 7;
            t >>>= 7;
          }
          if ((t & 0xf) === 0) {
            r += 4;
            t >>>= 4;
          }
          if ((t & 0x3) === 0) {
            r += 2;
            t >>>= 2;
          }
          if ((t & 0x1) === 0) {
            r++;
          }
          return r;
        };

        // Return number of used bits in a BN
        BN.prototype.bitLength = function bitLength() {
          var w = this.words[this.length - 1];
          var hi = this._countBits(w);
          return (this.length - 1) * 26 + hi;
        };

        function toBitArray(num) {
          var w = new Array(num.bitLength());

          for (var bit = 0; bit < w.length; bit++) {
            var off = bit / 26 | 0;
            var wbit = bit % 26;

            w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
          }

          return w;
        }

        // Number of trailing zero bits
        BN.prototype.zeroBits = function zeroBits() {
          if (this.isZero()) return 0;

          var r = 0;
          for (var i = 0; i < this.length; i++) {
            var b = this._zeroBits(this.words[i]);
            r += b;
            if (b !== 26) break;
          }
          return r;
        };

        BN.prototype.byteLength = function byteLength() {
          return Math.ceil(this.bitLength() / 8);
        };

        BN.prototype.toTwos = function toTwos(width) {
          if (this.negative !== 0) {
            return this.abs().inotn(width).iaddn(1);
          }
          return this.clone();
        };

        BN.prototype.fromTwos = function fromTwos(width) {
          if (this.testn(width - 1)) {
            return this.notn(width).iaddn(1).ineg();
          }
          return this.clone();
        };

        BN.prototype.isNeg = function isNeg() {
          return this.negative !== 0;
        };

        // Return negative clone of `this`
        BN.prototype.neg = function neg() {
          return this.clone().ineg();
        };

        BN.prototype.ineg = function ineg() {
          if (!this.isZero()) {
            this.negative ^= 1;
          }

          return this;
        };

        // Or `num` with `this` in-place
        BN.prototype.iuor = function iuor(num) {
          while (this.length < num.length) {
            this.words[this.length++] = 0;
          }

          for (var i = 0; i < num.length; i++) {
            this.words[i] = this.words[i] | num.words[i];
          }

          return this.strip();
        };

        BN.prototype.ior = function ior(num) {
          assert((this.negative | num.negative) === 0);
          return this.iuor(num);
        };

        // Or `num` with `this`
        BN.prototype.or = function or(num) {
          if (this.length > num.length) return this.clone().ior(num);
          return num.clone().ior(this);
        };

        BN.prototype.uor = function uor(num) {
          if (this.length > num.length) return this.clone().iuor(num);
          return num.clone().iuor(this);
        };

        // And `num` with `this` in-place
        BN.prototype.iuand = function iuand(num) {
          // b = min-length(num, this)
          var b;
          if (this.length > num.length) {
            b = num;
          } else {
            b = this;
          }

          for (var i = 0; i < b.length; i++) {
            this.words[i] = this.words[i] & num.words[i];
          }

          this.length = b.length;

          return this.strip();
        };

        BN.prototype.iand = function iand(num) {
          assert((this.negative | num.negative) === 0);
          return this.iuand(num);
        };

        // And `num` with `this`
        BN.prototype.and = function and(num) {
          if (this.length > num.length) return this.clone().iand(num);
          return num.clone().iand(this);
        };

        BN.prototype.uand = function uand(num) {
          if (this.length > num.length) return this.clone().iuand(num);
          return num.clone().iuand(this);
        };

        // Xor `num` with `this` in-place
        BN.prototype.iuxor = function iuxor(num) {
          // a.length > b.length
          var a;
          var b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }

          for (var i = 0; i < b.length; i++) {
            this.words[i] = a.words[i] ^ b.words[i];
          }

          if (this !== a) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }

          this.length = a.length;

          return this.strip();
        };

        BN.prototype.ixor = function ixor(num) {
          assert((this.negative | num.negative) === 0);
          return this.iuxor(num);
        };

        // Xor `num` with `this`
        BN.prototype.xor = function xor(num) {
          if (this.length > num.length) return this.clone().ixor(num);
          return num.clone().ixor(this);
        };

        BN.prototype.uxor = function uxor(num) {
          if (this.length > num.length) return this.clone().iuxor(num);
          return num.clone().iuxor(this);
        };

        // Not ``this`` with ``width`` bitwidth
        BN.prototype.inotn = function inotn(width) {
          assert(typeof width === 'number' && width >= 0);

          var bytesNeeded = Math.ceil(width / 26) | 0;
          var bitsLeft = width % 26;

          // Extend the buffer with leading zeroes
          this._expand(bytesNeeded);

          if (bitsLeft > 0) {
            bytesNeeded--;
          }

          // Handle complete words
          for (var i = 0; i < bytesNeeded; i++) {
            this.words[i] = ~this.words[i] & 0x3ffffff;
          }

          // Handle the residue
          if (bitsLeft > 0) {
            this.words[i] = ~this.words[i] & 0x3ffffff >> 26 - bitsLeft;
          }

          // And remove leading zeroes
          return this.strip();
        };

        BN.prototype.notn = function notn(width) {
          return this.clone().inotn(width);
        };

        // Set `bit` of `this`
        BN.prototype.setn = function setn(bit, val) {
          assert(typeof bit === 'number' && bit >= 0);

          var off = bit / 26 | 0;
          var wbit = bit % 26;

          this._expand(off + 1);

          if (val) {
            this.words[off] = this.words[off] | 1 << wbit;
          } else {
            this.words[off] = this.words[off] & ~(1 << wbit);
          }

          return this.strip();
        };

        // Add `num` to `this` in-place
        BN.prototype.iadd = function iadd(num) {
          var r;

          // negative + positive
          if (this.negative !== 0 && num.negative === 0) {
            this.negative = 0;
            r = this.isub(num);
            this.negative ^= 1;
            return this._normSign();

            // positive + negative
          } else if (this.negative === 0 && num.negative !== 0) {
            num.negative = 0;
            r = this.isub(num);
            num.negative = 1;
            return r._normSign();
          }

          // a.length > b.length
          var a, b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }

          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
          }

          this.length = a.length;
          if (carry !== 0) {
            this.words[this.length] = carry;
            this.length++;
            // Copy the rest of the words
          } else if (a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }

          return this;
        };

        // Add `num` to `this`
        BN.prototype.add = function add(num) {
          var res;
          if (num.negative !== 0 && this.negative === 0) {
            num.negative = 0;
            res = this.sub(num);
            num.negative ^= 1;
            return res;
          } else if (num.negative === 0 && this.negative !== 0) {
            this.negative = 0;
            res = num.sub(this);
            this.negative = 1;
            return res;
          }

          if (this.length > num.length) return this.clone().iadd(num);

          return num.clone().iadd(this);
        };

        // Subtract `num` from `this` in-place
        BN.prototype.isub = function isub(num) {
          // this - (-num) = this + num
          if (num.negative !== 0) {
            num.negative = 0;
            var r = this.iadd(num);
            num.negative = 1;
            return r._normSign();

            // -this - num = -(this + num)
          } else if (this.negative !== 0) {
            this.negative = 0;
            this.iadd(num);
            this.negative = 1;
            return this._normSign();
          }

          // At this point both numbers are positive
          var cmp = this.cmp(num);

          // Optimization - zeroify
          if (cmp === 0) {
            this.negative = 0;
            this.length = 1;
            this.words[0] = 0;
            return this;
          }

          // a > b
          var a, b;
          if (cmp > 0) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }

          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
          }

          // Copy rest of the words
          if (carry === 0 && i < a.length && a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }

          this.length = Math.max(this.length, i);

          if (a !== this) {
            this.negative = 1;
          }

          return this.strip();
        };

        // Subtract `num` from `this`
        BN.prototype.sub = function sub(num) {
          return this.clone().isub(num);
        };

        function smallMulTo(self, num, out) {
          out.negative = num.negative ^ self.negative;
          var len = self.length + num.length | 0;
          out.length = len;
          len = len - 1 | 0;

          // Peel one iteration (compiler can't do it, because of code complexity)
          var a = self.words[0] | 0;
          var b = num.words[0] | 0;
          var r = a * b;

          var lo = r & 0x3ffffff;
          var carry = r / 0x4000000 | 0;
          out.words[0] = lo;

          for (var k = 1; k < len; k++) {
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = carry >>> 26;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
              var i = k - j | 0;
              a = self.words[i] | 0;
              b = num.words[j] | 0;
              r = a * b + rword;
              ncarry += r / 0x4000000 | 0;
              rword = r & 0x3ffffff;
            }
            out.words[k] = rword | 0;
            carry = ncarry | 0;
          }
          if (carry !== 0) {
            out.words[k] = carry | 0;
          } else {
            out.length--;
          }

          return out.strip();
        }

        // TODO(indutny): it may be reasonable to omit it for users who don't need
        // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
        // multiplication (like elliptic secp256k1).
        var comb10MulTo = function comb10MulTo(self, num, out) {
          var a = self.words;
          var b = num.words;
          var o = out.words;
          var c = 0;
          var lo;
          var mid;
          var hi;
          var a0 = a[0] | 0;
          var al0 = a0 & 0x1fff;
          var ah0 = a0 >>> 13;
          var a1 = a[1] | 0;
          var al1 = a1 & 0x1fff;
          var ah1 = a1 >>> 13;
          var a2 = a[2] | 0;
          var al2 = a2 & 0x1fff;
          var ah2 = a2 >>> 13;
          var a3 = a[3] | 0;
          var al3 = a3 & 0x1fff;
          var ah3 = a3 >>> 13;
          var a4 = a[4] | 0;
          var al4 = a4 & 0x1fff;
          var ah4 = a4 >>> 13;
          var a5 = a[5] | 0;
          var al5 = a5 & 0x1fff;
          var ah5 = a5 >>> 13;
          var a6 = a[6] | 0;
          var al6 = a6 & 0x1fff;
          var ah6 = a6 >>> 13;
          var a7 = a[7] | 0;
          var al7 = a7 & 0x1fff;
          var ah7 = a7 >>> 13;
          var a8 = a[8] | 0;
          var al8 = a8 & 0x1fff;
          var ah8 = a8 >>> 13;
          var a9 = a[9] | 0;
          var al9 = a9 & 0x1fff;
          var ah9 = a9 >>> 13;
          var b0 = b[0] | 0;
          var bl0 = b0 & 0x1fff;
          var bh0 = b0 >>> 13;
          var b1 = b[1] | 0;
          var bl1 = b1 & 0x1fff;
          var bh1 = b1 >>> 13;
          var b2 = b[2] | 0;
          var bl2 = b2 & 0x1fff;
          var bh2 = b2 >>> 13;
          var b3 = b[3] | 0;
          var bl3 = b3 & 0x1fff;
          var bh3 = b3 >>> 13;
          var b4 = b[4] | 0;
          var bl4 = b4 & 0x1fff;
          var bh4 = b4 >>> 13;
          var b5 = b[5] | 0;
          var bl5 = b5 & 0x1fff;
          var bh5 = b5 >>> 13;
          var b6 = b[6] | 0;
          var bl6 = b6 & 0x1fff;
          var bh6 = b6 >>> 13;
          var b7 = b[7] | 0;
          var bl7 = b7 & 0x1fff;
          var bh7 = b7 >>> 13;
          var b8 = b[8] | 0;
          var bl8 = b8 & 0x1fff;
          var bh8 = b8 >>> 13;
          var b9 = b[9] | 0;
          var bl9 = b9 & 0x1fff;
          var bh9 = b9 >>> 13;

          out.negative = self.negative ^ num.negative;
          out.length = 19;
          /* k = 0 */
          lo = Math.imul(al0, bl0);
          mid = Math.imul(al0, bh0);
          mid = mid + Math.imul(ah0, bl0) | 0;
          hi = Math.imul(ah0, bh0);
          var w0 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
          w0 &= 0x3ffffff;
          /* k = 1 */
          lo = Math.imul(al1, bl0);
          mid = Math.imul(al1, bh0);
          mid = mid + Math.imul(ah1, bl0) | 0;
          hi = Math.imul(ah1, bh0);
          lo = lo + Math.imul(al0, bl1) | 0;
          mid = mid + Math.imul(al0, bh1) | 0;
          mid = mid + Math.imul(ah0, bl1) | 0;
          hi = hi + Math.imul(ah0, bh1) | 0;
          var w1 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
          w1 &= 0x3ffffff;
          /* k = 2 */
          lo = Math.imul(al2, bl0);
          mid = Math.imul(al2, bh0);
          mid = mid + Math.imul(ah2, bl0) | 0;
          hi = Math.imul(ah2, bh0);
          lo = lo + Math.imul(al1, bl1) | 0;
          mid = mid + Math.imul(al1, bh1) | 0;
          mid = mid + Math.imul(ah1, bl1) | 0;
          hi = hi + Math.imul(ah1, bh1) | 0;
          lo = lo + Math.imul(al0, bl2) | 0;
          mid = mid + Math.imul(al0, bh2) | 0;
          mid = mid + Math.imul(ah0, bl2) | 0;
          hi = hi + Math.imul(ah0, bh2) | 0;
          var w2 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
          w2 &= 0x3ffffff;
          /* k = 3 */
          lo = Math.imul(al3, bl0);
          mid = Math.imul(al3, bh0);
          mid = mid + Math.imul(ah3, bl0) | 0;
          hi = Math.imul(ah3, bh0);
          lo = lo + Math.imul(al2, bl1) | 0;
          mid = mid + Math.imul(al2, bh1) | 0;
          mid = mid + Math.imul(ah2, bl1) | 0;
          hi = hi + Math.imul(ah2, bh1) | 0;
          lo = lo + Math.imul(al1, bl2) | 0;
          mid = mid + Math.imul(al1, bh2) | 0;
          mid = mid + Math.imul(ah1, bl2) | 0;
          hi = hi + Math.imul(ah1, bh2) | 0;
          lo = lo + Math.imul(al0, bl3) | 0;
          mid = mid + Math.imul(al0, bh3) | 0;
          mid = mid + Math.imul(ah0, bl3) | 0;
          hi = hi + Math.imul(ah0, bh3) | 0;
          var w3 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
          w3 &= 0x3ffffff;
          /* k = 4 */
          lo = Math.imul(al4, bl0);
          mid = Math.imul(al4, bh0);
          mid = mid + Math.imul(ah4, bl0) | 0;
          hi = Math.imul(ah4, bh0);
          lo = lo + Math.imul(al3, bl1) | 0;
          mid = mid + Math.imul(al3, bh1) | 0;
          mid = mid + Math.imul(ah3, bl1) | 0;
          hi = hi + Math.imul(ah3, bh1) | 0;
          lo = lo + Math.imul(al2, bl2) | 0;
          mid = mid + Math.imul(al2, bh2) | 0;
          mid = mid + Math.imul(ah2, bl2) | 0;
          hi = hi + Math.imul(ah2, bh2) | 0;
          lo = lo + Math.imul(al1, bl3) | 0;
          mid = mid + Math.imul(al1, bh3) | 0;
          mid = mid + Math.imul(ah1, bl3) | 0;
          hi = hi + Math.imul(ah1, bh3) | 0;
          lo = lo + Math.imul(al0, bl4) | 0;
          mid = mid + Math.imul(al0, bh4) | 0;
          mid = mid + Math.imul(ah0, bl4) | 0;
          hi = hi + Math.imul(ah0, bh4) | 0;
          var w4 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
          w4 &= 0x3ffffff;
          /* k = 5 */
          lo = Math.imul(al5, bl0);
          mid = Math.imul(al5, bh0);
          mid = mid + Math.imul(ah5, bl0) | 0;
          hi = Math.imul(ah5, bh0);
          lo = lo + Math.imul(al4, bl1) | 0;
          mid = mid + Math.imul(al4, bh1) | 0;
          mid = mid + Math.imul(ah4, bl1) | 0;
          hi = hi + Math.imul(ah4, bh1) | 0;
          lo = lo + Math.imul(al3, bl2) | 0;
          mid = mid + Math.imul(al3, bh2) | 0;
          mid = mid + Math.imul(ah3, bl2) | 0;
          hi = hi + Math.imul(ah3, bh2) | 0;
          lo = lo + Math.imul(al2, bl3) | 0;
          mid = mid + Math.imul(al2, bh3) | 0;
          mid = mid + Math.imul(ah2, bl3) | 0;
          hi = hi + Math.imul(ah2, bh3) | 0;
          lo = lo + Math.imul(al1, bl4) | 0;
          mid = mid + Math.imul(al1, bh4) | 0;
          mid = mid + Math.imul(ah1, bl4) | 0;
          hi = hi + Math.imul(ah1, bh4) | 0;
          lo = lo + Math.imul(al0, bl5) | 0;
          mid = mid + Math.imul(al0, bh5) | 0;
          mid = mid + Math.imul(ah0, bl5) | 0;
          hi = hi + Math.imul(ah0, bh5) | 0;
          var w5 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
          w5 &= 0x3ffffff;
          /* k = 6 */
          lo = Math.imul(al6, bl0);
          mid = Math.imul(al6, bh0);
          mid = mid + Math.imul(ah6, bl0) | 0;
          hi = Math.imul(ah6, bh0);
          lo = lo + Math.imul(al5, bl1) | 0;
          mid = mid + Math.imul(al5, bh1) | 0;
          mid = mid + Math.imul(ah5, bl1) | 0;
          hi = hi + Math.imul(ah5, bh1) | 0;
          lo = lo + Math.imul(al4, bl2) | 0;
          mid = mid + Math.imul(al4, bh2) | 0;
          mid = mid + Math.imul(ah4, bl2) | 0;
          hi = hi + Math.imul(ah4, bh2) | 0;
          lo = lo + Math.imul(al3, bl3) | 0;
          mid = mid + Math.imul(al3, bh3) | 0;
          mid = mid + Math.imul(ah3, bl3) | 0;
          hi = hi + Math.imul(ah3, bh3) | 0;
          lo = lo + Math.imul(al2, bl4) | 0;
          mid = mid + Math.imul(al2, bh4) | 0;
          mid = mid + Math.imul(ah2, bl4) | 0;
          hi = hi + Math.imul(ah2, bh4) | 0;
          lo = lo + Math.imul(al1, bl5) | 0;
          mid = mid + Math.imul(al1, bh5) | 0;
          mid = mid + Math.imul(ah1, bl5) | 0;
          hi = hi + Math.imul(ah1, bh5) | 0;
          lo = lo + Math.imul(al0, bl6) | 0;
          mid = mid + Math.imul(al0, bh6) | 0;
          mid = mid + Math.imul(ah0, bl6) | 0;
          hi = hi + Math.imul(ah0, bh6) | 0;
          var w6 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
          w6 &= 0x3ffffff;
          /* k = 7 */
          lo = Math.imul(al7, bl0);
          mid = Math.imul(al7, bh0);
          mid = mid + Math.imul(ah7, bl0) | 0;
          hi = Math.imul(ah7, bh0);
          lo = lo + Math.imul(al6, bl1) | 0;
          mid = mid + Math.imul(al6, bh1) | 0;
          mid = mid + Math.imul(ah6, bl1) | 0;
          hi = hi + Math.imul(ah6, bh1) | 0;
          lo = lo + Math.imul(al5, bl2) | 0;
          mid = mid + Math.imul(al5, bh2) | 0;
          mid = mid + Math.imul(ah5, bl2) | 0;
          hi = hi + Math.imul(ah5, bh2) | 0;
          lo = lo + Math.imul(al4, bl3) | 0;
          mid = mid + Math.imul(al4, bh3) | 0;
          mid = mid + Math.imul(ah4, bl3) | 0;
          hi = hi + Math.imul(ah4, bh3) | 0;
          lo = lo + Math.imul(al3, bl4) | 0;
          mid = mid + Math.imul(al3, bh4) | 0;
          mid = mid + Math.imul(ah3, bl4) | 0;
          hi = hi + Math.imul(ah3, bh4) | 0;
          lo = lo + Math.imul(al2, bl5) | 0;
          mid = mid + Math.imul(al2, bh5) | 0;
          mid = mid + Math.imul(ah2, bl5) | 0;
          hi = hi + Math.imul(ah2, bh5) | 0;
          lo = lo + Math.imul(al1, bl6) | 0;
          mid = mid + Math.imul(al1, bh6) | 0;
          mid = mid + Math.imul(ah1, bl6) | 0;
          hi = hi + Math.imul(ah1, bh6) | 0;
          lo = lo + Math.imul(al0, bl7) | 0;
          mid = mid + Math.imul(al0, bh7) | 0;
          mid = mid + Math.imul(ah0, bl7) | 0;
          hi = hi + Math.imul(ah0, bh7) | 0;
          var w7 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
          w7 &= 0x3ffffff;
          /* k = 8 */
          lo = Math.imul(al8, bl0);
          mid = Math.imul(al8, bh0);
          mid = mid + Math.imul(ah8, bl0) | 0;
          hi = Math.imul(ah8, bh0);
          lo = lo + Math.imul(al7, bl1) | 0;
          mid = mid + Math.imul(al7, bh1) | 0;
          mid = mid + Math.imul(ah7, bl1) | 0;
          hi = hi + Math.imul(ah7, bh1) | 0;
          lo = lo + Math.imul(al6, bl2) | 0;
          mid = mid + Math.imul(al6, bh2) | 0;
          mid = mid + Math.imul(ah6, bl2) | 0;
          hi = hi + Math.imul(ah6, bh2) | 0;
          lo = lo + Math.imul(al5, bl3) | 0;
          mid = mid + Math.imul(al5, bh3) | 0;
          mid = mid + Math.imul(ah5, bl3) | 0;
          hi = hi + Math.imul(ah5, bh3) | 0;
          lo = lo + Math.imul(al4, bl4) | 0;
          mid = mid + Math.imul(al4, bh4) | 0;
          mid = mid + Math.imul(ah4, bl4) | 0;
          hi = hi + Math.imul(ah4, bh4) | 0;
          lo = lo + Math.imul(al3, bl5) | 0;
          mid = mid + Math.imul(al3, bh5) | 0;
          mid = mid + Math.imul(ah3, bl5) | 0;
          hi = hi + Math.imul(ah3, bh5) | 0;
          lo = lo + Math.imul(al2, bl6) | 0;
          mid = mid + Math.imul(al2, bh6) | 0;
          mid = mid + Math.imul(ah2, bl6) | 0;
          hi = hi + Math.imul(ah2, bh6) | 0;
          lo = lo + Math.imul(al1, bl7) | 0;
          mid = mid + Math.imul(al1, bh7) | 0;
          mid = mid + Math.imul(ah1, bl7) | 0;
          hi = hi + Math.imul(ah1, bh7) | 0;
          lo = lo + Math.imul(al0, bl8) | 0;
          mid = mid + Math.imul(al0, bh8) | 0;
          mid = mid + Math.imul(ah0, bl8) | 0;
          hi = hi + Math.imul(ah0, bh8) | 0;
          var w8 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
          w8 &= 0x3ffffff;
          /* k = 9 */
          lo = Math.imul(al9, bl0);
          mid = Math.imul(al9, bh0);
          mid = mid + Math.imul(ah9, bl0) | 0;
          hi = Math.imul(ah9, bh0);
          lo = lo + Math.imul(al8, bl1) | 0;
          mid = mid + Math.imul(al8, bh1) | 0;
          mid = mid + Math.imul(ah8, bl1) | 0;
          hi = hi + Math.imul(ah8, bh1) | 0;
          lo = lo + Math.imul(al7, bl2) | 0;
          mid = mid + Math.imul(al7, bh2) | 0;
          mid = mid + Math.imul(ah7, bl2) | 0;
          hi = hi + Math.imul(ah7, bh2) | 0;
          lo = lo + Math.imul(al6, bl3) | 0;
          mid = mid + Math.imul(al6, bh3) | 0;
          mid = mid + Math.imul(ah6, bl3) | 0;
          hi = hi + Math.imul(ah6, bh3) | 0;
          lo = lo + Math.imul(al5, bl4) | 0;
          mid = mid + Math.imul(al5, bh4) | 0;
          mid = mid + Math.imul(ah5, bl4) | 0;
          hi = hi + Math.imul(ah5, bh4) | 0;
          lo = lo + Math.imul(al4, bl5) | 0;
          mid = mid + Math.imul(al4, bh5) | 0;
          mid = mid + Math.imul(ah4, bl5) | 0;
          hi = hi + Math.imul(ah4, bh5) | 0;
          lo = lo + Math.imul(al3, bl6) | 0;
          mid = mid + Math.imul(al3, bh6) | 0;
          mid = mid + Math.imul(ah3, bl6) | 0;
          hi = hi + Math.imul(ah3, bh6) | 0;
          lo = lo + Math.imul(al2, bl7) | 0;
          mid = mid + Math.imul(al2, bh7) | 0;
          mid = mid + Math.imul(ah2, bl7) | 0;
          hi = hi + Math.imul(ah2, bh7) | 0;
          lo = lo + Math.imul(al1, bl8) | 0;
          mid = mid + Math.imul(al1, bh8) | 0;
          mid = mid + Math.imul(ah1, bl8) | 0;
          hi = hi + Math.imul(ah1, bh8) | 0;
          lo = lo + Math.imul(al0, bl9) | 0;
          mid = mid + Math.imul(al0, bh9) | 0;
          mid = mid + Math.imul(ah0, bl9) | 0;
          hi = hi + Math.imul(ah0, bh9) | 0;
          var w9 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
          w9 &= 0x3ffffff;
          /* k = 10 */
          lo = Math.imul(al9, bl1);
          mid = Math.imul(al9, bh1);
          mid = mid + Math.imul(ah9, bl1) | 0;
          hi = Math.imul(ah9, bh1);
          lo = lo + Math.imul(al8, bl2) | 0;
          mid = mid + Math.imul(al8, bh2) | 0;
          mid = mid + Math.imul(ah8, bl2) | 0;
          hi = hi + Math.imul(ah8, bh2) | 0;
          lo = lo + Math.imul(al7, bl3) | 0;
          mid = mid + Math.imul(al7, bh3) | 0;
          mid = mid + Math.imul(ah7, bl3) | 0;
          hi = hi + Math.imul(ah7, bh3) | 0;
          lo = lo + Math.imul(al6, bl4) | 0;
          mid = mid + Math.imul(al6, bh4) | 0;
          mid = mid + Math.imul(ah6, bl4) | 0;
          hi = hi + Math.imul(ah6, bh4) | 0;
          lo = lo + Math.imul(al5, bl5) | 0;
          mid = mid + Math.imul(al5, bh5) | 0;
          mid = mid + Math.imul(ah5, bl5) | 0;
          hi = hi + Math.imul(ah5, bh5) | 0;
          lo = lo + Math.imul(al4, bl6) | 0;
          mid = mid + Math.imul(al4, bh6) | 0;
          mid = mid + Math.imul(ah4, bl6) | 0;
          hi = hi + Math.imul(ah4, bh6) | 0;
          lo = lo + Math.imul(al3, bl7) | 0;
          mid = mid + Math.imul(al3, bh7) | 0;
          mid = mid + Math.imul(ah3, bl7) | 0;
          hi = hi + Math.imul(ah3, bh7) | 0;
          lo = lo + Math.imul(al2, bl8) | 0;
          mid = mid + Math.imul(al2, bh8) | 0;
          mid = mid + Math.imul(ah2, bl8) | 0;
          hi = hi + Math.imul(ah2, bh8) | 0;
          lo = lo + Math.imul(al1, bl9) | 0;
          mid = mid + Math.imul(al1, bh9) | 0;
          mid = mid + Math.imul(ah1, bl9) | 0;
          hi = hi + Math.imul(ah1, bh9) | 0;
          var w10 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
          w10 &= 0x3ffffff;
          /* k = 11 */
          lo = Math.imul(al9, bl2);
          mid = Math.imul(al9, bh2);
          mid = mid + Math.imul(ah9, bl2) | 0;
          hi = Math.imul(ah9, bh2);
          lo = lo + Math.imul(al8, bl3) | 0;
          mid = mid + Math.imul(al8, bh3) | 0;
          mid = mid + Math.imul(ah8, bl3) | 0;
          hi = hi + Math.imul(ah8, bh3) | 0;
          lo = lo + Math.imul(al7, bl4) | 0;
          mid = mid + Math.imul(al7, bh4) | 0;
          mid = mid + Math.imul(ah7, bl4) | 0;
          hi = hi + Math.imul(ah7, bh4) | 0;
          lo = lo + Math.imul(al6, bl5) | 0;
          mid = mid + Math.imul(al6, bh5) | 0;
          mid = mid + Math.imul(ah6, bl5) | 0;
          hi = hi + Math.imul(ah6, bh5) | 0;
          lo = lo + Math.imul(al5, bl6) | 0;
          mid = mid + Math.imul(al5, bh6) | 0;
          mid = mid + Math.imul(ah5, bl6) | 0;
          hi = hi + Math.imul(ah5, bh6) | 0;
          lo = lo + Math.imul(al4, bl7) | 0;
          mid = mid + Math.imul(al4, bh7) | 0;
          mid = mid + Math.imul(ah4, bl7) | 0;
          hi = hi + Math.imul(ah4, bh7) | 0;
          lo = lo + Math.imul(al3, bl8) | 0;
          mid = mid + Math.imul(al3, bh8) | 0;
          mid = mid + Math.imul(ah3, bl8) | 0;
          hi = hi + Math.imul(ah3, bh8) | 0;
          lo = lo + Math.imul(al2, bl9) | 0;
          mid = mid + Math.imul(al2, bh9) | 0;
          mid = mid + Math.imul(ah2, bl9) | 0;
          hi = hi + Math.imul(ah2, bh9) | 0;
          var w11 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
          w11 &= 0x3ffffff;
          /* k = 12 */
          lo = Math.imul(al9, bl3);
          mid = Math.imul(al9, bh3);
          mid = mid + Math.imul(ah9, bl3) | 0;
          hi = Math.imul(ah9, bh3);
          lo = lo + Math.imul(al8, bl4) | 0;
          mid = mid + Math.imul(al8, bh4) | 0;
          mid = mid + Math.imul(ah8, bl4) | 0;
          hi = hi + Math.imul(ah8, bh4) | 0;
          lo = lo + Math.imul(al7, bl5) | 0;
          mid = mid + Math.imul(al7, bh5) | 0;
          mid = mid + Math.imul(ah7, bl5) | 0;
          hi = hi + Math.imul(ah7, bh5) | 0;
          lo = lo + Math.imul(al6, bl6) | 0;
          mid = mid + Math.imul(al6, bh6) | 0;
          mid = mid + Math.imul(ah6, bl6) | 0;
          hi = hi + Math.imul(ah6, bh6) | 0;
          lo = lo + Math.imul(al5, bl7) | 0;
          mid = mid + Math.imul(al5, bh7) | 0;
          mid = mid + Math.imul(ah5, bl7) | 0;
          hi = hi + Math.imul(ah5, bh7) | 0;
          lo = lo + Math.imul(al4, bl8) | 0;
          mid = mid + Math.imul(al4, bh8) | 0;
          mid = mid + Math.imul(ah4, bl8) | 0;
          hi = hi + Math.imul(ah4, bh8) | 0;
          lo = lo + Math.imul(al3, bl9) | 0;
          mid = mid + Math.imul(al3, bh9) | 0;
          mid = mid + Math.imul(ah3, bl9) | 0;
          hi = hi + Math.imul(ah3, bh9) | 0;
          var w12 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
          w12 &= 0x3ffffff;
          /* k = 13 */
          lo = Math.imul(al9, bl4);
          mid = Math.imul(al9, bh4);
          mid = mid + Math.imul(ah9, bl4) | 0;
          hi = Math.imul(ah9, bh4);
          lo = lo + Math.imul(al8, bl5) | 0;
          mid = mid + Math.imul(al8, bh5) | 0;
          mid = mid + Math.imul(ah8, bl5) | 0;
          hi = hi + Math.imul(ah8, bh5) | 0;
          lo = lo + Math.imul(al7, bl6) | 0;
          mid = mid + Math.imul(al7, bh6) | 0;
          mid = mid + Math.imul(ah7, bl6) | 0;
          hi = hi + Math.imul(ah7, bh6) | 0;
          lo = lo + Math.imul(al6, bl7) | 0;
          mid = mid + Math.imul(al6, bh7) | 0;
          mid = mid + Math.imul(ah6, bl7) | 0;
          hi = hi + Math.imul(ah6, bh7) | 0;
          lo = lo + Math.imul(al5, bl8) | 0;
          mid = mid + Math.imul(al5, bh8) | 0;
          mid = mid + Math.imul(ah5, bl8) | 0;
          hi = hi + Math.imul(ah5, bh8) | 0;
          lo = lo + Math.imul(al4, bl9) | 0;
          mid = mid + Math.imul(al4, bh9) | 0;
          mid = mid + Math.imul(ah4, bl9) | 0;
          hi = hi + Math.imul(ah4, bh9) | 0;
          var w13 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
          w13 &= 0x3ffffff;
          /* k = 14 */
          lo = Math.imul(al9, bl5);
          mid = Math.imul(al9, bh5);
          mid = mid + Math.imul(ah9, bl5) | 0;
          hi = Math.imul(ah9, bh5);
          lo = lo + Math.imul(al8, bl6) | 0;
          mid = mid + Math.imul(al8, bh6) | 0;
          mid = mid + Math.imul(ah8, bl6) | 0;
          hi = hi + Math.imul(ah8, bh6) | 0;
          lo = lo + Math.imul(al7, bl7) | 0;
          mid = mid + Math.imul(al7, bh7) | 0;
          mid = mid + Math.imul(ah7, bl7) | 0;
          hi = hi + Math.imul(ah7, bh7) | 0;
          lo = lo + Math.imul(al6, bl8) | 0;
          mid = mid + Math.imul(al6, bh8) | 0;
          mid = mid + Math.imul(ah6, bl8) | 0;
          hi = hi + Math.imul(ah6, bh8) | 0;
          lo = lo + Math.imul(al5, bl9) | 0;
          mid = mid + Math.imul(al5, bh9) | 0;
          mid = mid + Math.imul(ah5, bl9) | 0;
          hi = hi + Math.imul(ah5, bh9) | 0;
          var w14 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
          w14 &= 0x3ffffff;
          /* k = 15 */
          lo = Math.imul(al9, bl6);
          mid = Math.imul(al9, bh6);
          mid = mid + Math.imul(ah9, bl6) | 0;
          hi = Math.imul(ah9, bh6);
          lo = lo + Math.imul(al8, bl7) | 0;
          mid = mid + Math.imul(al8, bh7) | 0;
          mid = mid + Math.imul(ah8, bl7) | 0;
          hi = hi + Math.imul(ah8, bh7) | 0;
          lo = lo + Math.imul(al7, bl8) | 0;
          mid = mid + Math.imul(al7, bh8) | 0;
          mid = mid + Math.imul(ah7, bl8) | 0;
          hi = hi + Math.imul(ah7, bh8) | 0;
          lo = lo + Math.imul(al6, bl9) | 0;
          mid = mid + Math.imul(al6, bh9) | 0;
          mid = mid + Math.imul(ah6, bl9) | 0;
          hi = hi + Math.imul(ah6, bh9) | 0;
          var w15 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
          w15 &= 0x3ffffff;
          /* k = 16 */
          lo = Math.imul(al9, bl7);
          mid = Math.imul(al9, bh7);
          mid = mid + Math.imul(ah9, bl7) | 0;
          hi = Math.imul(ah9, bh7);
          lo = lo + Math.imul(al8, bl8) | 0;
          mid = mid + Math.imul(al8, bh8) | 0;
          mid = mid + Math.imul(ah8, bl8) | 0;
          hi = hi + Math.imul(ah8, bh8) | 0;
          lo = lo + Math.imul(al7, bl9) | 0;
          mid = mid + Math.imul(al7, bh9) | 0;
          mid = mid + Math.imul(ah7, bl9) | 0;
          hi = hi + Math.imul(ah7, bh9) | 0;
          var w16 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
          w16 &= 0x3ffffff;
          /* k = 17 */
          lo = Math.imul(al9, bl8);
          mid = Math.imul(al9, bh8);
          mid = mid + Math.imul(ah9, bl8) | 0;
          hi = Math.imul(ah9, bh8);
          lo = lo + Math.imul(al8, bl9) | 0;
          mid = mid + Math.imul(al8, bh9) | 0;
          mid = mid + Math.imul(ah8, bl9) | 0;
          hi = hi + Math.imul(ah8, bh9) | 0;
          var w17 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
          w17 &= 0x3ffffff;
          /* k = 18 */
          lo = Math.imul(al9, bl9);
          mid = Math.imul(al9, bh9);
          mid = mid + Math.imul(ah9, bl9) | 0;
          hi = Math.imul(ah9, bh9);
          var w18 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
          w18 &= 0x3ffffff;
          o[0] = w0;
          o[1] = w1;
          o[2] = w2;
          o[3] = w3;
          o[4] = w4;
          o[5] = w5;
          o[6] = w6;
          o[7] = w7;
          o[8] = w8;
          o[9] = w9;
          o[10] = w10;
          o[11] = w11;
          o[12] = w12;
          o[13] = w13;
          o[14] = w14;
          o[15] = w15;
          o[16] = w16;
          o[17] = w17;
          o[18] = w18;
          if (c !== 0) {
            o[19] = c;
            out.length++;
          }
          return out;
        };

        // Polyfill comb
        if (!Math.imul) {
          comb10MulTo = smallMulTo;
        }

        function bigMulTo(self, num, out) {
          out.negative = num.negative ^ self.negative;
          out.length = self.length + num.length;

          var carry = 0;
          var hncarry = 0;
          for (var k = 0; k < out.length - 1; k++) {
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = hncarry;
            hncarry = 0;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
              var i = k - j;
              var a = self.words[i] | 0;
              var b = num.words[j] | 0;
              var r = a * b;

              var lo = r & 0x3ffffff;
              ncarry = ncarry + (r / 0x4000000 | 0) | 0;
              lo = lo + rword | 0;
              rword = lo & 0x3ffffff;
              ncarry = ncarry + (lo >>> 26) | 0;

              hncarry += ncarry >>> 26;
              ncarry &= 0x3ffffff;
            }
            out.words[k] = rword;
            carry = ncarry;
            ncarry = hncarry;
          }
          if (carry !== 0) {
            out.words[k] = carry;
          } else {
            out.length--;
          }

          return out.strip();
        }

        function jumboMulTo(self, num, out) {
          var fftm = new FFTM();
          return fftm.mulp(self, num, out);
        }

        BN.prototype.mulTo = function mulTo(num, out) {
          var res;
          var len = this.length + num.length;
          if (this.length === 10 && num.length === 10) {
            res = comb10MulTo(this, num, out);
          } else if (len < 63) {
            res = smallMulTo(this, num, out);
          } else if (len < 1024) {
            res = bigMulTo(this, num, out);
          } else {
            res = jumboMulTo(this, num, out);
          }

          return res;
        };

        // Cooley-Tukey algorithm for FFT
        // slightly revisited to rely on looping instead of recursion

        function FFTM(x, y) {
          this.x = x;
          this.y = y;
        }

        FFTM.prototype.makeRBT = function makeRBT(N) {
          var t = new Array(N);
          var l = BN.prototype._countBits(N) - 1;
          for (var i = 0; i < N; i++) {
            t[i] = this.revBin(i, l, N);
          }

          return t;
        };

        // Returns binary-reversed representation of `x`
        FFTM.prototype.revBin = function revBin(x, l, N) {
          if (x === 0 || x === N - 1) return x;

          var rb = 0;
          for (var i = 0; i < l; i++) {
            rb |= (x & 1) << l - i - 1;
            x >>= 1;
          }

          return rb;
        };

        // Performs "tweedling" phase, therefore 'emulating'
        // behaviour of the recursive algorithm
        FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
          for (var i = 0; i < N; i++) {
            rtws[i] = rws[rbt[i]];
            itws[i] = iws[rbt[i]];
          }
        };

        FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
          this.permute(rbt, rws, iws, rtws, itws, N);

          for (var s = 1; s < N; s <<= 1) {
            var l = s << 1;

            var rtwdf = Math.cos(2 * Math.PI / l);
            var itwdf = Math.sin(2 * Math.PI / l);

            for (var p = 0; p < N; p += l) {
              var rtwdf_ = rtwdf;
              var itwdf_ = itwdf;

              for (var j = 0; j < s; j++) {
                var re = rtws[p + j];
                var ie = itws[p + j];

                var ro = rtws[p + j + s];
                var io = itws[p + j + s];

                var rx = rtwdf_ * ro - itwdf_ * io;

                io = rtwdf_ * io + itwdf_ * ro;
                ro = rx;

                rtws[p + j] = re + ro;
                itws[p + j] = ie + io;

                rtws[p + j + s] = re - ro;
                itws[p + j + s] = ie - io;

                /* jshint maxdepth : false */
                if (j !== l) {
                  rx = rtwdf * rtwdf_ - itwdf * itwdf_;

                  itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                  rtwdf_ = rx;
                }
              }
            }
          }
        };

        FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
          var N = Math.max(m, n) | 1;
          var odd = N & 1;
          var i = 0;
          for (N = N / 2 | 0; N; N = N >>> 1) {
            i++;
          }

          return 1 << i + 1 + odd;
        };

        FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
          if (N <= 1) return;

          for (var i = 0; i < N / 2; i++) {
            var t = rws[i];

            rws[i] = rws[N - i - 1];
            rws[N - i - 1] = t;

            t = iws[i];

            iws[i] = -iws[N - i - 1];
            iws[N - i - 1] = -t;
          }
        };

        FFTM.prototype.normalize13b = function normalize13b(ws, N) {
          var carry = 0;
          for (var i = 0; i < N / 2; i++) {
            var w = Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;

            ws[i] = w & 0x3ffffff;

            if (w < 0x4000000) {
              carry = 0;
            } else {
              carry = w / 0x4000000 | 0;
            }
          }

          return ws;
        };

        FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
          var carry = 0;
          for (var i = 0; i < len; i++) {
            carry = carry + (ws[i] | 0);

            rws[2 * i] = carry & 0x1fff;carry = carry >>> 13;
            rws[2 * i + 1] = carry & 0x1fff;carry = carry >>> 13;
          }

          // Pad with zeroes
          for (i = 2 * len; i < N; ++i) {
            rws[i] = 0;
          }

          assert(carry === 0);
          assert((carry & ~0x1fff) === 0);
        };

        FFTM.prototype.stub = function stub(N) {
          var ph = new Array(N);
          for (var i = 0; i < N; i++) {
            ph[i] = 0;
          }

          return ph;
        };

        FFTM.prototype.mulp = function mulp(x, y, out) {
          var N = 2 * this.guessLen13b(x.length, y.length);

          var rbt = this.makeRBT(N);

          var _ = this.stub(N);

          var rws = new Array(N);
          var rwst = new Array(N);
          var iwst = new Array(N);

          var nrws = new Array(N);
          var nrwst = new Array(N);
          var niwst = new Array(N);

          var rmws = out.words;
          rmws.length = N;

          this.convert13b(x.words, x.length, rws, N);
          this.convert13b(y.words, y.length, nrws, N);

          this.transform(rws, _, rwst, iwst, N, rbt);
          this.transform(nrws, _, nrwst, niwst, N, rbt);

          for (var i = 0; i < N; i++) {
            var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
            iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
            rwst[i] = rx;
          }

          this.conjugate(rwst, iwst, N);
          this.transform(rwst, iwst, rmws, _, N, rbt);
          this.conjugate(rmws, _, N);
          this.normalize13b(rmws, N);

          out.negative = x.negative ^ y.negative;
          out.length = x.length + y.length;
          return out.strip();
        };

        // Multiply `this` by `num`
        BN.prototype.mul = function mul(num) {
          var out = new BN(null);
          out.words = new Array(this.length + num.length);
          return this.mulTo(num, out);
        };

        // Multiply employing FFT
        BN.prototype.mulf = function mulf(num) {
          var out = new BN(null);
          out.words = new Array(this.length + num.length);
          return jumboMulTo(this, num, out);
        };

        // In-place Multiplication
        BN.prototype.imul = function imul(num) {
          return this.clone().mulTo(num, this);
        };

        BN.prototype.imuln = function imuln(num) {
          assert(typeof num === 'number');
          assert(num < 0x4000000);

          // Carry
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = (this.words[i] | 0) * num;
            var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
            carry >>= 26;
            carry += w / 0x4000000 | 0;
            // NOTE: lo is 27bit maximum
            carry += lo >>> 26;
            this.words[i] = lo & 0x3ffffff;
          }

          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }

          return this;
        };

        BN.prototype.muln = function muln(num) {
          return this.clone().imuln(num);
        };

        // `this` * `this`
        BN.prototype.sqr = function sqr() {
          return this.mul(this);
        };

        // `this` * `this` in-place
        BN.prototype.isqr = function isqr() {
          return this.imul(this.clone());
        };

        // Math.pow(`this`, `num`)
        BN.prototype.pow = function pow(num) {
          var w = toBitArray(num);
          if (w.length === 0) return new BN(1);

          // Skip leading zeroes
          var res = this;
          for (var i = 0; i < w.length; i++, res = res.sqr()) {
            if (w[i] !== 0) break;
          }

          if (++i < w.length) {
            for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
              if (w[i] === 0) continue;

              res = res.mul(q);
            }
          }

          return res;
        };

        // Shift-left in-place
        BN.prototype.iushln = function iushln(bits) {
          assert(typeof bits === 'number' && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;
          var carryMask = 0x3ffffff >>> 26 - r << 26 - r;
          var i;

          if (r !== 0) {
            var carry = 0;

            for (i = 0; i < this.length; i++) {
              var newCarry = this.words[i] & carryMask;
              var c = (this.words[i] | 0) - newCarry << r;
              this.words[i] = c | carry;
              carry = newCarry >>> 26 - r;
            }

            if (carry) {
              this.words[i] = carry;
              this.length++;
            }
          }

          if (s !== 0) {
            for (i = this.length - 1; i >= 0; i--) {
              this.words[i + s] = this.words[i];
            }

            for (i = 0; i < s; i++) {
              this.words[i] = 0;
            }

            this.length += s;
          }

          return this.strip();
        };

        BN.prototype.ishln = function ishln(bits) {
          // TODO(indutny): implement me
          assert(this.negative === 0);
          return this.iushln(bits);
        };

        // Shift-right in-place
        // NOTE: `hint` is a lowest bit before trailing zeroes
        // NOTE: if `extended` is present - it will be filled with destroyed bits
        BN.prototype.iushrn = function iushrn(bits, hint, extended) {
          assert(typeof bits === 'number' && bits >= 0);
          var h;
          if (hint) {
            h = (hint - hint % 26) / 26;
          } else {
            h = 0;
          }

          var r = bits % 26;
          var s = Math.min((bits - r) / 26, this.length);
          var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
          var maskedWords = extended;

          h -= s;
          h = Math.max(0, h);

          // Extended mode, copy masked part
          if (maskedWords) {
            for (var i = 0; i < s; i++) {
              maskedWords.words[i] = this.words[i];
            }
            maskedWords.length = s;
          }

          if (s === 0) {
            // No-op, we should not move anything at all
          } else if (this.length > s) {
            this.length -= s;
            for (i = 0; i < this.length; i++) {
              this.words[i] = this.words[i + s];
            }
          } else {
            this.words[0] = 0;
            this.length = 1;
          }

          var carry = 0;
          for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
            var word = this.words[i] | 0;
            this.words[i] = carry << 26 - r | word >>> r;
            carry = word & mask;
          }

          // Push carried bits as a mask
          if (maskedWords && carry !== 0) {
            maskedWords.words[maskedWords.length++] = carry;
          }

          if (this.length === 0) {
            this.words[0] = 0;
            this.length = 1;
          }

          return this.strip();
        };

        BN.prototype.ishrn = function ishrn(bits, hint, extended) {
          // TODO(indutny): implement me
          assert(this.negative === 0);
          return this.iushrn(bits, hint, extended);
        };

        // Shift-left
        BN.prototype.shln = function shln(bits) {
          return this.clone().ishln(bits);
        };

        BN.prototype.ushln = function ushln(bits) {
          return this.clone().iushln(bits);
        };

        // Shift-right
        BN.prototype.shrn = function shrn(bits) {
          return this.clone().ishrn(bits);
        };

        BN.prototype.ushrn = function ushrn(bits) {
          return this.clone().iushrn(bits);
        };

        // Test if n bit is set
        BN.prototype.testn = function testn(bit) {
          assert(typeof bit === 'number' && bit >= 0);
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;

          // Fast case: bit is much higher than all existing words
          if (this.length <= s) return false;

          // Check bit and return
          var w = this.words[s];

          return !!(w & q);
        };

        // Return only lowers bits of number (in-place)
        BN.prototype.imaskn = function imaskn(bits) {
          assert(typeof bits === 'number' && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;

          assert(this.negative === 0, 'imaskn works only with positive numbers');

          if (this.length <= s) {
            return this;
          }

          if (r !== 0) {
            s++;
          }
          this.length = Math.min(s, this.length);

          if (r !== 0) {
            var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
            this.words[this.length - 1] &= mask;
          }

          return this.strip();
        };

        // Return only lowers bits of number
        BN.prototype.maskn = function maskn(bits) {
          return this.clone().imaskn(bits);
        };

        // Add plain number `num` to `this`
        BN.prototype.iaddn = function iaddn(num) {
          assert(typeof num === 'number');
          assert(num < 0x4000000);
          if (num < 0) return this.isubn(-num);

          // Possible sign change
          if (this.negative !== 0) {
            if (this.length === 1 && (this.words[0] | 0) < num) {
              this.words[0] = num - (this.words[0] | 0);
              this.negative = 0;
              return this;
            }

            this.negative = 0;
            this.isubn(num);
            this.negative = 1;
            return this;
          }

          // Add without checks
          return this._iaddn(num);
        };

        BN.prototype._iaddn = function _iaddn(num) {
          this.words[0] += num;

          // Carry
          for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
            this.words[i] -= 0x4000000;
            if (i === this.length - 1) {
              this.words[i + 1] = 1;
            } else {
              this.words[i + 1]++;
            }
          }
          this.length = Math.max(this.length, i + 1);

          return this;
        };

        // Subtract plain number `num` from `this`
        BN.prototype.isubn = function isubn(num) {
          assert(typeof num === 'number');
          assert(num < 0x4000000);
          if (num < 0) return this.iaddn(-num);

          if (this.negative !== 0) {
            this.negative = 0;
            this.iaddn(num);
            this.negative = 1;
            return this;
          }

          this.words[0] -= num;

          if (this.length === 1 && this.words[0] < 0) {
            this.words[0] = -this.words[0];
            this.negative = 1;
          } else {
            // Carry
            for (var i = 0; i < this.length && this.words[i] < 0; i++) {
              this.words[i] += 0x4000000;
              this.words[i + 1] -= 1;
            }
          }

          return this.strip();
        };

        BN.prototype.addn = function addn(num) {
          return this.clone().iaddn(num);
        };

        BN.prototype.subn = function subn(num) {
          return this.clone().isubn(num);
        };

        BN.prototype.iabs = function iabs() {
          this.negative = 0;

          return this;
        };

        BN.prototype.abs = function abs() {
          return this.clone().iabs();
        };

        BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
          var len = num.length + shift;
          var i;

          this._expand(len);

          var w;
          var carry = 0;
          for (i = 0; i < num.length; i++) {
            w = (this.words[i + shift] | 0) + carry;
            var right = (num.words[i] | 0) * mul;
            w -= right & 0x3ffffff;
            carry = (w >> 26) - (right / 0x4000000 | 0);
            this.words[i + shift] = w & 0x3ffffff;
          }
          for (; i < this.length - shift; i++) {
            w = (this.words[i + shift] | 0) + carry;
            carry = w >> 26;
            this.words[i + shift] = w & 0x3ffffff;
          }

          if (carry === 0) return this.strip();

          // Subtraction overflow
          assert(carry === -1);
          carry = 0;
          for (i = 0; i < this.length; i++) {
            w = -(this.words[i] | 0) + carry;
            carry = w >> 26;
            this.words[i] = w & 0x3ffffff;
          }
          this.negative = 1;

          return this.strip();
        };

        BN.prototype._wordDiv = function _wordDiv(num, mode) {
          var shift = this.length - num.length;

          var a = this.clone();
          var b = num;

          // Normalize
          var bhi = b.words[b.length - 1] | 0;
          var bhiBits = this._countBits(bhi);
          shift = 26 - bhiBits;
          if (shift !== 0) {
            b = b.ushln(shift);
            a.iushln(shift);
            bhi = b.words[b.length - 1] | 0;
          }

          // Initialize quotient
          var m = a.length - b.length;
          var q;

          if (mode !== 'mod') {
            q = new BN(null);
            q.length = m + 1;
            q.words = new Array(q.length);
            for (var i = 0; i < q.length; i++) {
              q.words[i] = 0;
            }
          }

          var diff = a.clone()._ishlnsubmul(b, 1, m);
          if (diff.negative === 0) {
            a = diff;
            if (q) {
              q.words[m] = 1;
            }
          }

          for (var j = m - 1; j >= 0; j--) {
            var qj = (a.words[b.length + j] | 0) * 0x4000000 + (a.words[b.length + j - 1] | 0);

            // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
            // (0x7ffffff)
            qj = Math.min(qj / bhi | 0, 0x3ffffff);

            a._ishlnsubmul(b, qj, j);
            while (a.negative !== 0) {
              qj--;
              a.negative = 0;
              a._ishlnsubmul(b, 1, j);
              if (!a.isZero()) {
                a.negative ^= 1;
              }
            }
            if (q) {
              q.words[j] = qj;
            }
          }
          if (q) {
            q.strip();
          }
          a.strip();

          // Denormalize
          if (mode !== 'div' && shift !== 0) {
            a.iushrn(shift);
          }

          return {
            div: q || null,
            mod: a
          };
        };

        // NOTE: 1) `mode` can be set to `mod` to request mod only,
        //       to `div` to request div only, or be absent to
        //       request both div & mod
        //       2) `positive` is true if unsigned mod is requested
        BN.prototype.divmod = function divmod(num, mode, positive) {
          assert(!num.isZero());

          if (this.isZero()) {
            return {
              div: new BN(0),
              mod: new BN(0)
            };
          }

          var div, mod, res;
          if (this.negative !== 0 && num.negative === 0) {
            res = this.neg().divmod(num, mode);

            if (mode !== 'mod') {
              div = res.div.neg();
            }

            if (mode !== 'div') {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.iadd(num);
              }
            }

            return {
              div: div,
              mod: mod
            };
          }

          if (this.negative === 0 && num.negative !== 0) {
            res = this.divmod(num.neg(), mode);

            if (mode !== 'mod') {
              div = res.div.neg();
            }

            return {
              div: div,
              mod: res.mod
            };
          }

          if ((this.negative & num.negative) !== 0) {
            res = this.neg().divmod(num.neg(), mode);

            if (mode !== 'div') {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.isub(num);
              }
            }

            return {
              div: res.div,
              mod: mod
            };
          }

          // Both numbers are positive at this point

          // Strip both numbers to approximate shift value
          if (num.length > this.length || this.cmp(num) < 0) {
            return {
              div: new BN(0),
              mod: this
            };
          }

          // Very short reduction
          if (num.length === 1) {
            if (mode === 'div') {
              return {
                div: this.divn(num.words[0]),
                mod: null
              };
            }

            if (mode === 'mod') {
              return {
                div: null,
                mod: new BN(this.modn(num.words[0]))
              };
            }

            return {
              div: this.divn(num.words[0]),
              mod: new BN(this.modn(num.words[0]))
            };
          }

          return this._wordDiv(num, mode);
        };

        // Find `this` / `num`
        BN.prototype.div = function div(num) {
          return this.divmod(num, 'div', false).div;
        };

        // Find `this` % `num`
        BN.prototype.mod = function mod(num) {
          return this.divmod(num, 'mod', false).mod;
        };

        BN.prototype.umod = function umod(num) {
          return this.divmod(num, 'mod', true).mod;
        };

        // Find Round(`this` / `num`)
        BN.prototype.divRound = function divRound(num) {
          var dm = this.divmod(num);

          // Fast case - exact division
          if (dm.mod.isZero()) return dm.div;

          var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

          var half = num.ushrn(1);
          var r2 = num.andln(1);
          var cmp = mod.cmp(half);

          // Round down
          if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

          // Round up
          return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
        };

        BN.prototype.modn = function modn(num) {
          assert(num <= 0x3ffffff);
          var p = (1 << 26) % num;

          var acc = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            acc = (p * acc + (this.words[i] | 0)) % num;
          }

          return acc;
        };

        // In-place division by number
        BN.prototype.idivn = function idivn(num) {
          assert(num <= 0x3ffffff);

          var carry = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var w = (this.words[i] | 0) + carry * 0x4000000;
            this.words[i] = w / num | 0;
            carry = w % num;
          }

          return this.strip();
        };

        BN.prototype.divn = function divn(num) {
          return this.clone().idivn(num);
        };

        BN.prototype.egcd = function egcd(p) {
          assert(p.negative === 0);
          assert(!p.isZero());

          var x = this;
          var y = p.clone();

          if (x.negative !== 0) {
            x = x.umod(p);
          } else {
            x = x.clone();
          }

          // A * x + B * y = x
          var A = new BN(1);
          var B = new BN(0);

          // C * x + D * y = y
          var C = new BN(0);
          var D = new BN(1);

          var g = 0;

          while (x.isEven() && y.isEven()) {
            x.iushrn(1);
            y.iushrn(1);
            ++g;
          }

          var yp = y.clone();
          var xp = x.clone();

          while (!x.isZero()) {
            for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1) {}
            if (i > 0) {
              x.iushrn(i);
              while (i-- > 0) {
                if (A.isOdd() || B.isOdd()) {
                  A.iadd(yp);
                  B.isub(xp);
                }

                A.iushrn(1);
                B.iushrn(1);
              }
            }

            for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) {}
            if (j > 0) {
              y.iushrn(j);
              while (j-- > 0) {
                if (C.isOdd() || D.isOdd()) {
                  C.iadd(yp);
                  D.isub(xp);
                }

                C.iushrn(1);
                D.iushrn(1);
              }
            }

            if (x.cmp(y) >= 0) {
              x.isub(y);
              A.isub(C);
              B.isub(D);
            } else {
              y.isub(x);
              C.isub(A);
              D.isub(B);
            }
          }

          return {
            a: C,
            b: D,
            gcd: y.iushln(g)
          };
        };

        // This is reduced incarnation of the binary EEA
        // above, designated to invert members of the
        // _prime_ fields F(p) at a maximal speed
        BN.prototype._invmp = function _invmp(p) {
          assert(p.negative === 0);
          assert(!p.isZero());

          var a = this;
          var b = p.clone();

          if (a.negative !== 0) {
            a = a.umod(p);
          } else {
            a = a.clone();
          }

          var x1 = new BN(1);
          var x2 = new BN(0);

          var delta = b.clone();

          while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
            for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1) {}
            if (i > 0) {
              a.iushrn(i);
              while (i-- > 0) {
                if (x1.isOdd()) {
                  x1.iadd(delta);
                }

                x1.iushrn(1);
              }
            }

            for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1) {}
            if (j > 0) {
              b.iushrn(j);
              while (j-- > 0) {
                if (x2.isOdd()) {
                  x2.iadd(delta);
                }

                x2.iushrn(1);
              }
            }

            if (a.cmp(b) >= 0) {
              a.isub(b);
              x1.isub(x2);
            } else {
              b.isub(a);
              x2.isub(x1);
            }
          }

          var res;
          if (a.cmpn(1) === 0) {
            res = x1;
          } else {
            res = x2;
          }

          if (res.cmpn(0) < 0) {
            res.iadd(p);
          }

          return res;
        };

        BN.prototype.gcd = function gcd(num) {
          if (this.isZero()) return num.abs();
          if (num.isZero()) return this.abs();

          var a = this.clone();
          var b = num.clone();
          a.negative = 0;
          b.negative = 0;

          // Remove common factor of two
          for (var shift = 0; a.isEven() && b.isEven(); shift++) {
            a.iushrn(1);
            b.iushrn(1);
          }

          do {
            while (a.isEven()) {
              a.iushrn(1);
            }
            while (b.isEven()) {
              b.iushrn(1);
            }

            var r = a.cmp(b);
            if (r < 0) {
              // Swap `a` and `b` to make `a` always bigger than `b`
              var t = a;
              a = b;
              b = t;
            } else if (r === 0 || b.cmpn(1) === 0) {
              break;
            }

            a.isub(b);
          } while (true);

          return b.iushln(shift);
        };

        // Invert number in the field F(num)
        BN.prototype.invm = function invm(num) {
          return this.egcd(num).a.umod(num);
        };

        BN.prototype.isEven = function isEven() {
          return (this.words[0] & 1) === 0;
        };

        BN.prototype.isOdd = function isOdd() {
          return (this.words[0] & 1) === 1;
        };

        // And first word and num
        BN.prototype.andln = function andln(num) {
          return this.words[0] & num;
        };

        // Increment at the bit position in-line
        BN.prototype.bincn = function bincn(bit) {
          assert(typeof bit === 'number');
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;

          // Fast case: bit is much higher than all existing words
          if (this.length <= s) {
            this._expand(s + 1);
            this.words[s] |= q;
            return this;
          }

          // Add bit and propagate, if needed
          var carry = q;
          for (var i = s; carry !== 0 && i < this.length; i++) {
            var w = this.words[i] | 0;
            w += carry;
            carry = w >>> 26;
            w &= 0x3ffffff;
            this.words[i] = w;
          }
          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }
          return this;
        };

        BN.prototype.isZero = function isZero() {
          return this.length === 1 && this.words[0] === 0;
        };

        BN.prototype.cmpn = function cmpn(num) {
          var negative = num < 0;

          if (this.negative !== 0 && !negative) return -1;
          if (this.negative === 0 && negative) return 1;

          this.strip();

          var res;
          if (this.length > 1) {
            res = 1;
          } else {
            if (negative) {
              num = -num;
            }

            assert(num <= 0x3ffffff, 'Number is too big');

            var w = this.words[0] | 0;
            res = w === num ? 0 : w < num ? -1 : 1;
          }
          if (this.negative !== 0) return -res | 0;
          return res;
        };

        // Compare two numbers and return:
        // 1 - if `this` > `num`
        // 0 - if `this` == `num`
        // -1 - if `this` < `num`
        BN.prototype.cmp = function cmp(num) {
          if (this.negative !== 0 && num.negative === 0) return -1;
          if (this.negative === 0 && num.negative !== 0) return 1;

          var res = this.ucmp(num);
          if (this.negative !== 0) return -res | 0;
          return res;
        };

        // Unsigned comparison
        BN.prototype.ucmp = function ucmp(num) {
          // At this point both numbers have the same sign
          if (this.length > num.length) return 1;
          if (this.length < num.length) return -1;

          var res = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var a = this.words[i] | 0;
            var b = num.words[i] | 0;

            if (a === b) continue;
            if (a < b) {
              res = -1;
            } else if (a > b) {
              res = 1;
            }
            break;
          }
          return res;
        };

        BN.prototype.gtn = function gtn(num) {
          return this.cmpn(num) === 1;
        };

        BN.prototype.gt = function gt(num) {
          return this.cmp(num) === 1;
        };

        BN.prototype.gten = function gten(num) {
          return this.cmpn(num) >= 0;
        };

        BN.prototype.gte = function gte(num) {
          return this.cmp(num) >= 0;
        };

        BN.prototype.ltn = function ltn(num) {
          return this.cmpn(num) === -1;
        };

        BN.prototype.lt = function lt(num) {
          return this.cmp(num) === -1;
        };

        BN.prototype.lten = function lten(num) {
          return this.cmpn(num) <= 0;
        };

        BN.prototype.lte = function lte(num) {
          return this.cmp(num) <= 0;
        };

        BN.prototype.eqn = function eqn(num) {
          return this.cmpn(num) === 0;
        };

        BN.prototype.eq = function eq(num) {
          return this.cmp(num) === 0;
        };

        //
        // A reduce context, could be using montgomery or something better, depending
        // on the `m` itself.
        //
        BN.red = function red(num) {
          return new Red(num);
        };

        BN.prototype.toRed = function toRed(ctx) {
          assert(!this.red, 'Already a number in reduction context');
          assert(this.negative === 0, 'red works only with positives');
          return ctx.convertTo(this)._forceRed(ctx);
        };

        BN.prototype.fromRed = function fromRed() {
          assert(this.red, 'fromRed works only with numbers in reduction context');
          return this.red.convertFrom(this);
        };

        BN.prototype._forceRed = function _forceRed(ctx) {
          this.red = ctx;
          return this;
        };

        BN.prototype.forceRed = function forceRed(ctx) {
          assert(!this.red, 'Already a number in reduction context');
          return this._forceRed(ctx);
        };

        BN.prototype.redAdd = function redAdd(num) {
          assert(this.red, 'redAdd works only with red numbers');
          return this.red.add(this, num);
        };

        BN.prototype.redIAdd = function redIAdd(num) {
          assert(this.red, 'redIAdd works only with red numbers');
          return this.red.iadd(this, num);
        };

        BN.prototype.redSub = function redSub(num) {
          assert(this.red, 'redSub works only with red numbers');
          return this.red.sub(this, num);
        };

        BN.prototype.redISub = function redISub(num) {
          assert(this.red, 'redISub works only with red numbers');
          return this.red.isub(this, num);
        };

        BN.prototype.redShl = function redShl(num) {
          assert(this.red, 'redShl works only with red numbers');
          return this.red.shl(this, num);
        };

        BN.prototype.redMul = function redMul(num) {
          assert(this.red, 'redMul works only with red numbers');
          this.red._verify2(this, num);
          return this.red.mul(this, num);
        };

        BN.prototype.redIMul = function redIMul(num) {
          assert(this.red, 'redMul works only with red numbers');
          this.red._verify2(this, num);
          return this.red.imul(this, num);
        };

        BN.prototype.redSqr = function redSqr() {
          assert(this.red, 'redSqr works only with red numbers');
          this.red._verify1(this);
          return this.red.sqr(this);
        };

        BN.prototype.redISqr = function redISqr() {
          assert(this.red, 'redISqr works only with red numbers');
          this.red._verify1(this);
          return this.red.isqr(this);
        };

        // Square root over p
        BN.prototype.redSqrt = function redSqrt() {
          assert(this.red, 'redSqrt works only with red numbers');
          this.red._verify1(this);
          return this.red.sqrt(this);
        };

        BN.prototype.redInvm = function redInvm() {
          assert(this.red, 'redInvm works only with red numbers');
          this.red._verify1(this);
          return this.red.invm(this);
        };

        // Return negative clone of `this` % `red modulo`
        BN.prototype.redNeg = function redNeg() {
          assert(this.red, 'redNeg works only with red numbers');
          this.red._verify1(this);
          return this.red.neg(this);
        };

        BN.prototype.redPow = function redPow(num) {
          assert(this.red && !num.red, 'redPow(normalNum)');
          this.red._verify1(this);
          return this.red.pow(this, num);
        };

        // Prime numbers with efficient reduction
        var primes = {
          k256: null,
          p224: null,
          p192: null,
          p25519: null
        };

        // Pseudo-Mersenne prime
        function MPrime(name, p) {
          // P = 2 ^ N - K
          this.name = name;
          this.p = new BN(p, 16);
          this.n = this.p.bitLength();
          this.k = new BN(1).iushln(this.n).isub(this.p);

          this.tmp = this._tmp();
        }

        MPrime.prototype._tmp = function _tmp() {
          var tmp = new BN(null);
          tmp.words = new Array(Math.ceil(this.n / 13));
          return tmp;
        };

        MPrime.prototype.ireduce = function ireduce(num) {
          // Assumes that `num` is less than `P^2`
          // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
          var r = num;
          var rlen;

          do {
            this.split(r, this.tmp);
            r = this.imulK(r);
            r = r.iadd(this.tmp);
            rlen = r.bitLength();
          } while (rlen > this.n);

          var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
          if (cmp === 0) {
            r.words[0] = 0;
            r.length = 1;
          } else if (cmp > 0) {
            r.isub(this.p);
          } else {
            r.strip();
          }

          return r;
        };

        MPrime.prototype.split = function split(input, out) {
          input.iushrn(this.n, 0, out);
        };

        MPrime.prototype.imulK = function imulK(num) {
          return num.imul(this.k);
        };

        function K256() {
          MPrime.call(this, 'k256', 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
        }
        inherits(K256, MPrime);

        K256.prototype.split = function split(input, output) {
          // 256 = 9 * 26 + 22
          var mask = 0x3fffff;

          var outLen = Math.min(input.length, 9);
          for (var i = 0; i < outLen; i++) {
            output.words[i] = input.words[i];
          }
          output.length = outLen;

          if (input.length <= 9) {
            input.words[0] = 0;
            input.length = 1;
            return;
          }

          // Shift by 9 limbs
          var prev = input.words[9];
          output.words[output.length++] = prev & mask;

          for (i = 10; i < input.length; i++) {
            var next = input.words[i] | 0;
            input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
            prev = next;
          }
          prev >>>= 22;
          input.words[i - 10] = prev;
          if (prev === 0 && input.length > 10) {
            input.length -= 10;
          } else {
            input.length -= 9;
          }
        };

        K256.prototype.imulK = function imulK(num) {
          // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
          num.words[num.length] = 0;
          num.words[num.length + 1] = 0;
          num.length += 2;

          // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
          var lo = 0;
          for (var i = 0; i < num.length; i++) {
            var w = num.words[i] | 0;
            lo += w * 0x3d1;
            num.words[i] = lo & 0x3ffffff;
            lo = w * 0x40 + (lo / 0x4000000 | 0);
          }

          // Fast length reduction
          if (num.words[num.length - 1] === 0) {
            num.length--;
            if (num.words[num.length - 1] === 0) {
              num.length--;
            }
          }
          return num;
        };

        function P224() {
          MPrime.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
        }
        inherits(P224, MPrime);

        function P192() {
          MPrime.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
        }
        inherits(P192, MPrime);

        function P25519() {
          // 2 ^ 255 - 19
          MPrime.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
        }
        inherits(P25519, MPrime);

        P25519.prototype.imulK = function imulK(num) {
          // K = 0x13
          var carry = 0;
          for (var i = 0; i < num.length; i++) {
            var hi = (num.words[i] | 0) * 0x13 + carry;
            var lo = hi & 0x3ffffff;
            hi >>>= 26;

            num.words[i] = lo;
            carry = hi;
          }
          if (carry !== 0) {
            num.words[num.length++] = carry;
          }
          return num;
        };

        // Exported mostly for testing purposes, use plain name instead
        BN._prime = function prime(name) {
          // Cached version of prime
          if (primes[name]) return primes[name];

          var prime;
          if (name === 'k256') {
            prime = new K256();
          } else if (name === 'p224') {
            prime = new P224();
          } else if (name === 'p192') {
            prime = new P192();
          } else if (name === 'p25519') {
            prime = new P25519();
          } else {
            throw new Error('Unknown prime ' + name);
          }
          primes[name] = prime;

          return prime;
        };

        //
        // Base reduction engine
        //
        function Red(m) {
          if (typeof m === 'string') {
            var prime = BN._prime(m);
            this.m = prime.p;
            this.prime = prime;
          } else {
            assert(m.gtn(1), 'modulus must be greater than 1');
            this.m = m;
            this.prime = null;
          }
        }

        Red.prototype._verify1 = function _verify1(a) {
          assert(a.negative === 0, 'red works only with positives');
          assert(a.red, 'red works only with red numbers');
        };

        Red.prototype._verify2 = function _verify2(a, b) {
          assert((a.negative | b.negative) === 0, 'red works only with positives');
          assert(a.red && a.red === b.red, 'red works only with red numbers');
        };

        Red.prototype.imod = function imod(a) {
          if (this.prime) return this.prime.ireduce(a)._forceRed(this);
          return a.umod(this.m)._forceRed(this);
        };

        Red.prototype.neg = function neg(a) {
          if (a.isZero()) {
            return a.clone();
          }

          return this.m.sub(a)._forceRed(this);
        };

        Red.prototype.add = function add(a, b) {
          this._verify2(a, b);

          var res = a.add(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res._forceRed(this);
        };

        Red.prototype.iadd = function iadd(a, b) {
          this._verify2(a, b);

          var res = a.iadd(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res;
        };

        Red.prototype.sub = function sub(a, b) {
          this._verify2(a, b);

          var res = a.sub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res._forceRed(this);
        };

        Red.prototype.isub = function isub(a, b) {
          this._verify2(a, b);

          var res = a.isub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res;
        };

        Red.prototype.shl = function shl(a, num) {
          this._verify1(a);
          return this.imod(a.ushln(num));
        };

        Red.prototype.imul = function imul(a, b) {
          this._verify2(a, b);
          return this.imod(a.imul(b));
        };

        Red.prototype.mul = function mul(a, b) {
          this._verify2(a, b);
          return this.imod(a.mul(b));
        };

        Red.prototype.isqr = function isqr(a) {
          return this.imul(a, a.clone());
        };

        Red.prototype.sqr = function sqr(a) {
          return this.mul(a, a);
        };

        Red.prototype.sqrt = function sqrt(a) {
          if (a.isZero()) return a.clone();

          var mod3 = this.m.andln(3);
          assert(mod3 % 2 === 1);

          // Fast case
          if (mod3 === 3) {
            var pow = this.m.add(new BN(1)).iushrn(2);
            return this.pow(a, pow);
          }

          // Tonelli-Shanks algorithm (Totally unoptimized and slow)
          //
          // Find Q and S, that Q * 2 ^ S = (P - 1)
          var q = this.m.subn(1);
          var s = 0;
          while (!q.isZero() && q.andln(1) === 0) {
            s++;
            q.iushrn(1);
          }
          assert(!q.isZero());

          var one = new BN(1).toRed(this);
          var nOne = one.redNeg();

          // Find quadratic non-residue
          // NOTE: Max is such because of generalized Riemann hypothesis.
          var lpow = this.m.subn(1).iushrn(1);
          var z = this.m.bitLength();
          z = new BN(2 * z * z).toRed(this);

          while (this.pow(z, lpow).cmp(nOne) !== 0) {
            z.redIAdd(nOne);
          }

          var c = this.pow(z, q);
          var r = this.pow(a, q.addn(1).iushrn(1));
          var t = this.pow(a, q);
          var m = s;
          while (t.cmp(one) !== 0) {
            var tmp = t;
            for (var i = 0; tmp.cmp(one) !== 0; i++) {
              tmp = tmp.redSqr();
            }
            assert(i < m);
            var b = this.pow(c, new BN(1).iushln(m - i - 1));

            r = r.redMul(b);
            c = b.redSqr();
            t = t.redMul(c);
            m = i;
          }

          return r;
        };

        Red.prototype.invm = function invm(a) {
          var inv = a._invmp(this.m);
          if (inv.negative !== 0) {
            inv.negative = 0;
            return this.imod(inv).redNeg();
          } else {
            return this.imod(inv);
          }
        };

        Red.prototype.pow = function pow(a, num) {
          if (num.isZero()) return new BN(1).toRed(this);
          if (num.cmpn(1) === 0) return a.clone();

          var windowSize = 4;
          var wnd = new Array(1 << windowSize);
          wnd[0] = new BN(1).toRed(this);
          wnd[1] = a;
          for (var i = 2; i < wnd.length; i++) {
            wnd[i] = this.mul(wnd[i - 1], a);
          }

          var res = wnd[0];
          var current = 0;
          var currentLen = 0;
          var start = num.bitLength() % 26;
          if (start === 0) {
            start = 26;
          }

          for (i = num.length - 1; i >= 0; i--) {
            var word = num.words[i];
            for (var j = start - 1; j >= 0; j--) {
              var bit = word >> j & 1;
              if (res !== wnd[0]) {
                res = this.sqr(res);
              }

              if (bit === 0 && current === 0) {
                currentLen = 0;
                continue;
              }

              current <<= 1;
              current |= bit;
              currentLen++;
              if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

              res = this.mul(res, wnd[current]);
              currentLen = 0;
              current = 0;
            }
            start = 26;
          }

          return res;
        };

        Red.prototype.convertTo = function convertTo(num) {
          var r = num.umod(this.m);

          return r === num ? r.clone() : r;
        };

        Red.prototype.convertFrom = function convertFrom(num) {
          var res = num.clone();
          res.red = null;
          return res;
        };

        //
        // Montgomery method engine
        //

        BN.mont = function mont(num) {
          return new Mont(num);
        };

        function Mont(m) {
          Red.call(this, m);

          this.shift = this.m.bitLength();
          if (this.shift % 26 !== 0) {
            this.shift += 26 - this.shift % 26;
          }

          this.r = new BN(1).iushln(this.shift);
          this.r2 = this.imod(this.r.sqr());
          this.rinv = this.r._invmp(this.m);

          this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
          this.minv = this.minv.umod(this.r);
          this.minv = this.r.sub(this.minv);
        }
        inherits(Mont, Red);

        Mont.prototype.convertTo = function convertTo(num) {
          return this.imod(num.ushln(this.shift));
        };

        Mont.prototype.convertFrom = function convertFrom(num) {
          var r = this.imod(num.mul(this.rinv));
          r.red = null;
          return r;
        };

        Mont.prototype.imul = function imul(a, b) {
          if (a.isZero() || b.isZero()) {
            a.words[0] = 0;
            a.length = 1;
            return a;
          }

          var t = a.imul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;

          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }

          return res._forceRed(this);
        };

        Mont.prototype.mul = function mul(a, b) {
          if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

          var t = a.mul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;
          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }

          return res._forceRed(this);
        };

        Mont.prototype.invm = function invm(a) {
          // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
          var res = this.imod(a._invmp(this.m).mul(this.r2));
          return res._forceRed(this);
        };
      })(typeof module === 'undefined' || module, this);
    }, { "buffer": 2 }], "Web3Bzz": [function (require, module, exports) {
      /*
          This file is part of web3.js.
      
          web3.js is free software: you can redistribute it and/or modify
          it under the terms of the GNU Lesser General Public License as published by
          the Free Software Foundation, either version 3 of the License, or
          (at your option) any later version.
      
          web3.js is distributed in the hope that it will be useful,
          but WITHOUT ANY WARRANTY; without even the implied warranty of
          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
          GNU Lesser General Public License for more details.
      
          You should have received a copy of the GNU Lesser General Public License
          along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
      */
      /**
       * @file index.js
       * @author Fabian Vogelsteller <fabian@ethereum.org>
       * @date 2017
       */

      "use strict";

      var _ = require('underscore');
      var swarm = require("swarm-js");

      var Bzz = function Bzz(provider) {

        this.givenProvider = Bzz.givenProvider;

        if (provider && provider._requestManager) {
          provider = provider.currentProvider;
        }

        // only allow file picker when in browser
        if (typeof document !== 'undefined') {
          this.pick = swarm.pick;
        }

        this.setProvider(provider);
      };

      // set default ethereum provider
      /* jshint ignore:start */
      Bzz.givenProvider = null;
      if (typeof ethereumProvider !== 'undefined' && ethereumProvider.bzz) {
        Bzz.givenProvider = ethereumProvider.bzz;
      }
      /* jshint ignore:end */

      Bzz.prototype.setProvider = function (provider) {
        // is ethereum provider
        if (_.isObject(provider) && _.isString(provider.bzz)) {
          provider = provider.bzz;
          // is no string, set default
        }
        // else if(!_.isString(provider)) {
        //      provider = 'http://swarm-gateways.net'; // default to gateway
        // }


        if (_.isString(provider)) {
          this.currentProvider = provider;
        } else {
          this.currentProvider = null;
          return false;
        }

        // add functions
        this.download = swarm.at(provider).download;
        this.upload = swarm.at(provider).upload;
        this.isAvailable = swarm.at(provider).isAvailable;

        return true;
      };

      module.exports = Bzz;
    }, { "swarm-js": 17, "underscore": 21 }] }, {}, ["Web3Bzz"])("Web3Bzz");
});
//# sourceMappingURL=web3-bzz.js.map
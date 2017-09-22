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
        }g.Web3PromiEvent = f();
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
    }({ 1: [function (require, module, exports) {}, {}], 2: [function (require, module, exports) {
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
        }, {}], 3: [function (require, module, exports) {
            (function (process, global) {
                /* @preserve
                 * The MIT License (MIT)
                 * 
                 * Copyright (c) 2013-2015 Petka Antonov
                 * 
                 * Permission is hereby granted, free of charge, to any person obtaining a copy
                 * of this software and associated documentation files (the "Software"), to deal
                 * in the Software without restriction, including without limitation the rights
                 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                 * copies of the Software, and to permit persons to whom the Software is
                 * furnished to do so, subject to the following conditions:
                 * 
                 * The above copyright notice and this permission notice shall be included in
                 * all copies or substantial portions of the Software.
                 * 
                 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
                 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                 * THE SOFTWARE.
                 * 
                 */
                /**
                 * bluebird build version 3.3.1
                 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
                */
                !function (e) {
                    if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if ("function" == typeof define && define.amd) define([], e);else {
                        var f;"undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.Promise = e();
                    }
                }(function () {
                    var define, module, exports;return function e(t, n, r) {
                        function s(o, u) {
                            if (!n[o]) {
                                if (!t[o]) {
                                    var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                                    var n = t[o][1][e];return s(n ? n : e);
                                }, l, l.exports, e, t, n, r);
                            }return n[o].exports;
                        }var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) {
                            s(r[o]);
                        }return s;
                    }({ 1: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise) {
                                var SomePromiseArray = Promise._SomePromiseArray;
                                function any(promises) {
                                    var ret = new SomePromiseArray(promises);
                                    var promise = ret.promise();
                                    ret.setHowMany(1);
                                    ret.setUnwrap();
                                    ret.init();
                                    return promise;
                                }

                                Promise.any = function (promises) {
                                    return any(promises);
                                };

                                Promise.prototype.any = function () {
                                    return any(this);
                                };
                            };
                        }, {}], 2: [function (_dereq_, module, exports) {
                            "use strict";

                            var firstLineError;
                            try {
                                throw new Error();
                            } catch (e) {
                                firstLineError = e;
                            }
                            var schedule = _dereq_("./schedule");
                            var Queue = _dereq_("./queue");
                            var util = _dereq_("./util");

                            function Async() {
                                this._isTickUsed = false;
                                this._lateQueue = new Queue(16);
                                this._normalQueue = new Queue(16);
                                this._haveDrainedQueues = false;
                                this._trampolineEnabled = true;
                                var self = this;
                                this.drainQueues = function () {
                                    self._drainQueues();
                                };
                                this._schedule = schedule;
                            }

                            Async.prototype.enableTrampoline = function () {
                                this._trampolineEnabled = true;
                            };

                            Async.prototype.disableTrampolineIfNecessary = function () {
                                if (util.hasDevTools) {
                                    this._trampolineEnabled = false;
                                }
                            };

                            Async.prototype.haveItemsQueued = function () {
                                return this._isTickUsed || this._haveDrainedQueues;
                            };

                            Async.prototype.fatalError = function (e, isNode) {
                                if (isNode) {
                                    process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e));
                                    process.exit(2);
                                } else {
                                    this.throwLater(e);
                                }
                            };

                            Async.prototype.throwLater = function (fn, arg) {
                                if (arguments.length === 1) {
                                    arg = fn;
                                    fn = function fn() {
                                        throw arg;
                                    };
                                }
                                if (typeof setTimeout !== "undefined") {
                                    setTimeout(function () {
                                        fn(arg);
                                    }, 0);
                                } else try {
                                    this._schedule(function () {
                                        fn(arg);
                                    });
                                } catch (e) {
                                    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                                }
                            };

                            function AsyncInvokeLater(fn, receiver, arg) {
                                this._lateQueue.push(fn, receiver, arg);
                                this._queueTick();
                            }

                            function AsyncInvoke(fn, receiver, arg) {
                                this._normalQueue.push(fn, receiver, arg);
                                this._queueTick();
                            }

                            function AsyncSettlePromises(promise) {
                                this._normalQueue._pushOne(promise);
                                this._queueTick();
                            }

                            if (!util.hasDevTools) {
                                Async.prototype.invokeLater = AsyncInvokeLater;
                                Async.prototype.invoke = AsyncInvoke;
                                Async.prototype.settlePromises = AsyncSettlePromises;
                            } else {
                                Async.prototype.invokeLater = function (fn, receiver, arg) {
                                    if (this._trampolineEnabled) {
                                        AsyncInvokeLater.call(this, fn, receiver, arg);
                                    } else {
                                        this._schedule(function () {
                                            setTimeout(function () {
                                                fn.call(receiver, arg);
                                            }, 100);
                                        });
                                    }
                                };

                                Async.prototype.invoke = function (fn, receiver, arg) {
                                    if (this._trampolineEnabled) {
                                        AsyncInvoke.call(this, fn, receiver, arg);
                                    } else {
                                        this._schedule(function () {
                                            fn.call(receiver, arg);
                                        });
                                    }
                                };

                                Async.prototype.settlePromises = function (promise) {
                                    if (this._trampolineEnabled) {
                                        AsyncSettlePromises.call(this, promise);
                                    } else {
                                        this._schedule(function () {
                                            promise._settlePromises();
                                        });
                                    }
                                };
                            }

                            Async.prototype.invokeFirst = function (fn, receiver, arg) {
                                this._normalQueue.unshift(fn, receiver, arg);
                                this._queueTick();
                            };

                            Async.prototype._drainQueue = function (queue) {
                                while (queue.length() > 0) {
                                    var fn = queue.shift();
                                    if (typeof fn !== "function") {
                                        fn._settlePromises();
                                        continue;
                                    }
                                    var receiver = queue.shift();
                                    var arg = queue.shift();
                                    fn.call(receiver, arg);
                                }
                            };

                            Async.prototype._drainQueues = function () {
                                this._drainQueue(this._normalQueue);
                                this._reset();
                                this._haveDrainedQueues = true;
                                this._drainQueue(this._lateQueue);
                            };

                            Async.prototype._queueTick = function () {
                                if (!this._isTickUsed) {
                                    this._isTickUsed = true;
                                    this._schedule(this.drainQueues);
                                }
                            };

                            Async.prototype._reset = function () {
                                this._isTickUsed = false;
                            };

                            module.exports = Async;
                            module.exports.firstLineError = firstLineError;
                        }, { "./queue": 26, "./schedule": 29, "./util": 36 }], 3: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL, tryConvertToPromise, debug) {
                                var calledBind = false;
                                var rejectThis = function rejectThis(_, e) {
                                    this._reject(e);
                                };

                                var targetRejected = function targetRejected(e, context) {
                                    context.promiseRejectionQueued = true;
                                    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
                                };

                                var bindingResolved = function bindingResolved(thisArg, context) {
                                    if ((this._bitField & 50397184) === 0) {
                                        this._resolveCallback(context.target);
                                    }
                                };

                                var bindingRejected = function bindingRejected(e, context) {
                                    if (!context.promiseRejectionQueued) this._reject(e);
                                };

                                Promise.prototype.bind = function (thisArg) {
                                    if (!calledBind) {
                                        calledBind = true;
                                        Promise.prototype._propagateFrom = debug.propagateFromFunction();
                                        Promise.prototype._boundValue = debug.boundValueFunction();
                                    }
                                    var maybePromise = tryConvertToPromise(thisArg);
                                    var ret = new Promise(INTERNAL);
                                    ret._propagateFrom(this, 1);
                                    var target = this._target();
                                    ret._setBoundTo(maybePromise);
                                    if (maybePromise instanceof Promise) {
                                        var context = {
                                            promiseRejectionQueued: false,
                                            promise: ret,
                                            target: target,
                                            bindingPromise: maybePromise
                                        };
                                        target._then(INTERNAL, targetRejected, undefined, ret, context);
                                        maybePromise._then(bindingResolved, bindingRejected, undefined, ret, context);
                                        ret._setOnCancel(maybePromise);
                                    } else {
                                        ret._resolveCallback(target);
                                    }
                                    return ret;
                                };

                                Promise.prototype._setBoundTo = function (obj) {
                                    if (obj !== undefined) {
                                        this._bitField = this._bitField | 2097152;
                                        this._boundTo = obj;
                                    } else {
                                        this._bitField = this._bitField & ~2097152;
                                    }
                                };

                                Promise.prototype._isBound = function () {
                                    return (this._bitField & 2097152) === 2097152;
                                };

                                Promise.bind = function (thisArg, value) {
                                    return Promise.resolve(value).bind(thisArg);
                                };
                            };
                        }, {}], 4: [function (_dereq_, module, exports) {
                            "use strict";

                            var old;
                            if (typeof Promise !== "undefined") old = Promise;
                            function noConflict() {
                                try {
                                    if (Promise === bluebird) Promise = old;
                                } catch (e) {}
                                return bluebird;
                            }
                            var bluebird = _dereq_("./promise")();
                            bluebird.noConflict = noConflict;
                            module.exports = bluebird;
                        }, { "./promise": 22 }], 5: [function (_dereq_, module, exports) {
                            "use strict";

                            var cr = Object.create;
                            if (cr) {
                                var callerCache = cr(null);
                                var getterCache = cr(null);
                                callerCache[" size"] = getterCache[" size"] = 0;
                            }

                            module.exports = function (Promise) {
                                var util = _dereq_("./util");
                                var canEvaluate = util.canEvaluate;
                                var isIdentifier = util.isIdentifier;

                                var getMethodCaller;
                                var getGetter;
                                if (!true) {
                                    var makeMethodCaller = function makeMethodCaller(methodName) {
                                        return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
                                    };

                                    var makeGetter = function makeGetter(propertyName) {
                                        return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
                                    };

                                    var getCompiled = function getCompiled(name, compiler, cache) {
                                        var ret = cache[name];
                                        if (typeof ret !== "function") {
                                            if (!isIdentifier(name)) {
                                                return null;
                                            }
                                            ret = compiler(name);
                                            cache[name] = ret;
                                            cache[" size"]++;
                                            if (cache[" size"] > 512) {
                                                var keys = Object.keys(cache);
                                                for (var i = 0; i < 256; ++i) {
                                                    delete cache[keys[i]];
                                                }cache[" size"] = keys.length - 256;
                                            }
                                        }
                                        return ret;
                                    };

                                    getMethodCaller = function getMethodCaller(name) {
                                        return getCompiled(name, makeMethodCaller, callerCache);
                                    };

                                    getGetter = function getGetter(name) {
                                        return getCompiled(name, makeGetter, getterCache);
                                    };
                                }

                                function ensureMethod(obj, methodName) {
                                    var fn;
                                    if (obj != null) fn = obj[methodName];
                                    if (typeof fn !== "function") {
                                        var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
                                        throw new Promise.TypeError(message);
                                    }
                                    return fn;
                                }

                                function caller(obj) {
                                    var methodName = this.pop();
                                    var fn = ensureMethod(obj, methodName);
                                    return fn.apply(obj, this);
                                }
                                Promise.prototype.call = function (methodName) {
                                    var args = [].slice.call(arguments, 1);;
                                    if (!true) {
                                        if (canEvaluate) {
                                            var maybeCaller = getMethodCaller(methodName);
                                            if (maybeCaller !== null) {
                                                return this._then(maybeCaller, undefined, undefined, args, undefined);
                                            }
                                        }
                                    }
                                    args.push(methodName);
                                    return this._then(caller, undefined, undefined, args, undefined);
                                };

                                function namedGetter(obj) {
                                    return obj[this];
                                }
                                function indexedGetter(obj) {
                                    var index = +this;
                                    if (index < 0) index = Math.max(0, index + obj.length);
                                    return obj[index];
                                }
                                Promise.prototype.get = function (propertyName) {
                                    var isIndex = typeof propertyName === "number";
                                    var getter;
                                    if (!isIndex) {
                                        if (canEvaluate) {
                                            var maybeGetter = getGetter(propertyName);
                                            getter = maybeGetter !== null ? maybeGetter : namedGetter;
                                        } else {
                                            getter = namedGetter;
                                        }
                                    } else {
                                        getter = indexedGetter;
                                    }
                                    return this._then(getter, undefined, undefined, propertyName, undefined);
                                };
                            };
                        }, { "./util": 36 }], 6: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, apiRejection, debug) {
                                var util = _dereq_("./util");
                                var tryCatch = util.tryCatch;
                                var errorObj = util.errorObj;
                                var async = Promise._async;

                                Promise.prototype["break"] = Promise.prototype.cancel = function () {
                                    if (!debug.cancellation()) return this._warn("cancellation is disabled");

                                    var promise = this;
                                    var child = promise;
                                    while (promise.isCancellable()) {
                                        if (!promise._cancelBy(child)) {
                                            if (child._isFollowing()) {
                                                child._followee().cancel();
                                            } else {
                                                child._cancelBranched();
                                            }
                                            break;
                                        }

                                        var parent = promise._cancellationParent;
                                        if (parent == null || !parent.isCancellable()) {
                                            if (promise._isFollowing()) {
                                                promise._followee().cancel();
                                            } else {
                                                promise._cancelBranched();
                                            }
                                            break;
                                        } else {
                                            if (promise._isFollowing()) promise._followee().cancel();
                                            child = promise;
                                            promise = parent;
                                        }
                                    }
                                };

                                Promise.prototype._branchHasCancelled = function () {
                                    this._branchesRemainingToCancel--;
                                };

                                Promise.prototype._enoughBranchesHaveCancelled = function () {
                                    return this._branchesRemainingToCancel === undefined || this._branchesRemainingToCancel <= 0;
                                };

                                Promise.prototype._cancelBy = function (canceller) {
                                    if (canceller === this) {
                                        this._branchesRemainingToCancel = 0;
                                        this._invokeOnCancel();
                                        return true;
                                    } else {
                                        this._branchHasCancelled();
                                        if (this._enoughBranchesHaveCancelled()) {
                                            this._invokeOnCancel();
                                            return true;
                                        }
                                    }
                                    return false;
                                };

                                Promise.prototype._cancelBranched = function () {
                                    if (this._enoughBranchesHaveCancelled()) {
                                        this._cancel();
                                    }
                                };

                                Promise.prototype._cancel = function () {
                                    if (!this.isCancellable()) return;

                                    this._setCancelled();
                                    async.invoke(this._cancelPromises, this, undefined);
                                };

                                Promise.prototype._cancelPromises = function () {
                                    if (this._length() > 0) this._settlePromises();
                                };

                                Promise.prototype._unsetOnCancel = function () {
                                    this._onCancelField = undefined;
                                };

                                Promise.prototype.isCancellable = function () {
                                    return this.isPending() && !this.isCancelled();
                                };

                                Promise.prototype._doInvokeOnCancel = function (onCancelCallback, internalOnly) {
                                    if (util.isArray(onCancelCallback)) {
                                        for (var i = 0; i < onCancelCallback.length; ++i) {
                                            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                                        }
                                    } else if (onCancelCallback !== undefined) {
                                        if (typeof onCancelCallback === "function") {
                                            if (!internalOnly) {
                                                var e = tryCatch(onCancelCallback).call(this._boundValue());
                                                if (e === errorObj) {
                                                    this._attachExtraTrace(e.e);
                                                    async.throwLater(e.e);
                                                }
                                            }
                                        } else {
                                            onCancelCallback._resultCancelled(this);
                                        }
                                    }
                                };

                                Promise.prototype._invokeOnCancel = function () {
                                    var onCancelCallback = this._onCancel();
                                    this._unsetOnCancel();
                                    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                                };

                                Promise.prototype._invokeInternalOnCancel = function () {
                                    if (this.isCancellable()) {
                                        this._doInvokeOnCancel(this._onCancel(), true);
                                        this._unsetOnCancel();
                                    }
                                };

                                Promise.prototype._resultCancelled = function () {
                                    this.cancel();
                                };
                            };
                        }, { "./util": 36 }], 7: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (NEXT_FILTER) {
                                var util = _dereq_("./util");
                                var getKeys = _dereq_("./es5").keys;
                                var tryCatch = util.tryCatch;
                                var errorObj = util.errorObj;

                                function catchFilter(instances, cb, promise) {
                                    return function (e) {
                                        var boundTo = promise._boundValue();
                                        predicateLoop: for (var i = 0; i < instances.length; ++i) {
                                            var item = instances[i];

                                            if (item === Error || item != null && item.prototype instanceof Error) {
                                                if (e instanceof item) {
                                                    return tryCatch(cb).call(boundTo, e);
                                                }
                                            } else if (typeof item === "function") {
                                                var matchesPredicate = tryCatch(item).call(boundTo, e);
                                                if (matchesPredicate === errorObj) {
                                                    return matchesPredicate;
                                                } else if (matchesPredicate) {
                                                    return tryCatch(cb).call(boundTo, e);
                                                }
                                            } else if (util.isObject(e)) {
                                                var keys = getKeys(item);
                                                for (var j = 0; j < keys.length; ++j) {
                                                    var key = keys[j];
                                                    if (item[key] != e[key]) {
                                                        continue predicateLoop;
                                                    }
                                                }
                                                return tryCatch(cb).call(boundTo, e);
                                            }
                                        }
                                        return NEXT_FILTER;
                                    };
                                }

                                return catchFilter;
                            };
                        }, { "./es5": 13, "./util": 36 }], 8: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise) {
                                var longStackTraces = false;
                                var contextStack = [];

                                Promise.prototype._promiseCreated = function () {};
                                Promise.prototype._pushContext = function () {};
                                Promise.prototype._popContext = function () {
                                    return null;
                                };
                                Promise._peekContext = Promise.prototype._peekContext = function () {};

                                function Context() {
                                    this._trace = new Context.CapturedTrace(peekContext());
                                }
                                Context.prototype._pushContext = function () {
                                    if (this._trace !== undefined) {
                                        this._trace._promiseCreated = null;
                                        contextStack.push(this._trace);
                                    }
                                };

                                Context.prototype._popContext = function () {
                                    if (this._trace !== undefined) {
                                        var trace = contextStack.pop();
                                        var ret = trace._promiseCreated;
                                        trace._promiseCreated = null;
                                        return ret;
                                    }
                                    return null;
                                };

                                function createContext() {
                                    if (longStackTraces) return new Context();
                                }

                                function peekContext() {
                                    var lastIndex = contextStack.length - 1;
                                    if (lastIndex >= 0) {
                                        return contextStack[lastIndex];
                                    }
                                    return undefined;
                                }
                                Context.CapturedTrace = null;
                                Context.create = createContext;
                                Context.deactivateLongStackTraces = function () {};
                                Context.activateLongStackTraces = function () {
                                    var Promise_pushContext = Promise.prototype._pushContext;
                                    var Promise_popContext = Promise.prototype._popContext;
                                    var Promise_PeekContext = Promise._peekContext;
                                    var Promise_peekContext = Promise.prototype._peekContext;
                                    var Promise_promiseCreated = Promise.prototype._promiseCreated;
                                    Context.deactivateLongStackTraces = function () {
                                        Promise.prototype._pushContext = Promise_pushContext;
                                        Promise.prototype._popContext = Promise_popContext;
                                        Promise._peekContext = Promise_PeekContext;
                                        Promise.prototype._peekContext = Promise_peekContext;
                                        Promise.prototype._promiseCreated = Promise_promiseCreated;
                                        longStackTraces = false;
                                    };
                                    longStackTraces = true;
                                    Promise.prototype._pushContext = Context.prototype._pushContext;
                                    Promise.prototype._popContext = Context.prototype._popContext;
                                    Promise._peekContext = Promise.prototype._peekContext = peekContext;
                                    Promise.prototype._promiseCreated = function () {
                                        var ctx = this._peekContext();
                                        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
                                    };
                                };
                                return Context;
                            };
                        }, {}], 9: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, Context) {
                                var getDomain = Promise._getDomain;
                                var async = Promise._async;
                                var Warning = _dereq_("./errors").Warning;
                                var util = _dereq_("./util");
                                var canAttachTrace = util.canAttachTrace;
                                var unhandledRejectionHandled;
                                var possiblyUnhandledRejection;
                                var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                                var stackFramePattern = null;
                                var formatStack = null;
                                var indentStackFrames = false;
                                var printWarning;
                                var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (true || util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));

                                var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));

                                var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

                                var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

                                Promise.prototype.suppressUnhandledRejections = function () {
                                    var target = this._target();
                                    target._bitField = target._bitField & ~1048576 | 524288;
                                };

                                Promise.prototype._ensurePossibleRejectionHandled = function () {
                                    if ((this._bitField & 524288) !== 0) return;
                                    this._setRejectionIsUnhandled();
                                    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
                                };

                                Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
                                    fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, undefined, this);
                                };

                                Promise.prototype._setReturnedNonUndefined = function () {
                                    this._bitField = this._bitField | 268435456;
                                };

                                Promise.prototype._returnedNonUndefined = function () {
                                    return (this._bitField & 268435456) !== 0;
                                };

                                Promise.prototype._notifyUnhandledRejection = function () {
                                    if (this._isRejectionUnhandled()) {
                                        var reason = this._settledValue();
                                        this._setUnhandledRejectionIsNotified();
                                        fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
                                    }
                                };

                                Promise.prototype._setUnhandledRejectionIsNotified = function () {
                                    this._bitField = this._bitField | 262144;
                                };

                                Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
                                    this._bitField = this._bitField & ~262144;
                                };

                                Promise.prototype._isUnhandledRejectionNotified = function () {
                                    return (this._bitField & 262144) > 0;
                                };

                                Promise.prototype._setRejectionIsUnhandled = function () {
                                    this._bitField = this._bitField | 1048576;
                                };

                                Promise.prototype._unsetRejectionIsUnhandled = function () {
                                    this._bitField = this._bitField & ~1048576;
                                    if (this._isUnhandledRejectionNotified()) {
                                        this._unsetUnhandledRejectionIsNotified();
                                        this._notifyUnhandledRejectionIsHandled();
                                    }
                                };

                                Promise.prototype._isRejectionUnhandled = function () {
                                    return (this._bitField & 1048576) > 0;
                                };

                                Promise.prototype._warn = function (message, shouldUseOwnTrace, promise) {
                                    return warn(message, shouldUseOwnTrace, promise || this);
                                };

                                Promise.onPossiblyUnhandledRejection = function (fn) {
                                    var domain = getDomain();
                                    possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : domain.bind(fn) : undefined;
                                };

                                Promise.onUnhandledRejectionHandled = function (fn) {
                                    var domain = getDomain();
                                    unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : domain.bind(fn) : undefined;
                                };

                                var disableLongStackTraces = function disableLongStackTraces() {};
                                Promise.longStackTraces = function () {
                                    if (async.haveItemsQueued() && !config.longStackTraces) {
                                        throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    if (!config.longStackTraces && longStackTracesIsSupported()) {
                                        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                                        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                                        config.longStackTraces = true;
                                        disableLongStackTraces = function disableLongStackTraces() {
                                            if (async.haveItemsQueued() && !config.longStackTraces) {
                                                throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                            }
                                            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                                            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                                            Context.deactivateLongStackTraces();
                                            async.enableTrampoline();
                                            config.longStackTraces = false;
                                        };
                                        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                                        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                                        Context.activateLongStackTraces();
                                        async.disableTrampolineIfNecessary();
                                    }
                                };

                                Promise.hasLongStackTraces = function () {
                                    return config.longStackTraces && longStackTracesIsSupported();
                                };

                                var fireDomEvent = function () {
                                    try {
                                        var event = document.createEvent("CustomEvent");
                                        event.initCustomEvent("testingtheevent", false, true, {});
                                        util.global.dispatchEvent(event);
                                        return function (name, event) {
                                            var domEvent = document.createEvent("CustomEvent");
                                            domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
                                            return !util.global.dispatchEvent(domEvent);
                                        };
                                    } catch (e) {}
                                    return function () {
                                        return false;
                                    };
                                }();

                                var fireGlobalEvent = function () {
                                    if (util.isNode) {
                                        return function () {
                                            return process.emit.apply(process, arguments);
                                        };
                                    } else {
                                        if (!util.global) {
                                            return function () {
                                                return false;
                                            };
                                        }
                                        return function (name) {
                                            var methodName = "on" + name.toLowerCase();
                                            var method = util.global[methodName];
                                            if (!method) return false;
                                            method.apply(util.global, [].slice.call(arguments, 1));
                                            return true;
                                        };
                                    }
                                }();

                                function generatePromiseLifecycleEventObject(name, promise) {
                                    return { promise: promise };
                                }

                                var eventToObjectGenerator = {
                                    promiseCreated: generatePromiseLifecycleEventObject,
                                    promiseFulfilled: generatePromiseLifecycleEventObject,
                                    promiseRejected: generatePromiseLifecycleEventObject,
                                    promiseResolved: generatePromiseLifecycleEventObject,
                                    promiseCancelled: generatePromiseLifecycleEventObject,
                                    promiseChained: function promiseChained(name, promise, child) {
                                        return { promise: promise, child: child };
                                    },
                                    warning: function warning(name, _warning) {
                                        return { warning: _warning };
                                    },
                                    unhandledRejection: function unhandledRejection(name, reason, promise) {
                                        return { reason: reason, promise: promise };
                                    },
                                    rejectionHandled: generatePromiseLifecycleEventObject
                                };

                                var activeFireEvent = function activeFireEvent(name) {
                                    var globalEventFired = false;
                                    try {
                                        globalEventFired = fireGlobalEvent.apply(null, arguments);
                                    } catch (e) {
                                        async.throwLater(e);
                                        globalEventFired = true;
                                    }

                                    var domEventFired = false;
                                    try {
                                        domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                                    } catch (e) {
                                        async.throwLater(e);
                                        domEventFired = true;
                                    }

                                    return domEventFired || globalEventFired;
                                };

                                Promise.config = function (opts) {
                                    opts = Object(opts);
                                    if ("longStackTraces" in opts) {
                                        if (opts.longStackTraces) {
                                            Promise.longStackTraces();
                                        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
                                            disableLongStackTraces();
                                        }
                                    }
                                    if ("warnings" in opts) {
                                        var warningsOption = opts.warnings;
                                        config.warnings = !!warningsOption;
                                        wForgottenReturn = config.warnings;

                                        if (util.isObject(warningsOption)) {
                                            if ("wForgottenReturn" in warningsOption) {
                                                wForgottenReturn = !!warningsOption.wForgottenReturn;
                                            }
                                        }
                                    }
                                    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
                                        if (async.haveItemsQueued()) {
                                            throw new Error("cannot enable cancellation after promises are in use");
                                        }
                                        Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                                        Promise.prototype._propagateFrom = cancellationPropagateFrom;
                                        Promise.prototype._onCancel = cancellationOnCancel;
                                        Promise.prototype._setOnCancel = cancellationSetOnCancel;
                                        Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                                        Promise.prototype._execute = cancellationExecute;
                                        _propagateFromFunction = cancellationPropagateFrom;
                                        config.cancellation = true;
                                    }
                                    if ("monitoring" in opts) {
                                        if (opts.monitoring && !config.monitoring) {
                                            config.monitoring = true;
                                            Promise.prototype._fireEvent = activeFireEvent;
                                        } else if (!opts.monitoring && config.monitoring) {
                                            config.monitoring = false;
                                            Promise.prototype._fireEvent = defaultFireEvent;
                                        }
                                    }
                                };

                                function defaultFireEvent() {
                                    return false;
                                }

                                Promise.prototype._fireEvent = defaultFireEvent;
                                Promise.prototype._execute = function (executor, resolve, reject) {
                                    try {
                                        executor(resolve, reject);
                                    } catch (e) {
                                        return e;
                                    }
                                };
                                Promise.prototype._onCancel = function () {};
                                Promise.prototype._setOnCancel = function (handler) {
                                    ;
                                };
                                Promise.prototype._attachCancellationCallback = function (onCancel) {
                                    ;
                                };
                                Promise.prototype._captureStackTrace = function () {};
                                Promise.prototype._attachExtraTrace = function () {};
                                Promise.prototype._clearCancellationData = function () {};
                                Promise.prototype._propagateFrom = function (parent, flags) {
                                    ;
                                    ;
                                };

                                function cancellationExecute(executor, resolve, reject) {
                                    var promise = this;
                                    try {
                                        executor(resolve, reject, function (onCancel) {
                                            if (typeof onCancel !== "function") {
                                                throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
                                            }
                                            promise._attachCancellationCallback(onCancel);
                                        });
                                    } catch (e) {
                                        return e;
                                    }
                                }

                                function cancellationAttachCancellationCallback(onCancel) {
                                    if (!this.isCancellable()) return this;

                                    var previousOnCancel = this._onCancel();
                                    if (previousOnCancel !== undefined) {
                                        if (util.isArray(previousOnCancel)) {
                                            previousOnCancel.push(onCancel);
                                        } else {
                                            this._setOnCancel([previousOnCancel, onCancel]);
                                        }
                                    } else {
                                        this._setOnCancel(onCancel);
                                    }
                                }

                                function cancellationOnCancel() {
                                    return this._onCancelField;
                                }

                                function cancellationSetOnCancel(onCancel) {
                                    this._onCancelField = onCancel;
                                }

                                function cancellationClearCancellationData() {
                                    this._cancellationParent = undefined;
                                    this._onCancelField = undefined;
                                }

                                function cancellationPropagateFrom(parent, flags) {
                                    if ((flags & 1) !== 0) {
                                        this._cancellationParent = parent;
                                        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                                        if (branchesRemainingToCancel === undefined) {
                                            branchesRemainingToCancel = 0;
                                        }
                                        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                                    }
                                    if ((flags & 2) !== 0 && parent._isBound()) {
                                        this._setBoundTo(parent._boundTo);
                                    }
                                }

                                function bindingPropagateFrom(parent, flags) {
                                    if ((flags & 2) !== 0 && parent._isBound()) {
                                        this._setBoundTo(parent._boundTo);
                                    }
                                }
                                var _propagateFromFunction = bindingPropagateFrom;

                                function _boundValueFunction() {
                                    var ret = this._boundTo;
                                    if (ret !== undefined) {
                                        if (ret instanceof Promise) {
                                            if (ret.isFulfilled()) {
                                                return ret.value();
                                            } else {
                                                return undefined;
                                            }
                                        }
                                    }
                                    return ret;
                                }

                                function longStackTracesCaptureStackTrace() {
                                    this._trace = new CapturedTrace(this._peekContext());
                                }

                                function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                                    if (canAttachTrace(error)) {
                                        var trace = this._trace;
                                        if (trace !== undefined) {
                                            if (ignoreSelf) trace = trace._parent;
                                        }
                                        if (trace !== undefined) {
                                            trace.attachExtraTrace(error);
                                        } else if (!error.__stackCleaned__) {
                                            var parsed = parseStackAndMessage(error);
                                            util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
                                            util.notEnumerableProp(error, "__stackCleaned__", true);
                                        }
                                    }
                                }

                                function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                                    if (returnValue === undefined && promiseCreated !== null && wForgottenReturn) {
                                        if (parent !== undefined && parent._returnedNonUndefined()) return;

                                        if (name) name = name + " ";
                                        var msg = "a promise was created in a " + name + "handler but was not returned from it";
                                        promise._warn(msg, true, promiseCreated);
                                    }
                                }

                                function deprecated(name, replacement) {
                                    var message = name + " is deprecated and will be removed in a future version.";
                                    if (replacement) message += " Use " + replacement + " instead.";
                                    return warn(message);
                                }

                                function warn(message, shouldUseOwnTrace, promise) {
                                    if (!config.warnings) return;
                                    var warning = new Warning(message);
                                    var ctx;
                                    if (shouldUseOwnTrace) {
                                        promise._attachExtraTrace(warning);
                                    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
                                        ctx.attachExtraTrace(warning);
                                    } else {
                                        var parsed = parseStackAndMessage(warning);
                                        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                                    }

                                    if (!activeFireEvent("warning", warning)) {
                                        formatAndLogError(warning, "", true);
                                    }
                                }

                                function reconstructStack(message, stacks) {
                                    for (var i = 0; i < stacks.length - 1; ++i) {
                                        stacks[i].push("From previous event:");
                                        stacks[i] = stacks[i].join("\n");
                                    }
                                    if (i < stacks.length) {
                                        stacks[i] = stacks[i].join("\n");
                                    }
                                    return message + "\n" + stacks.join("\n");
                                }

                                function removeDuplicateOrEmptyJumps(stacks) {
                                    for (var i = 0; i < stacks.length; ++i) {
                                        if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                                            stacks.splice(i, 1);
                                            i--;
                                        }
                                    }
                                }

                                function removeCommonRoots(stacks) {
                                    var current = stacks[0];
                                    for (var i = 1; i < stacks.length; ++i) {
                                        var prev = stacks[i];
                                        var currentLastIndex = current.length - 1;
                                        var currentLastLine = current[currentLastIndex];
                                        var commonRootMeetPoint = -1;

                                        for (var j = prev.length - 1; j >= 0; --j) {
                                            if (prev[j] === currentLastLine) {
                                                commonRootMeetPoint = j;
                                                break;
                                            }
                                        }

                                        for (var j = commonRootMeetPoint; j >= 0; --j) {
                                            var line = prev[j];
                                            if (current[currentLastIndex] === line) {
                                                current.pop();
                                                currentLastIndex--;
                                            } else {
                                                break;
                                            }
                                        }
                                        current = prev;
                                    }
                                }

                                function cleanStack(stack) {
                                    var ret = [];
                                    for (var i = 0; i < stack.length; ++i) {
                                        var line = stack[i];
                                        var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
                                        var isInternalFrame = isTraceLine && shouldIgnore(line);
                                        if (isTraceLine && !isInternalFrame) {
                                            if (indentStackFrames && line.charAt(0) !== " ") {
                                                line = "    " + line;
                                            }
                                            ret.push(line);
                                        }
                                    }
                                    return ret;
                                }

                                function stackFramesAsArray(error) {
                                    var stack = error.stack.replace(/\s+$/g, "").split("\n");
                                    for (var i = 0; i < stack.length; ++i) {
                                        var line = stack[i];
                                        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
                                            break;
                                        }
                                    }
                                    if (i > 0) {
                                        stack = stack.slice(i);
                                    }
                                    return stack;
                                }

                                function parseStackAndMessage(error) {
                                    var stack = error.stack;
                                    var message = error.toString();
                                    stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
                                    return {
                                        message: message,
                                        stack: cleanStack(stack)
                                    };
                                }

                                function formatAndLogError(error, title, isSoft) {
                                    if (typeof console !== "undefined") {
                                        var message;
                                        if (util.isObject(error)) {
                                            var stack = error.stack;
                                            message = title + formatStack(stack, error);
                                        } else {
                                            message = title + String(error);
                                        }
                                        if (typeof printWarning === "function") {
                                            printWarning(message, isSoft);
                                        } else if (typeof console.log === "function" || _typeof(console.log) === "object") {
                                            console.log(message);
                                        }
                                    }
                                }

                                function fireRejectionEvent(name, localHandler, reason, promise) {
                                    var localEventFired = false;
                                    try {
                                        if (typeof localHandler === "function") {
                                            localEventFired = true;
                                            if (name === "rejectionHandled") {
                                                localHandler(promise);
                                            } else {
                                                localHandler(reason, promise);
                                            }
                                        }
                                    } catch (e) {
                                        async.throwLater(e);
                                    }

                                    if (name === "unhandledRejection") {
                                        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
                                            formatAndLogError(reason, "Unhandled rejection ");
                                        }
                                    } else {
                                        activeFireEvent(name, promise);
                                    }
                                }

                                function formatNonError(obj) {
                                    var str;
                                    if (typeof obj === "function") {
                                        str = "[function " + (obj.name || "anonymous") + "]";
                                    } else {
                                        str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
                                        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
                                        if (ruselessToString.test(str)) {
                                            try {
                                                var newStr = JSON.stringify(obj);
                                                str = newStr;
                                            } catch (e) {}
                                        }
                                        if (str.length === 0) {
                                            str = "(empty array)";
                                        }
                                    }
                                    return "(<" + snip(str) + ">, no stack trace)";
                                }

                                function snip(str) {
                                    var maxChars = 41;
                                    if (str.length < maxChars) {
                                        return str;
                                    }
                                    return str.substr(0, maxChars - 3) + "...";
                                }

                                function longStackTracesIsSupported() {
                                    return typeof captureStackTrace === "function";
                                }

                                var shouldIgnore = function shouldIgnore() {
                                    return false;
                                };
                                var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                                function parseLineInfo(line) {
                                    var matches = line.match(parseLineInfoRegex);
                                    if (matches) {
                                        return {
                                            fileName: matches[1],
                                            line: parseInt(matches[2], 10)
                                        };
                                    }
                                }

                                function setBounds(firstLineError, lastLineError) {
                                    if (!longStackTracesIsSupported()) return;
                                    var firstStackLines = firstLineError.stack.split("\n");
                                    var lastStackLines = lastLineError.stack.split("\n");
                                    var firstIndex = -1;
                                    var lastIndex = -1;
                                    var firstFileName;
                                    var lastFileName;
                                    for (var i = 0; i < firstStackLines.length; ++i) {
                                        var result = parseLineInfo(firstStackLines[i]);
                                        if (result) {
                                            firstFileName = result.fileName;
                                            firstIndex = result.line;
                                            break;
                                        }
                                    }
                                    for (var i = 0; i < lastStackLines.length; ++i) {
                                        var result = parseLineInfo(lastStackLines[i]);
                                        if (result) {
                                            lastFileName = result.fileName;
                                            lastIndex = result.line;
                                            break;
                                        }
                                    }
                                    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
                                        return;
                                    }

                                    shouldIgnore = function shouldIgnore(line) {
                                        if (bluebirdFramePattern.test(line)) return true;
                                        var info = parseLineInfo(line);
                                        if (info) {
                                            if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    };
                                }

                                function CapturedTrace(parent) {
                                    this._parent = parent;
                                    this._promisesCreated = 0;
                                    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
                                    captureStackTrace(this, CapturedTrace);
                                    if (length > 32) this.uncycle();
                                }
                                util.inherits(CapturedTrace, Error);
                                Context.CapturedTrace = CapturedTrace;

                                CapturedTrace.prototype.uncycle = function () {
                                    var length = this._length;
                                    if (length < 2) return;
                                    var nodes = [];
                                    var stackToIndex = {};

                                    for (var i = 0, node = this; node !== undefined; ++i) {
                                        nodes.push(node);
                                        node = node._parent;
                                    }
                                    length = this._length = i;
                                    for (var i = length - 1; i >= 0; --i) {
                                        var stack = nodes[i].stack;
                                        if (stackToIndex[stack] === undefined) {
                                            stackToIndex[stack] = i;
                                        }
                                    }
                                    for (var i = 0; i < length; ++i) {
                                        var currentStack = nodes[i].stack;
                                        var index = stackToIndex[currentStack];
                                        if (index !== undefined && index !== i) {
                                            if (index > 0) {
                                                nodes[index - 1]._parent = undefined;
                                                nodes[index - 1]._length = 1;
                                            }
                                            nodes[i]._parent = undefined;
                                            nodes[i]._length = 1;
                                            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                                            if (index < length - 1) {
                                                cycleEdgeNode._parent = nodes[index + 1];
                                                cycleEdgeNode._parent.uncycle();
                                                cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                                            } else {
                                                cycleEdgeNode._parent = undefined;
                                                cycleEdgeNode._length = 1;
                                            }
                                            var currentChildLength = cycleEdgeNode._length + 1;
                                            for (var j = i - 2; j >= 0; --j) {
                                                nodes[j]._length = currentChildLength;
                                                currentChildLength++;
                                            }
                                            return;
                                        }
                                    }
                                };

                                CapturedTrace.prototype.attachExtraTrace = function (error) {
                                    if (error.__stackCleaned__) return;
                                    this.uncycle();
                                    var parsed = parseStackAndMessage(error);
                                    var message = parsed.message;
                                    var stacks = [parsed.stack];

                                    var trace = this;
                                    while (trace !== undefined) {
                                        stacks.push(cleanStack(trace.stack.split("\n")));
                                        trace = trace._parent;
                                    }
                                    removeCommonRoots(stacks);
                                    removeDuplicateOrEmptyJumps(stacks);
                                    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                                    util.notEnumerableProp(error, "__stackCleaned__", true);
                                };

                                var captureStackTrace = function stackDetection() {
                                    var v8stackFramePattern = /^\s*at\s*/;
                                    var v8stackFormatter = function v8stackFormatter(stack, error) {
                                        if (typeof stack === "string") return stack;

                                        if (error.name !== undefined && error.message !== undefined) {
                                            return error.toString();
                                        }
                                        return formatNonError(error);
                                    };

                                    if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
                                        Error.stackTraceLimit += 6;
                                        stackFramePattern = v8stackFramePattern;
                                        formatStack = v8stackFormatter;
                                        var captureStackTrace = Error.captureStackTrace;

                                        shouldIgnore = function shouldIgnore(line) {
                                            return bluebirdFramePattern.test(line);
                                        };
                                        return function (receiver, ignoreUntil) {
                                            Error.stackTraceLimit += 6;
                                            captureStackTrace(receiver, ignoreUntil);
                                            Error.stackTraceLimit -= 6;
                                        };
                                    }
                                    var err = new Error();

                                    if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                                        stackFramePattern = /@/;
                                        formatStack = v8stackFormatter;
                                        indentStackFrames = true;
                                        return function captureStackTrace(o) {
                                            o.stack = new Error().stack;
                                        };
                                    }

                                    var hasStackAfterThrow;
                                    try {
                                        throw new Error();
                                    } catch (e) {
                                        hasStackAfterThrow = "stack" in e;
                                    }
                                    if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
                                        stackFramePattern = v8stackFramePattern;
                                        formatStack = v8stackFormatter;
                                        return function captureStackTrace(o) {
                                            Error.stackTraceLimit += 6;
                                            try {
                                                throw new Error();
                                            } catch (e) {
                                                o.stack = e.stack;
                                            }
                                            Error.stackTraceLimit -= 6;
                                        };
                                    }

                                    formatStack = function formatStack(stack, error) {
                                        if (typeof stack === "string") return stack;

                                        if (((typeof error === "undefined" ? "undefined" : _typeof(error)) === "object" || typeof error === "function") && error.name !== undefined && error.message !== undefined) {
                                            return error.toString();
                                        }
                                        return formatNonError(error);
                                    };

                                    return null;
                                }([]);

                                if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
                                    printWarning = function printWarning(message) {
                                        console.warn(message);
                                    };
                                    if (util.isNode && process.stderr.isTTY) {
                                        printWarning = function printWarning(message, isSoft) {
                                            var color = isSoft ? "\x1B[33m" : "\x1B[31m";
                                            console.warn(color + message + "\x1B[0m\n");
                                        };
                                    } else if (!util.isNode && typeof new Error().stack === "string") {
                                        printWarning = function printWarning(message, isSoft) {
                                            console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
                                        };
                                    }
                                }

                                var config = {
                                    warnings: warnings,
                                    longStackTraces: false,
                                    cancellation: false,
                                    monitoring: false
                                };

                                if (longStackTraces) Promise.longStackTraces();

                                return {
                                    longStackTraces: function longStackTraces() {
                                        return config.longStackTraces;
                                    },
                                    warnings: function warnings() {
                                        return config.warnings;
                                    },
                                    cancellation: function cancellation() {
                                        return config.cancellation;
                                    },
                                    monitoring: function monitoring() {
                                        return config.monitoring;
                                    },
                                    propagateFromFunction: function propagateFromFunction() {
                                        return _propagateFromFunction;
                                    },
                                    boundValueFunction: function boundValueFunction() {
                                        return _boundValueFunction;
                                    },
                                    checkForgottenReturns: checkForgottenReturns,
                                    setBounds: setBounds,
                                    warn: warn,
                                    deprecated: deprecated,
                                    CapturedTrace: CapturedTrace,
                                    fireDomEvent: fireDomEvent,
                                    fireGlobalEvent: fireGlobalEvent
                                };
                            };
                        }, { "./errors": 12, "./util": 36 }], 10: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise) {
                                function returner() {
                                    return this.value;
                                }
                                function thrower() {
                                    throw this.reason;
                                }

                                Promise.prototype["return"] = Promise.prototype.thenReturn = function (value) {
                                    if (value instanceof Promise) value.suppressUnhandledRejections();
                                    return this._then(returner, undefined, undefined, { value: value }, undefined);
                                };

                                Promise.prototype["throw"] = Promise.prototype.thenThrow = function (reason) {
                                    return this._then(thrower, undefined, undefined, { reason: reason }, undefined);
                                };

                                Promise.prototype.catchThrow = function (reason) {
                                    if (arguments.length <= 1) {
                                        return this._then(undefined, thrower, undefined, { reason: reason }, undefined);
                                    } else {
                                        var _reason = arguments[1];
                                        var handler = function handler() {
                                            throw _reason;
                                        };
                                        return this.caught(reason, handler);
                                    }
                                };

                                Promise.prototype.catchReturn = function (value) {
                                    if (arguments.length <= 1) {
                                        if (value instanceof Promise) value.suppressUnhandledRejections();
                                        return this._then(undefined, returner, undefined, { value: value }, undefined);
                                    } else {
                                        var _value = arguments[1];
                                        if (_value instanceof Promise) _value.suppressUnhandledRejections();
                                        var handler = function handler() {
                                            return _value;
                                        };
                                        return this.caught(value, handler);
                                    }
                                };
                            };
                        }, {}], 11: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL) {
                                var PromiseReduce = Promise.reduce;
                                var PromiseAll = Promise.all;

                                function promiseAllThis() {
                                    return PromiseAll(this);
                                }

                                function PromiseMapSeries(promises, fn) {
                                    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
                                }

                                Promise.prototype.each = function (fn) {
                                    return this.mapSeries(fn)._then(promiseAllThis, undefined, undefined, this, undefined);
                                };

                                Promise.prototype.mapSeries = function (fn) {
                                    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
                                };

                                Promise.each = function (promises, fn) {
                                    return PromiseMapSeries(promises, fn)._then(promiseAllThis, undefined, undefined, promises, undefined);
                                };

                                Promise.mapSeries = PromiseMapSeries;
                            };
                        }, {}], 12: [function (_dereq_, module, exports) {
                            "use strict";

                            var es5 = _dereq_("./es5");
                            var Objectfreeze = es5.freeze;
                            var util = _dereq_("./util");
                            var inherits = util.inherits;
                            var notEnumerableProp = util.notEnumerableProp;

                            function subError(nameProperty, defaultMessage) {
                                function SubError(message) {
                                    if (!(this instanceof SubError)) return new SubError(message);
                                    notEnumerableProp(this, "message", typeof message === "string" ? message : defaultMessage);
                                    notEnumerableProp(this, "name", nameProperty);
                                    if (Error.captureStackTrace) {
                                        Error.captureStackTrace(this, this.constructor);
                                    } else {
                                        Error.call(this);
                                    }
                                }
                                inherits(SubError, Error);
                                return SubError;
                            }

                            var _TypeError, _RangeError;
                            var Warning = subError("Warning", "warning");
                            var CancellationError = subError("CancellationError", "cancellation error");
                            var TimeoutError = subError("TimeoutError", "timeout error");
                            var AggregateError = subError("AggregateError", "aggregate error");
                            try {
                                _TypeError = TypeError;
                                _RangeError = RangeError;
                            } catch (e) {
                                _TypeError = subError("TypeError", "type error");
                                _RangeError = subError("RangeError", "range error");
                            }

                            var methods = ("join pop push shift unshift slice filter forEach some " + "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

                            for (var i = 0; i < methods.length; ++i) {
                                if (typeof Array.prototype[methods[i]] === "function") {
                                    AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                                }
                            }

                            es5.defineProperty(AggregateError.prototype, "length", {
                                value: 0,
                                configurable: false,
                                writable: true,
                                enumerable: true
                            });
                            AggregateError.prototype["isOperational"] = true;
                            var level = 0;
                            AggregateError.prototype.toString = function () {
                                var indent = Array(level * 4 + 1).join(" ");
                                var ret = "\n" + indent + "AggregateError of:" + "\n";
                                level++;
                                indent = Array(level * 4 + 1).join(" ");
                                for (var i = 0; i < this.length; ++i) {
                                    var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                                    var lines = str.split("\n");
                                    for (var j = 0; j < lines.length; ++j) {
                                        lines[j] = indent + lines[j];
                                    }
                                    str = lines.join("\n");
                                    ret += str + "\n";
                                }
                                level--;
                                return ret;
                            };

                            function OperationalError(message) {
                                if (!(this instanceof OperationalError)) return new OperationalError(message);
                                notEnumerableProp(this, "name", "OperationalError");
                                notEnumerableProp(this, "message", message);
                                this.cause = message;
                                this["isOperational"] = true;

                                if (message instanceof Error) {
                                    notEnumerableProp(this, "message", message.message);
                                    notEnumerableProp(this, "stack", message.stack);
                                } else if (Error.captureStackTrace) {
                                    Error.captureStackTrace(this, this.constructor);
                                }
                            }
                            inherits(OperationalError, Error);

                            var errorTypes = Error["__BluebirdErrorTypes__"];
                            if (!errorTypes) {
                                errorTypes = Objectfreeze({
                                    CancellationError: CancellationError,
                                    TimeoutError: TimeoutError,
                                    OperationalError: OperationalError,
                                    RejectionError: OperationalError,
                                    AggregateError: AggregateError
                                });
                                es5.defineProperty(Error, "__BluebirdErrorTypes__", {
                                    value: errorTypes,
                                    writable: false,
                                    enumerable: false,
                                    configurable: false
                                });
                            }

                            module.exports = {
                                Error: Error,
                                TypeError: _TypeError,
                                RangeError: _RangeError,
                                CancellationError: errorTypes.CancellationError,
                                OperationalError: errorTypes.OperationalError,
                                TimeoutError: errorTypes.TimeoutError,
                                AggregateError: errorTypes.AggregateError,
                                Warning: Warning
                            };
                        }, { "./es5": 13, "./util": 36 }], 13: [function (_dereq_, module, exports) {
                            var isES5 = function () {
                                "use strict";

                                return this === undefined;
                            }();

                            if (isES5) {
                                module.exports = {
                                    freeze: Object.freeze,
                                    defineProperty: Object.defineProperty,
                                    getDescriptor: Object.getOwnPropertyDescriptor,
                                    keys: Object.keys,
                                    names: Object.getOwnPropertyNames,
                                    getPrototypeOf: Object.getPrototypeOf,
                                    isArray: Array.isArray,
                                    isES5: isES5,
                                    propertyIsWritable: function propertyIsWritable(obj, prop) {
                                        var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                                        return !!(!descriptor || descriptor.writable || descriptor.set);
                                    }
                                };
                            } else {
                                var has = {}.hasOwnProperty;
                                var str = {}.toString;
                                var proto = {}.constructor.prototype;

                                var ObjectKeys = function ObjectKeys(o) {
                                    var ret = [];
                                    for (var key in o) {
                                        if (has.call(o, key)) {
                                            ret.push(key);
                                        }
                                    }
                                    return ret;
                                };

                                var ObjectGetDescriptor = function ObjectGetDescriptor(o, key) {
                                    return { value: o[key] };
                                };

                                var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
                                    o[key] = desc.value;
                                    return o;
                                };

                                var ObjectFreeze = function ObjectFreeze(obj) {
                                    return obj;
                                };

                                var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
                                    try {
                                        return Object(obj).constructor.prototype;
                                    } catch (e) {
                                        return proto;
                                    }
                                };

                                var ArrayIsArray = function ArrayIsArray(obj) {
                                    try {
                                        return str.call(obj) === "[object Array]";
                                    } catch (e) {
                                        return false;
                                    }
                                };

                                module.exports = {
                                    isArray: ArrayIsArray,
                                    keys: ObjectKeys,
                                    names: ObjectKeys,
                                    defineProperty: ObjectDefineProperty,
                                    getDescriptor: ObjectGetDescriptor,
                                    freeze: ObjectFreeze,
                                    getPrototypeOf: ObjectGetPrototypeOf,
                                    isES5: isES5,
                                    propertyIsWritable: function propertyIsWritable() {
                                        return true;
                                    }
                                };
                            }
                        }, {}], 14: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL) {
                                var PromiseMap = Promise.map;

                                Promise.prototype.filter = function (fn, options) {
                                    return PromiseMap(this, fn, options, INTERNAL);
                                };

                                Promise.filter = function (promises, fn, options) {
                                    return PromiseMap(promises, fn, options, INTERNAL);
                                };
                            };
                        }, {}], 15: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, tryConvertToPromise) {
                                var util = _dereq_("./util");
                                var CancellationError = Promise.CancellationError;
                                var errorObj = util.errorObj;

                                function PassThroughHandlerContext(promise, type, handler) {
                                    this.promise = promise;
                                    this.type = type;
                                    this.handler = handler;
                                    this.called = false;
                                    this.cancelPromise = null;
                                }

                                PassThroughHandlerContext.prototype.isFinallyHandler = function () {
                                    return this.type === 0;
                                };

                                function FinallyHandlerCancelReaction(finallyHandler) {
                                    this.finallyHandler = finallyHandler;
                                }

                                FinallyHandlerCancelReaction.prototype._resultCancelled = function () {
                                    checkCancel(this.finallyHandler);
                                };

                                function checkCancel(ctx, reason) {
                                    if (ctx.cancelPromise != null) {
                                        if (arguments.length > 1) {
                                            ctx.cancelPromise._reject(reason);
                                        } else {
                                            ctx.cancelPromise._cancel();
                                        }
                                        ctx.cancelPromise = null;
                                        return true;
                                    }
                                    return false;
                                }

                                function succeed() {
                                    return finallyHandler.call(this, this.promise._target()._settledValue());
                                }
                                function fail(reason) {
                                    if (checkCancel(this, reason)) return;
                                    errorObj.e = reason;
                                    return errorObj;
                                }
                                function finallyHandler(reasonOrValue) {
                                    var promise = this.promise;
                                    var handler = this.handler;

                                    if (!this.called) {
                                        this.called = true;
                                        var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                                        if (ret !== undefined) {
                                            promise._setReturnedNonUndefined();
                                            var maybePromise = tryConvertToPromise(ret, promise);
                                            if (maybePromise instanceof Promise) {
                                                if (this.cancelPromise != null) {
                                                    if (maybePromise.isCancelled()) {
                                                        var reason = new CancellationError("late cancellation observer");
                                                        promise._attachExtraTrace(reason);
                                                        errorObj.e = reason;
                                                        return errorObj;
                                                    } else if (maybePromise.isPending()) {
                                                        maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                                    }
                                                }
                                                return maybePromise._then(succeed, fail, undefined, this, undefined);
                                            }
                                        }
                                    }

                                    if (promise.isRejected()) {
                                        checkCancel(this);
                                        errorObj.e = reasonOrValue;
                                        return errorObj;
                                    } else {
                                        checkCancel(this);
                                        return reasonOrValue;
                                    }
                                }

                                Promise.prototype._passThrough = function (handler, type, success, fail) {
                                    if (typeof handler !== "function") return this.then();
                                    return this._then(success, fail, undefined, new PassThroughHandlerContext(this, type, handler), undefined);
                                };

                                Promise.prototype.lastly = Promise.prototype["finally"] = function (handler) {
                                    return this._passThrough(handler, 0, finallyHandler, finallyHandler);
                                };

                                Promise.prototype.tap = function (handler) {
                                    return this._passThrough(handler, 1, finallyHandler);
                                };

                                return PassThroughHandlerContext;
                            };
                        }, { "./util": 36 }], 16: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
                                var errors = _dereq_("./errors");
                                var TypeError = errors.TypeError;
                                var util = _dereq_("./util");
                                var errorObj = util.errorObj;
                                var tryCatch = util.tryCatch;
                                var yieldHandlers = [];

                                function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
                                    for (var i = 0; i < yieldHandlers.length; ++i) {
                                        traceParent._pushContext();
                                        var result = tryCatch(yieldHandlers[i])(value);
                                        traceParent._popContext();
                                        if (result === errorObj) {
                                            traceParent._pushContext();
                                            var ret = Promise.reject(errorObj.e);
                                            traceParent._popContext();
                                            return ret;
                                        }
                                        var maybePromise = tryConvertToPromise(result, traceParent);
                                        if (maybePromise instanceof Promise) return maybePromise;
                                    }
                                    return null;
                                }

                                function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
                                    var promise = this._promise = new Promise(INTERNAL);
                                    promise._captureStackTrace();
                                    promise._setOnCancel(this);
                                    this._stack = stack;
                                    this._generatorFunction = generatorFunction;
                                    this._receiver = receiver;
                                    this._generator = undefined;
                                    this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
                                    this._yieldedPromise = null;
                                }
                                util.inherits(PromiseSpawn, Proxyable);

                                PromiseSpawn.prototype._isResolved = function () {
                                    return this._promise === null;
                                };

                                PromiseSpawn.prototype._cleanup = function () {
                                    this._promise = this._generator = null;
                                };

                                PromiseSpawn.prototype._promiseCancelled = function () {
                                    if (this._isResolved()) return;
                                    var implementsReturn = typeof this._generator["return"] !== "undefined";

                                    var result;
                                    if (!implementsReturn) {
                                        var reason = new Promise.CancellationError("generator .return() sentinel");
                                        Promise.coroutine.returnSentinel = reason;
                                        this._promise._attachExtraTrace(reason);
                                        this._promise._pushContext();
                                        result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                                        this._promise._popContext();
                                        if (result === errorObj && result.e === reason) {
                                            result = null;
                                        }
                                    } else {
                                        this._promise._pushContext();
                                        result = tryCatch(this._generator["return"]).call(this._generator, undefined);
                                        this._promise._popContext();
                                    }
                                    var promise = this._promise;
                                    this._cleanup();
                                    if (result === errorObj) {
                                        promise._rejectCallback(result.e, false);
                                    } else {
                                        promise.cancel();
                                    }
                                };

                                PromiseSpawn.prototype._promiseFulfilled = function (value) {
                                    this._yieldedPromise = null;
                                    this._promise._pushContext();
                                    var result = tryCatch(this._generator.next).call(this._generator, value);
                                    this._promise._popContext();
                                    this._continue(result);
                                };

                                PromiseSpawn.prototype._promiseRejected = function (reason) {
                                    this._yieldedPromise = null;
                                    this._promise._attachExtraTrace(reason);
                                    this._promise._pushContext();
                                    var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                                    this._promise._popContext();
                                    this._continue(result);
                                };

                                PromiseSpawn.prototype._resultCancelled = function () {
                                    if (this._yieldedPromise instanceof Promise) {
                                        var promise = this._yieldedPromise;
                                        this._yieldedPromise = null;
                                        promise.cancel();
                                    }
                                };

                                PromiseSpawn.prototype.promise = function () {
                                    return this._promise;
                                };

                                PromiseSpawn.prototype._run = function () {
                                    this._generator = this._generatorFunction.call(this._receiver);
                                    this._receiver = this._generatorFunction = undefined;
                                    this._promiseFulfilled(undefined);
                                };

                                PromiseSpawn.prototype._continue = function (result) {
                                    var promise = this._promise;
                                    if (result === errorObj) {
                                        this._cleanup();
                                        return promise._rejectCallback(result.e, false);
                                    }

                                    var value = result.value;
                                    if (result.done === true) {
                                        this._cleanup();
                                        return promise._resolveCallback(value);
                                    } else {
                                        var maybePromise = tryConvertToPromise(value, this._promise);
                                        if (!(maybePromise instanceof Promise)) {
                                            maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
                                            if (maybePromise === null) {
                                                this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", value) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                                                return;
                                            }
                                        }
                                        maybePromise = maybePromise._target();
                                        var bitField = maybePromise._bitField;
                                        ;
                                        if ((bitField & 50397184) === 0) {
                                            this._yieldedPromise = maybePromise;
                                            maybePromise._proxy(this, null);
                                        } else if ((bitField & 33554432) !== 0) {
                                            this._promiseFulfilled(maybePromise._value());
                                        } else if ((bitField & 16777216) !== 0) {
                                            this._promiseRejected(maybePromise._reason());
                                        } else {
                                            this._promiseCancelled();
                                        }
                                    }
                                };

                                Promise.coroutine = function (generatorFunction, options) {
                                    if (typeof generatorFunction !== "function") {
                                        throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    var yieldHandler = Object(options).yieldHandler;
                                    var PromiseSpawn$ = PromiseSpawn;
                                    var stack = new Error().stack;
                                    return function () {
                                        var generator = generatorFunction.apply(this, arguments);
                                        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler, stack);
                                        var ret = spawn.promise();
                                        spawn._generator = generator;
                                        spawn._promiseFulfilled(undefined);
                                        return ret;
                                    };
                                };

                                Promise.coroutine.addYieldHandler = function (fn) {
                                    if (typeof fn !== "function") {
                                        throw new TypeError("expecting a function but got " + util.classString(fn));
                                    }
                                    yieldHandlers.push(fn);
                                };

                                Promise.spawn = function (generatorFunction) {
                                    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
                                    if (typeof generatorFunction !== "function") {
                                        return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    var spawn = new PromiseSpawn(generatorFunction, this);
                                    var ret = spawn.promise();
                                    spawn._run(Promise.spawn);
                                    return ret;
                                };
                            };
                        }, { "./errors": 12, "./util": 36 }], 17: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
                                var util = _dereq_("./util");
                                var canEvaluate = util.canEvaluate;
                                var tryCatch = util.tryCatch;
                                var errorObj = util.errorObj;
                                var reject;

                                if (!true) {
                                    if (canEvaluate) {
                                        var thenCallback = function thenCallback(i) {
                                            return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
                                        };

                                        var promiseSetter = function promiseSetter(i) {
                                            return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
                                        };

                                        var generateHolderClass = function generateHolderClass(total) {
                                            var props = new Array(total);
                                            for (var i = 0; i < props.length; ++i) {
                                                props[i] = "this.p" + (i + 1);
                                            }
                                            var assignment = props.join(" = ") + " = null;";
                                            var cancellationCode = "var promise;\n" + props.map(function (prop) {
                                                return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
                                            }).join("\n");
                                            var passedArguments = props.join(", ");
                                            var name = "Holder$" + total;

                                            var code = "return function(tryCatch, errorObj, Promise) {           \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.now = 0;                                                \n\
            }                                                                \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    promise._pushContext();                                  \n\
                    var callback = this.fn;                                  \n\
                    var ret = tryCatch(callback)([ThePassedArguments]);      \n\
                    promise._popContext();                                   \n\
                    if (ret === errorObj) {                                  \n\
                        promise._rejectCallback(ret.e, false);               \n\
                    } else {                                                 \n\
                        promise._resolveCallback(ret);                       \n\
                    }                                                        \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise);                                      \n\
        ";

                                            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);

                                            return new Function("tryCatch", "errorObj", "Promise", code)(tryCatch, errorObj, Promise);
                                        };

                                        var holderClasses = [];
                                        var thenCallbacks = [];
                                        var promiseSetters = [];

                                        for (var i = 0; i < 8; ++i) {
                                            holderClasses.push(generateHolderClass(i + 1));
                                            thenCallbacks.push(thenCallback(i + 1));
                                            promiseSetters.push(promiseSetter(i + 1));
                                        }

                                        reject = function reject(reason) {
                                            this._reject(reason);
                                        };
                                    }
                                }

                                Promise.join = function () {
                                    var last = arguments.length - 1;
                                    var fn;
                                    if (last > 0 && typeof arguments[last] === "function") {
                                        fn = arguments[last];
                                        if (!true) {
                                            if (last <= 8 && canEvaluate) {
                                                var ret = new Promise(INTERNAL);
                                                ret._captureStackTrace();
                                                var HolderClass = holderClasses[last - 1];
                                                var holder = new HolderClass(fn);
                                                var callbacks = thenCallbacks;

                                                for (var i = 0; i < last; ++i) {
                                                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                                                    if (maybePromise instanceof Promise) {
                                                        maybePromise = maybePromise._target();
                                                        var bitField = maybePromise._bitField;
                                                        ;
                                                        if ((bitField & 50397184) === 0) {
                                                            maybePromise._then(callbacks[i], reject, undefined, ret, holder);
                                                            promiseSetters[i](maybePromise, holder);
                                                        } else if ((bitField & 33554432) !== 0) {
                                                            callbacks[i].call(ret, maybePromise._value(), holder);
                                                        } else if ((bitField & 16777216) !== 0) {
                                                            ret._reject(maybePromise._reason());
                                                        } else {
                                                            ret._cancel();
                                                        }
                                                    } else {
                                                        callbacks[i].call(ret, maybePromise, holder);
                                                    }
                                                }
                                                if (!ret._isFateSealed()) {
                                                    ret._setAsyncGuaranteed();
                                                    ret._setOnCancel(holder);
                                                }
                                                return ret;
                                            }
                                        }
                                    }
                                    var args = [].slice.call(arguments);;
                                    if (fn) args.pop();
                                    var ret = new PromiseArray(args).promise();
                                    return fn !== undefined ? ret.spread(fn) : ret;
                                };
                            };
                        }, { "./util": 36 }], 18: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                                var getDomain = Promise._getDomain;
                                var util = _dereq_("./util");
                                var tryCatch = util.tryCatch;
                                var errorObj = util.errorObj;
                                var EMPTY_ARRAY = [];

                                function MappingPromiseArray(promises, fn, limit, _filter) {
                                    this.constructor$(promises);
                                    this._promise._captureStackTrace();
                                    var domain = getDomain();
                                    this._callback = domain === null ? fn : domain.bind(fn);
                                    this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
                                    this._limit = limit;
                                    this._inFlight = 0;
                                    this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
                                    this._init$(undefined, -2);
                                }
                                util.inherits(MappingPromiseArray, PromiseArray);

                                MappingPromiseArray.prototype._init = function () {};

                                MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                    var values = this._values;
                                    var length = this.length();
                                    var preservedValues = this._preservedValues;
                                    var limit = this._limit;

                                    if (index < 0) {
                                        index = index * -1 - 1;
                                        values[index] = value;
                                        if (limit >= 1) {
                                            this._inFlight--;
                                            this._drainQueue();
                                            if (this._isResolved()) return true;
                                        }
                                    } else {
                                        if (limit >= 1 && this._inFlight >= limit) {
                                            values[index] = value;
                                            this._queue.push(index);
                                            return false;
                                        }
                                        if (preservedValues !== null) preservedValues[index] = value;

                                        var promise = this._promise;
                                        var callback = this._callback;
                                        var receiver = promise._boundValue();
                                        promise._pushContext();
                                        var ret = tryCatch(callback).call(receiver, value, index, length);
                                        var promiseCreated = promise._popContext();
                                        debug.checkForgottenReturns(ret, promiseCreated, preservedValues !== null ? "Promise.filter" : "Promise.map", promise);
                                        if (ret === errorObj) {
                                            this._reject(ret.e);
                                            return true;
                                        }

                                        var maybePromise = tryConvertToPromise(ret, this._promise);
                                        if (maybePromise instanceof Promise) {
                                            maybePromise = maybePromise._target();
                                            var bitField = maybePromise._bitField;
                                            ;
                                            if ((bitField & 50397184) === 0) {
                                                if (limit >= 1) this._inFlight++;
                                                values[index] = maybePromise;
                                                maybePromise._proxy(this, (index + 1) * -1);
                                                return false;
                                            } else if ((bitField & 33554432) !== 0) {
                                                ret = maybePromise._value();
                                            } else if ((bitField & 16777216) !== 0) {
                                                this._reject(maybePromise._reason());
                                                return true;
                                            } else {
                                                this._cancel();
                                                return true;
                                            }
                                        }
                                        values[index] = ret;
                                    }
                                    var totalResolved = ++this._totalResolved;
                                    if (totalResolved >= length) {
                                        if (preservedValues !== null) {
                                            this._filter(values, preservedValues);
                                        } else {
                                            this._resolve(values);
                                        }
                                        return true;
                                    }
                                    return false;
                                };

                                MappingPromiseArray.prototype._drainQueue = function () {
                                    var queue = this._queue;
                                    var limit = this._limit;
                                    var values = this._values;
                                    while (queue.length > 0 && this._inFlight < limit) {
                                        if (this._isResolved()) return;
                                        var index = queue.pop();
                                        this._promiseFulfilled(values[index], index);
                                    }
                                };

                                MappingPromiseArray.prototype._filter = function (booleans, values) {
                                    var len = values.length;
                                    var ret = new Array(len);
                                    var j = 0;
                                    for (var i = 0; i < len; ++i) {
                                        if (booleans[i]) ret[j++] = values[i];
                                    }
                                    ret.length = j;
                                    this._resolve(ret);
                                };

                                MappingPromiseArray.prototype.preservedValues = function () {
                                    return this._preservedValues;
                                };

                                function map(promises, fn, options, _filter) {
                                    if (typeof fn !== "function") {
                                        return apiRejection("expecting a function but got " + util.classString(fn));
                                    }
                                    var limit = (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" && options !== null ? options.concurrency : 0;
                                    limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
                                    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
                                }

                                Promise.prototype.map = function (fn, options) {
                                    return map(this, fn, options, null);
                                };

                                Promise.map = function (promises, fn, options, _filter) {
                                    return map(promises, fn, options, _filter);
                                };
                            };
                        }, { "./util": 36 }], 19: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
                                var util = _dereq_("./util");
                                var tryCatch = util.tryCatch;

                                Promise.method = function (fn) {
                                    if (typeof fn !== "function") {
                                        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
                                    }
                                    return function () {
                                        var ret = new Promise(INTERNAL);
                                        ret._captureStackTrace();
                                        ret._pushContext();
                                        var value = tryCatch(fn).apply(this, arguments);
                                        var promiseCreated = ret._popContext();
                                        debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
                                        ret._resolveFromSyncValue(value);
                                        return ret;
                                    };
                                };

                                Promise.attempt = Promise["try"] = function (fn) {
                                    if (typeof fn !== "function") {
                                        return apiRejection("expecting a function but got " + util.classString(fn));
                                    }
                                    var ret = new Promise(INTERNAL);
                                    ret._captureStackTrace();
                                    ret._pushContext();
                                    var value;
                                    if (arguments.length > 1) {
                                        debug.deprecated("calling Promise.try with more than 1 argument");
                                        var arg = arguments[1];
                                        var ctx = arguments[2];
                                        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
                                    } else {
                                        value = tryCatch(fn)();
                                    }
                                    var promiseCreated = ret._popContext();
                                    debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
                                    ret._resolveFromSyncValue(value);
                                    return ret;
                                };

                                Promise.prototype._resolveFromSyncValue = function (value) {
                                    if (value === util.errorObj) {
                                        this._rejectCallback(value.e, false);
                                    } else {
                                        this._resolveCallback(value, true);
                                    }
                                };
                            };
                        }, { "./util": 36 }], 20: [function (_dereq_, module, exports) {
                            "use strict";

                            var util = _dereq_("./util");
                            var maybeWrapAsError = util.maybeWrapAsError;
                            var errors = _dereq_("./errors");
                            var OperationalError = errors.OperationalError;
                            var es5 = _dereq_("./es5");

                            function isUntypedError(obj) {
                                return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
                            }

                            var rErrorKey = /^(?:name|message|stack|cause)$/;
                            function wrapAsOperationalError(obj) {
                                var ret;
                                if (isUntypedError(obj)) {
                                    ret = new OperationalError(obj);
                                    ret.name = obj.name;
                                    ret.message = obj.message;
                                    ret.stack = obj.stack;
                                    var keys = es5.keys(obj);
                                    for (var i = 0; i < keys.length; ++i) {
                                        var key = keys[i];
                                        if (!rErrorKey.test(key)) {
                                            ret[key] = obj[key];
                                        }
                                    }
                                    return ret;
                                }
                                util.markAsOriginatingFromRejection(obj);
                                return obj;
                            }

                            function nodebackForPromise(promise, multiArgs) {
                                return function (err, value) {
                                    if (promise === null) return;
                                    if (err) {
                                        var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                                        promise._attachExtraTrace(wrapped);
                                        promise._reject(wrapped);
                                    } else if (!multiArgs) {
                                        promise._fulfill(value);
                                    } else {
                                        var args = [].slice.call(arguments, 1);;
                                        promise._fulfill(args);
                                    }
                                    promise = null;
                                };
                            }

                            module.exports = nodebackForPromise;
                        }, { "./errors": 12, "./es5": 13, "./util": 36 }], 21: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise) {
                                var util = _dereq_("./util");
                                var async = Promise._async;
                                var tryCatch = util.tryCatch;
                                var errorObj = util.errorObj;

                                function spreadAdapter(val, nodeback) {
                                    var promise = this;
                                    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
                                    var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
                                    if (ret === errorObj) {
                                        async.throwLater(ret.e);
                                    }
                                }

                                function successAdapter(val, nodeback) {
                                    var promise = this;
                                    var receiver = promise._boundValue();
                                    var ret = val === undefined ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
                                    if (ret === errorObj) {
                                        async.throwLater(ret.e);
                                    }
                                }
                                function errorAdapter(reason, nodeback) {
                                    var promise = this;
                                    if (!reason) {
                                        var newReason = new Error(reason + "");
                                        newReason.cause = reason;
                                        reason = newReason;
                                    }
                                    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
                                    if (ret === errorObj) {
                                        async.throwLater(ret.e);
                                    }
                                }

                                Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback, options) {
                                    if (typeof nodeback == "function") {
                                        var adapter = successAdapter;
                                        if (options !== undefined && Object(options).spread) {
                                            adapter = spreadAdapter;
                                        }
                                        this._then(adapter, errorAdapter, undefined, this, nodeback);
                                    }
                                    return this;
                                };
                            };
                        }, { "./util": 36 }], 22: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function () {
                                var makeSelfResolutionError = function makeSelfResolutionError() {
                                    return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
                                };
                                var reflectHandler = function reflectHandler() {
                                    return new Promise.PromiseInspection(this._target());
                                };
                                var apiRejection = function apiRejection(msg) {
                                    return Promise.reject(new TypeError(msg));
                                };
                                function Proxyable() {}
                                var UNDEFINED_BINDING = {};
                                var util = _dereq_("./util");

                                var getDomain;
                                if (util.isNode) {
                                    getDomain = function getDomain() {
                                        var ret = process.domain;
                                        if (ret === undefined) ret = null;
                                        return ret;
                                    };
                                } else {
                                    getDomain = function getDomain() {
                                        return null;
                                    };
                                }
                                util.notEnumerableProp(Promise, "_getDomain", getDomain);

                                var es5 = _dereq_("./es5");
                                var Async = _dereq_("./async");
                                var async = new Async();
                                es5.defineProperty(Promise, "_async", { value: async });
                                var errors = _dereq_("./errors");
                                var TypeError = Promise.TypeError = errors.TypeError;
                                Promise.RangeError = errors.RangeError;
                                var CancellationError = Promise.CancellationError = errors.CancellationError;
                                Promise.TimeoutError = errors.TimeoutError;
                                Promise.OperationalError = errors.OperationalError;
                                Promise.RejectionError = errors.OperationalError;
                                Promise.AggregateError = errors.AggregateError;
                                var INTERNAL = function INTERNAL() {};
                                var APPLY = {};
                                var NEXT_FILTER = {};
                                var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
                                var PromiseArray = _dereq_("./promise_array")(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                                var Context = _dereq_("./context")(Promise);
                                /*jshint unused:false*/
                                var createContext = Context.create;
                                var debug = _dereq_("./debuggability")(Promise, Context);
                                var CapturedTrace = debug.CapturedTrace;
                                var PassThroughHandlerContext = _dereq_("./finally")(Promise, tryConvertToPromise);
                                var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
                                var nodebackForPromise = _dereq_("./nodeback");
                                var errorObj = util.errorObj;
                                var tryCatch = util.tryCatch;
                                function check(self, executor) {
                                    if (typeof executor !== "function") {
                                        throw new TypeError("expecting a function but got " + util.classString(executor));
                                    }
                                    if (self.constructor !== Promise) {
                                        throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                }

                                function Promise(executor) {
                                    this._bitField = 0;
                                    this._fulfillmentHandler0 = undefined;
                                    this._rejectionHandler0 = undefined;
                                    this._promise0 = undefined;
                                    this._receiver0 = undefined;
                                    if (executor !== INTERNAL) {
                                        check(this, executor);
                                        this._resolveFromExecutor(executor);
                                    }
                                    this._promiseCreated();
                                    this._fireEvent("promiseCreated", this);
                                }

                                Promise.prototype.toString = function () {
                                    return "[object Promise]";
                                };

                                Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
                                    var len = arguments.length;
                                    if (len > 1) {
                                        var catchInstances = new Array(len - 1),
                                            j = 0,
                                            i;
                                        for (i = 0; i < len - 1; ++i) {
                                            var item = arguments[i];
                                            if (util.isObject(item)) {
                                                catchInstances[j++] = item;
                                            } else {
                                                return apiRejection("expecting an object but got " + util.classString(item));
                                            }
                                        }
                                        catchInstances.length = j;
                                        fn = arguments[i];
                                        return this.then(undefined, catchFilter(catchInstances, fn, this));
                                    }
                                    return this.then(undefined, fn);
                                };

                                Promise.prototype.reflect = function () {
                                    return this._then(reflectHandler, reflectHandler, undefined, this, undefined);
                                };

                                Promise.prototype.then = function (didFulfill, didReject) {
                                    if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
                                        var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
                                        if (arguments.length > 1) {
                                            msg += ", " + util.classString(didReject);
                                        }
                                        this._warn(msg);
                                    }
                                    return this._then(didFulfill, didReject, undefined, undefined, undefined);
                                };

                                Promise.prototype.done = function (didFulfill, didReject) {
                                    var promise = this._then(didFulfill, didReject, undefined, undefined, undefined);
                                    promise._setIsFinal();
                                };

                                Promise.prototype.spread = function (fn) {
                                    if (typeof fn !== "function") {
                                        return apiRejection("expecting a function but got " + util.classString(fn));
                                    }
                                    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
                                };

                                Promise.prototype.toJSON = function () {
                                    var ret = {
                                        isFulfilled: false,
                                        isRejected: false,
                                        fulfillmentValue: undefined,
                                        rejectionReason: undefined
                                    };
                                    if (this.isFulfilled()) {
                                        ret.fulfillmentValue = this.value();
                                        ret.isFulfilled = true;
                                    } else if (this.isRejected()) {
                                        ret.rejectionReason = this.reason();
                                        ret.isRejected = true;
                                    }
                                    return ret;
                                };

                                Promise.prototype.all = function () {
                                    if (arguments.length > 0) {
                                        this._warn(".all() was passed arguments but it does not take any");
                                    }
                                    return new PromiseArray(this).promise();
                                };

                                Promise.prototype.error = function (fn) {
                                    return this.caught(util.originatesFromRejection, fn);
                                };

                                Promise.is = function (val) {
                                    return val instanceof Promise;
                                };

                                Promise.fromNode = Promise.fromCallback = function (fn) {
                                    var ret = new Promise(INTERNAL);
                                    ret._captureStackTrace();
                                    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
                                    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                                    if (result === errorObj) {
                                        ret._rejectCallback(result.e, true);
                                    }
                                    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
                                    return ret;
                                };

                                Promise.all = function (promises) {
                                    return new PromiseArray(promises).promise();
                                };

                                Promise.cast = function (obj) {
                                    var ret = tryConvertToPromise(obj);
                                    if (!(ret instanceof Promise)) {
                                        ret = new Promise(INTERNAL);
                                        ret._captureStackTrace();
                                        ret._setFulfilled();
                                        ret._rejectionHandler0 = obj;
                                    }
                                    return ret;
                                };

                                Promise.resolve = Promise.fulfilled = Promise.cast;

                                Promise.reject = Promise.rejected = function (reason) {
                                    var ret = new Promise(INTERNAL);
                                    ret._captureStackTrace();
                                    ret._rejectCallback(reason, true);
                                    return ret;
                                };

                                Promise.setScheduler = function (fn) {
                                    if (typeof fn !== "function") {
                                        throw new TypeError("expecting a function but got " + util.classString(fn));
                                    }
                                    var prev = async._schedule;
                                    async._schedule = fn;
                                    return prev;
                                };

                                Promise.prototype._then = function (didFulfill, didReject, _, receiver, internalData) {
                                    var haveInternalData = internalData !== undefined;
                                    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                                    var target = this._target();
                                    var bitField = target._bitField;

                                    if (!haveInternalData) {
                                        promise._propagateFrom(this, 3);
                                        promise._captureStackTrace();
                                        if (receiver === undefined && (this._bitField & 2097152) !== 0) {
                                            if (!((bitField & 50397184) === 0)) {
                                                receiver = this._boundValue();
                                            } else {
                                                receiver = target === this ? undefined : this._boundTo;
                                            }
                                        }
                                        this._fireEvent("promiseChained", this, promise);
                                    }

                                    var domain = getDomain();
                                    if (!((bitField & 50397184) === 0)) {
                                        var handler,
                                            value,
                                            settler = target._settlePromiseCtx;
                                        if ((bitField & 33554432) !== 0) {
                                            value = target._rejectionHandler0;
                                            handler = didFulfill;
                                        } else if ((bitField & 16777216) !== 0) {
                                            value = target._fulfillmentHandler0;
                                            handler = didReject;
                                            target._unsetRejectionIsUnhandled();
                                        } else {
                                            settler = target._settlePromiseLateCancellationObserver;
                                            value = new CancellationError("late cancellation observer");
                                            target._attachExtraTrace(value);
                                            handler = didReject;
                                        }

                                        async.invoke(settler, target, {
                                            handler: domain === null ? handler : typeof handler === "function" && domain.bind(handler),
                                            promise: promise,
                                            receiver: receiver,
                                            value: value
                                        });
                                    } else {
                                        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                                    }

                                    return promise;
                                };

                                Promise.prototype._length = function () {
                                    return this._bitField & 65535;
                                };

                                Promise.prototype._isFateSealed = function () {
                                    return (this._bitField & 117506048) !== 0;
                                };

                                Promise.prototype._isFollowing = function () {
                                    return (this._bitField & 67108864) === 67108864;
                                };

                                Promise.prototype._setLength = function (len) {
                                    this._bitField = this._bitField & -65536 | len & 65535;
                                };

                                Promise.prototype._setFulfilled = function () {
                                    this._bitField = this._bitField | 33554432;
                                    this._fireEvent("promiseFulfilled", this);
                                };

                                Promise.prototype._setRejected = function () {
                                    this._bitField = this._bitField | 16777216;
                                    this._fireEvent("promiseRejected", this);
                                };

                                Promise.prototype._setFollowing = function () {
                                    this._bitField = this._bitField | 67108864;
                                    this._fireEvent("promiseResolved", this);
                                };

                                Promise.prototype._setIsFinal = function () {
                                    this._bitField = this._bitField | 4194304;
                                };

                                Promise.prototype._isFinal = function () {
                                    return (this._bitField & 4194304) > 0;
                                };

                                Promise.prototype._unsetCancelled = function () {
                                    this._bitField = this._bitField & ~65536;
                                };

                                Promise.prototype._setCancelled = function () {
                                    this._bitField = this._bitField | 65536;
                                    this._fireEvent("promiseCancelled", this);
                                };

                                Promise.prototype._setAsyncGuaranteed = function () {
                                    this._bitField = this._bitField | 134217728;
                                };

                                Promise.prototype._receiverAt = function (index) {
                                    var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
                                    if (ret === UNDEFINED_BINDING) {
                                        return undefined;
                                    } else if (ret === undefined && this._isBound()) {
                                        return this._boundValue();
                                    }
                                    return ret;
                                };

                                Promise.prototype._promiseAt = function (index) {
                                    return this[index * 4 - 4 + 2];
                                };

                                Promise.prototype._fulfillmentHandlerAt = function (index) {
                                    return this[index * 4 - 4 + 0];
                                };

                                Promise.prototype._rejectionHandlerAt = function (index) {
                                    return this[index * 4 - 4 + 1];
                                };

                                Promise.prototype._boundValue = function () {};

                                Promise.prototype._migrateCallback0 = function (follower) {
                                    var bitField = follower._bitField;
                                    var fulfill = follower._fulfillmentHandler0;
                                    var reject = follower._rejectionHandler0;
                                    var promise = follower._promise0;
                                    var receiver = follower._receiverAt(0);
                                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                                };

                                Promise.prototype._migrateCallbackAt = function (follower, index) {
                                    var fulfill = follower._fulfillmentHandlerAt(index);
                                    var reject = follower._rejectionHandlerAt(index);
                                    var promise = follower._promiseAt(index);
                                    var receiver = follower._receiverAt(index);
                                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                                };

                                Promise.prototype._addCallbacks = function (fulfill, reject, promise, receiver, domain) {
                                    var index = this._length();

                                    if (index >= 65535 - 4) {
                                        index = 0;
                                        this._setLength(0);
                                    }

                                    if (index === 0) {
                                        this._promise0 = promise;
                                        this._receiver0 = receiver;
                                        if (typeof fulfill === "function") {
                                            this._fulfillmentHandler0 = domain === null ? fulfill : domain.bind(fulfill);
                                        }
                                        if (typeof reject === "function") {
                                            this._rejectionHandler0 = domain === null ? reject : domain.bind(reject);
                                        }
                                    } else {
                                        var base = index * 4 - 4;
                                        this[base + 2] = promise;
                                        this[base + 3] = receiver;
                                        if (typeof fulfill === "function") {
                                            this[base + 0] = domain === null ? fulfill : domain.bind(fulfill);
                                        }
                                        if (typeof reject === "function") {
                                            this[base + 1] = domain === null ? reject : domain.bind(reject);
                                        }
                                    }
                                    this._setLength(index + 1);
                                    return index;
                                };

                                Promise.prototype._proxy = function (proxyable, arg) {
                                    this._addCallbacks(undefined, undefined, arg, proxyable, null);
                                };

                                Promise.prototype._resolveCallback = function (value, shouldBind) {
                                    if ((this._bitField & 117506048) !== 0) return;
                                    if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
                                    var maybePromise = tryConvertToPromise(value, this);
                                    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

                                    if (shouldBind) this._propagateFrom(maybePromise, 2);

                                    var promise = maybePromise._target();
                                    var bitField = promise._bitField;
                                    if ((bitField & 50397184) === 0) {
                                        var len = this._length();
                                        if (len > 0) promise._migrateCallback0(this);
                                        for (var i = 1; i < len; ++i) {
                                            promise._migrateCallbackAt(this, i);
                                        }
                                        this._setFollowing();
                                        this._setLength(0);
                                        this._setFollowee(promise);
                                    } else if ((bitField & 33554432) !== 0) {
                                        this._fulfill(promise._value());
                                    } else if ((bitField & 16777216) !== 0) {
                                        this._reject(promise._reason());
                                    } else {
                                        var reason = new CancellationError("late cancellation observer");
                                        promise._attachExtraTrace(reason);
                                        this._reject(reason);
                                    }
                                };

                                Promise.prototype._rejectCallback = function (reason, synchronous, ignoreNonErrorWarnings) {
                                    var trace = util.ensureErrorObject(reason);
                                    var hasStack = trace === reason;
                                    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                                        var message = "a promise was rejected with a non-error: " + util.classString(reason);
                                        this._warn(message, true);
                                    }
                                    this._attachExtraTrace(trace, synchronous ? hasStack : false);
                                    this._reject(reason);
                                };

                                Promise.prototype._resolveFromExecutor = function (executor) {
                                    var promise = this;
                                    this._captureStackTrace();
                                    this._pushContext();
                                    var synchronous = true;
                                    var r = this._execute(executor, function (value) {
                                        promise._resolveCallback(value);
                                    }, function (reason) {
                                        promise._rejectCallback(reason, synchronous);
                                    });
                                    synchronous = false;
                                    this._popContext();

                                    if (r !== undefined) {
                                        promise._rejectCallback(r, true);
                                    }
                                };

                                Promise.prototype._settlePromiseFromHandler = function (handler, receiver, value, promise) {
                                    var bitField = promise._bitField;
                                    if ((bitField & 65536) !== 0) return;
                                    promise._pushContext();
                                    var x;
                                    if (receiver === APPLY) {
                                        if (!value || typeof value.length !== "number") {
                                            x = errorObj;
                                            x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
                                        } else {
                                            x = tryCatch(handler).apply(this._boundValue(), value);
                                        }
                                    } else {
                                        x = tryCatch(handler).call(receiver, value);
                                    }
                                    var promiseCreated = promise._popContext();
                                    bitField = promise._bitField;
                                    if ((bitField & 65536) !== 0) return;

                                    if (x === NEXT_FILTER) {
                                        promise._reject(value);
                                    } else if (x === errorObj || x === promise) {
                                        var err = x === promise ? makeSelfResolutionError() : x.e;
                                        promise._rejectCallback(err, false);
                                    } else {
                                        debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
                                        promise._resolveCallback(x);
                                    }
                                };

                                Promise.prototype._target = function () {
                                    var ret = this;
                                    while (ret._isFollowing()) {
                                        ret = ret._followee();
                                    }return ret;
                                };

                                Promise.prototype._followee = function () {
                                    return this._rejectionHandler0;
                                };

                                Promise.prototype._setFollowee = function (promise) {
                                    this._rejectionHandler0 = promise;
                                };

                                Promise.prototype._settlePromise = function (promise, handler, receiver, value) {
                                    var isPromise = promise instanceof Promise;
                                    var bitField = this._bitField;
                                    var asyncGuaranteed = (bitField & 134217728) !== 0;
                                    if ((bitField & 65536) !== 0) {
                                        if (isPromise) promise._invokeInternalOnCancel();

                                        if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
                                            receiver.cancelPromise = promise;
                                            if (tryCatch(handler).call(receiver, value) === errorObj) {
                                                promise._reject(errorObj.e);
                                            }
                                        } else if (handler === reflectHandler) {
                                            promise._fulfill(reflectHandler.call(receiver));
                                        } else if (receiver instanceof Proxyable) {
                                            receiver._promiseCancelled(promise);
                                        } else if (isPromise || promise instanceof PromiseArray) {
                                            promise._cancel();
                                        } else {
                                            receiver.cancel();
                                        }
                                    } else if (typeof handler === "function") {
                                        if (!isPromise) {
                                            handler.call(receiver, value, promise);
                                        } else {
                                            if (asyncGuaranteed) promise._setAsyncGuaranteed();
                                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                                        }
                                    } else if (receiver instanceof Proxyable) {
                                        if (!receiver._isResolved()) {
                                            if ((bitField & 33554432) !== 0) {
                                                receiver._promiseFulfilled(value, promise);
                                            } else {
                                                receiver._promiseRejected(value, promise);
                                            }
                                        }
                                    } else if (isPromise) {
                                        if (asyncGuaranteed) promise._setAsyncGuaranteed();
                                        if ((bitField & 33554432) !== 0) {
                                            promise._fulfill(value);
                                        } else {
                                            promise._reject(value);
                                        }
                                    }
                                };

                                Promise.prototype._settlePromiseLateCancellationObserver = function (ctx) {
                                    var handler = ctx.handler;
                                    var promise = ctx.promise;
                                    var receiver = ctx.receiver;
                                    var value = ctx.value;
                                    if (typeof handler === "function") {
                                        if (!(promise instanceof Promise)) {
                                            handler.call(receiver, value, promise);
                                        } else {
                                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                                        }
                                    } else if (promise instanceof Promise) {
                                        promise._reject(value);
                                    }
                                };

                                Promise.prototype._settlePromiseCtx = function (ctx) {
                                    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                                };

                                Promise.prototype._settlePromise0 = function (handler, value, bitField) {
                                    var promise = this._promise0;
                                    var receiver = this._receiverAt(0);
                                    this._promise0 = undefined;
                                    this._receiver0 = undefined;
                                    this._settlePromise(promise, handler, receiver, value);
                                };

                                Promise.prototype._clearCallbackDataAtIndex = function (index) {
                                    var base = index * 4 - 4;
                                    this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = undefined;
                                };

                                Promise.prototype._fulfill = function (value) {
                                    var bitField = this._bitField;
                                    if ((bitField & 117506048) >>> 16) return;
                                    if (value === this) {
                                        var err = makeSelfResolutionError();
                                        this._attachExtraTrace(err);
                                        return this._reject(err);
                                    }
                                    this._setFulfilled();
                                    this._rejectionHandler0 = value;

                                    if ((bitField & 65535) > 0) {
                                        if ((bitField & 134217728) !== 0) {
                                            this._settlePromises();
                                        } else {
                                            async.settlePromises(this);
                                        }
                                    }
                                };

                                Promise.prototype._reject = function (reason) {
                                    var bitField = this._bitField;
                                    if ((bitField & 117506048) >>> 16) return;
                                    this._setRejected();
                                    this._fulfillmentHandler0 = reason;

                                    if (this._isFinal()) {
                                        return async.fatalError(reason, util.isNode);
                                    }

                                    if ((bitField & 65535) > 0) {
                                        if ((bitField & 134217728) !== 0) {
                                            this._settlePromises();
                                        } else {
                                            async.settlePromises(this);
                                        }
                                    } else {
                                        this._ensurePossibleRejectionHandled();
                                    }
                                };

                                Promise.prototype._fulfillPromises = function (len, value) {
                                    for (var i = 1; i < len; i++) {
                                        var handler = this._fulfillmentHandlerAt(i);
                                        var promise = this._promiseAt(i);
                                        var receiver = this._receiverAt(i);
                                        this._clearCallbackDataAtIndex(i);
                                        this._settlePromise(promise, handler, receiver, value);
                                    }
                                };

                                Promise.prototype._rejectPromises = function (len, reason) {
                                    for (var i = 1; i < len; i++) {
                                        var handler = this._rejectionHandlerAt(i);
                                        var promise = this._promiseAt(i);
                                        var receiver = this._receiverAt(i);
                                        this._clearCallbackDataAtIndex(i);
                                        this._settlePromise(promise, handler, receiver, reason);
                                    }
                                };

                                Promise.prototype._settlePromises = function () {
                                    var bitField = this._bitField;
                                    var len = bitField & 65535;

                                    if (len > 0) {
                                        if ((bitField & 16842752) !== 0) {
                                            var reason = this._fulfillmentHandler0;
                                            this._settlePromise0(this._rejectionHandler0, reason, bitField);
                                            this._rejectPromises(len, reason);
                                        } else {
                                            var value = this._rejectionHandler0;
                                            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                                            this._fulfillPromises(len, value);
                                        }
                                        this._setLength(0);
                                    }
                                    this._clearCancellationData();
                                };

                                Promise.prototype._settledValue = function () {
                                    var bitField = this._bitField;
                                    if ((bitField & 33554432) !== 0) {
                                        return this._rejectionHandler0;
                                    } else if ((bitField & 16777216) !== 0) {
                                        return this._fulfillmentHandler0;
                                    }
                                };

                                function deferResolve(v) {
                                    this.promise._resolveCallback(v);
                                }
                                function deferReject(v) {
                                    this.promise._rejectCallback(v, false);
                                }

                                Promise.defer = Promise.pending = function () {
                                    debug.deprecated("Promise.defer", "new Promise");
                                    var promise = new Promise(INTERNAL);
                                    return {
                                        promise: promise,
                                        resolve: deferResolve,
                                        reject: deferReject
                                    };
                                };

                                util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);

                                _dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
                                _dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
                                _dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
                                _dereq_("./direct_resolve")(Promise);
                                _dereq_("./synchronous_inspection")(Promise);
                                _dereq_("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, debug);
                                Promise.Promise = Promise;
                                _dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
                                _dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
                                _dereq_('./timers.js')(Promise, INTERNAL, debug);
                                _dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
                                _dereq_('./nodeify.js')(Promise);
                                _dereq_('./call_get.js')(Promise);
                                _dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
                                _dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
                                _dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
                                _dereq_('./settle.js')(Promise, PromiseArray, debug);
                                _dereq_('./some.js')(Promise, PromiseArray, apiRejection);
                                _dereq_('./promisify.js')(Promise, INTERNAL);
                                _dereq_('./any.js')(Promise);
                                _dereq_('./each.js')(Promise, INTERNAL);
                                _dereq_('./filter.js')(Promise, INTERNAL);

                                util.toFastProperties(Promise);
                                util.toFastProperties(Promise.prototype);
                                function fillTypes(value) {
                                    var p = new Promise(INTERNAL);
                                    p._fulfillmentHandler0 = value;
                                    p._rejectionHandler0 = value;
                                    p._promise0 = value;
                                    p._receiver0 = value;
                                }
                                // Complete slack tracking, opt out of field-type tracking and           
                                // stabilize map                                                         
                                fillTypes({ a: 1 });
                                fillTypes({ b: 2 });
                                fillTypes({ c: 3 });
                                fillTypes(1);
                                fillTypes(function () {});
                                fillTypes(undefined);
                                fillTypes(false);
                                fillTypes(new Promise(INTERNAL));
                                debug.setBounds(Async.firstLineError, util.lastLineError);
                                return Promise;
                            };
                        }, { "./any.js": 1, "./async": 2, "./bind": 3, "./call_get.js": 5, "./cancel": 6, "./catch_filter": 7, "./context": 8, "./debuggability": 9, "./direct_resolve": 10, "./each.js": 11, "./errors": 12, "./es5": 13, "./filter.js": 14, "./finally": 15, "./generators.js": 16, "./join": 17, "./map.js": 18, "./method": 19, "./nodeback": 20, "./nodeify.js": 21, "./promise_array": 23, "./promisify.js": 24, "./props.js": 25, "./race.js": 27, "./reduce.js": 28, "./settle.js": 30, "./some.js": 31, "./synchronous_inspection": 32, "./thenables": 33, "./timers.js": 34, "./using.js": 35, "./util": 36 }], 23: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                                var util = _dereq_("./util");
                                var isArray = util.isArray;

                                function toResolutionValue(val) {
                                    switch (val) {
                                        case -2:
                                            return [];
                                        case -3:
                                            return {};
                                    }
                                }

                                function PromiseArray(values) {
                                    var promise = this._promise = new Promise(INTERNAL);
                                    if (values instanceof Promise) {
                                        promise._propagateFrom(values, 3);
                                    }
                                    promise._setOnCancel(this);
                                    this._values = values;
                                    this._length = 0;
                                    this._totalResolved = 0;
                                    this._init(undefined, -2);
                                }
                                util.inherits(PromiseArray, Proxyable);

                                PromiseArray.prototype.length = function () {
                                    return this._length;
                                };

                                PromiseArray.prototype.promise = function () {
                                    return this._promise;
                                };

                                PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                                    var values = tryConvertToPromise(this._values, this._promise);
                                    if (values instanceof Promise) {
                                        values = values._target();
                                        var bitField = values._bitField;
                                        ;
                                        this._values = values;

                                        if ((bitField & 50397184) === 0) {
                                            this._promise._setAsyncGuaranteed();
                                            return values._then(init, this._reject, undefined, this, resolveValueIfEmpty);
                                        } else if ((bitField & 33554432) !== 0) {
                                            values = values._value();
                                        } else if ((bitField & 16777216) !== 0) {
                                            return this._reject(values._reason());
                                        } else {
                                            return this._cancel();
                                        }
                                    }
                                    values = util.asArray(values);
                                    if (values === null) {
                                        var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
                                        this._promise._rejectCallback(err, false);
                                        return;
                                    }

                                    if (values.length === 0) {
                                        if (resolveValueIfEmpty === -5) {
                                            this._resolveEmptyArray();
                                        } else {
                                            this._resolve(toResolutionValue(resolveValueIfEmpty));
                                        }
                                        return;
                                    }
                                    this._iterate(values);
                                };

                                PromiseArray.prototype._iterate = function (values) {
                                    var len = this.getActualLength(values.length);
                                    this._length = len;
                                    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                                    var result = this._promise;
                                    var isResolved = false;
                                    var bitField = null;
                                    for (var i = 0; i < len; ++i) {
                                        var maybePromise = tryConvertToPromise(values[i], result);

                                        if (maybePromise instanceof Promise) {
                                            maybePromise = maybePromise._target();
                                            bitField = maybePromise._bitField;
                                        } else {
                                            bitField = null;
                                        }

                                        if (isResolved) {
                                            if (bitField !== null) {
                                                maybePromise.suppressUnhandledRejections();
                                            }
                                        } else if (bitField !== null) {
                                            if ((bitField & 50397184) === 0) {
                                                maybePromise._proxy(this, i);
                                                this._values[i] = maybePromise;
                                            } else if ((bitField & 33554432) !== 0) {
                                                isResolved = this._promiseFulfilled(maybePromise._value(), i);
                                            } else if ((bitField & 16777216) !== 0) {
                                                isResolved = this._promiseRejected(maybePromise._reason(), i);
                                            } else {
                                                isResolved = this._promiseCancelled(i);
                                            }
                                        } else {
                                            isResolved = this._promiseFulfilled(maybePromise, i);
                                        }
                                    }
                                    if (!isResolved) result._setAsyncGuaranteed();
                                };

                                PromiseArray.prototype._isResolved = function () {
                                    return this._values === null;
                                };

                                PromiseArray.prototype._resolve = function (value) {
                                    this._values = null;
                                    this._promise._fulfill(value);
                                };

                                PromiseArray.prototype._cancel = function () {
                                    if (this._isResolved() || !this._promise.isCancellable()) return;
                                    this._values = null;
                                    this._promise._cancel();
                                };

                                PromiseArray.prototype._reject = function (reason) {
                                    this._values = null;
                                    this._promise._rejectCallback(reason, false);
                                };

                                PromiseArray.prototype._promiseFulfilled = function (value, index) {
                                    this._values[index] = value;
                                    var totalResolved = ++this._totalResolved;
                                    if (totalResolved >= this._length) {
                                        this._resolve(this._values);
                                        return true;
                                    }
                                    return false;
                                };

                                PromiseArray.prototype._promiseCancelled = function () {
                                    this._cancel();
                                    return true;
                                };

                                PromiseArray.prototype._promiseRejected = function (reason) {
                                    this._totalResolved++;
                                    this._reject(reason);
                                    return true;
                                };

                                PromiseArray.prototype._resultCancelled = function () {
                                    if (this._isResolved()) return;
                                    var values = this._values;
                                    this._cancel();
                                    if (values instanceof Promise) {
                                        values.cancel();
                                    } else {
                                        for (var i = 0; i < values.length; ++i) {
                                            if (values[i] instanceof Promise) {
                                                values[i].cancel();
                                            }
                                        }
                                    }
                                };

                                PromiseArray.prototype.shouldCopyValues = function () {
                                    return true;
                                };

                                PromiseArray.prototype.getActualLength = function (len) {
                                    return len;
                                };

                                return PromiseArray;
                            };
                        }, { "./util": 36 }], 24: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL) {
                                var THIS = {};
                                var util = _dereq_("./util");
                                var nodebackForPromise = _dereq_("./nodeback");
                                var withAppended = util.withAppended;
                                var maybeWrapAsError = util.maybeWrapAsError;
                                var canEvaluate = util.canEvaluate;
                                var TypeError = _dereq_("./errors").TypeError;
                                var defaultSuffix = "Async";
                                var defaultPromisified = { __isPromisified__: true };
                                var noCopyProps = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"];
                                var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

                                var defaultFilter = function defaultFilter(name) {
                                    return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
                                };

                                function propsFilter(key) {
                                    return !noCopyPropsPattern.test(key);
                                }

                                function isPromisified(fn) {
                                    try {
                                        return fn.__isPromisified__ === true;
                                    } catch (e) {
                                        return false;
                                    }
                                }

                                function hasPromisified(obj, key, suffix) {
                                    var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
                                    return val ? isPromisified(val) : false;
                                }
                                function checkValid(ret, suffix, suffixRegexp) {
                                    for (var i = 0; i < ret.length; i += 2) {
                                        var key = ret[i];
                                        if (suffixRegexp.test(key)) {
                                            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
                                            for (var j = 0; j < ret.length; j += 2) {
                                                if (ret[j] === keyWithoutAsyncSuffix) {
                                                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
                                                }
                                            }
                                        }
                                    }
                                }

                                function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
                                    var keys = util.inheritedDataKeys(obj);
                                    var ret = [];
                                    for (var i = 0; i < keys.length; ++i) {
                                        var key = keys[i];
                                        var value = obj[key];
                                        var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj);
                                        if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter(key, value, obj, passesDefaultFilter)) {
                                            ret.push(key, value);
                                        }
                                    }
                                    checkValid(ret, suffix, suffixRegexp);
                                    return ret;
                                }

                                var escapeIdentRegex = function escapeIdentRegex(str) {
                                    return str.replace(/([$])/, "\\$");
                                };

                                var makeNodePromisifiedEval;
                                if (!true) {
                                    var switchCaseArgumentOrder = function switchCaseArgumentOrder(likelyArgumentCount) {
                                        var ret = [likelyArgumentCount];
                                        var min = Math.max(0, likelyArgumentCount - 1 - 3);
                                        for (var i = likelyArgumentCount - 1; i >= min; --i) {
                                            ret.push(i);
                                        }
                                        for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
                                            ret.push(i);
                                        }
                                        return ret;
                                    };

                                    var argumentSequence = function argumentSequence(argumentCount) {
                                        return util.filledRange(argumentCount, "_arg", "");
                                    };

                                    var parameterDeclaration = function parameterDeclaration(parameterCount) {
                                        return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
                                    };

                                    var parameterCount = function parameterCount(fn) {
                                        if (typeof fn.length === "number") {
                                            return Math.max(Math.min(fn.length, 1023 + 1), 0);
                                        }
                                        return 0;
                                    };

                                    makeNodePromisifiedEval = function makeNodePromisifiedEval(callback, receiver, originalName, fn, _, multiArgs) {
                                        var newParameterCount = Math.max(0, parameterCount(fn) - 1);
                                        var argumentOrder = switchCaseArgumentOrder(newParameterCount);
                                        var shouldProxyThis = typeof callback === "string" || receiver === THIS;

                                        function generateCallForArgumentCount(count) {
                                            var args = argumentSequence(count).join(", ");
                                            var comma = count > 0 ? ", " : "";
                                            var ret;
                                            if (shouldProxyThis) {
                                                ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
                                            } else {
                                                ret = receiver === undefined ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
                                            }
                                            return ret.replace("{{args}}", args).replace(", ", comma);
                                        }

                                        function generateArgumentSwitchCase() {
                                            var ret = "";
                                            for (var i = 0; i < argumentOrder.length; ++i) {
                                                ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
                                            }

                                            ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
                                            return ret;
                                        }

                                        var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
                                        var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
                                        body = body.replace("Parameters", parameterDeclaration(newParameterCount));
                                        return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise, fn, receiver, withAppended, maybeWrapAsError, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
                                    };
                                }

                                function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
                                    var defaultThis = function () {
                                        return this;
                                    }();
                                    var method = callback;
                                    if (typeof method === "string") {
                                        callback = fn;
                                    }
                                    function promisified() {
                                        var _receiver = receiver;
                                        if (receiver === THIS) _receiver = this;
                                        var promise = new Promise(INTERNAL);
                                        promise._captureStackTrace();
                                        var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
                                        var fn = nodebackForPromise(promise, multiArgs);
                                        try {
                                            cb.apply(_receiver, withAppended(arguments, fn));
                                        } catch (e) {
                                            promise._rejectCallback(maybeWrapAsError(e), true, true);
                                        }
                                        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
                                        return promise;
                                    }
                                    util.notEnumerableProp(promisified, "__isPromisified__", true);
                                    return promisified;
                                }

                                var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;

                                function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
                                    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
                                    var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);

                                    for (var i = 0, len = methods.length; i < len; i += 2) {
                                        var key = methods[i];
                                        var fn = methods[i + 1];
                                        var promisifiedKey = key + suffix;
                                        if (promisifier === makeNodePromisified) {
                                            obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                        } else {
                                            var promisified = promisifier(fn, function () {
                                                return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                            });
                                            util.notEnumerableProp(promisified, "__isPromisified__", true);
                                            obj[promisifiedKey] = promisified;
                                        }
                                    }
                                    util.toFastProperties(obj);
                                    return obj;
                                }

                                function promisify(callback, receiver, multiArgs) {
                                    return makeNodePromisified(callback, receiver, undefined, callback, null, multiArgs);
                                }

                                Promise.promisify = function (fn, options) {
                                    if (typeof fn !== "function") {
                                        throw new TypeError("expecting a function but got " + util.classString(fn));
                                    }
                                    if (isPromisified(fn)) {
                                        return fn;
                                    }
                                    options = Object(options);
                                    var receiver = options.context === undefined ? THIS : options.context;
                                    var multiArgs = !!options.multiArgs;
                                    var ret = promisify(fn, receiver, multiArgs);
                                    util.copyDescriptors(fn, ret, propsFilter);
                                    return ret;
                                };

                                Promise.promisifyAll = function (target, options) {
                                    if (typeof target !== "function" && (typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object") {
                                        throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    options = Object(options);
                                    var multiArgs = !!options.multiArgs;
                                    var suffix = options.suffix;
                                    if (typeof suffix !== "string") suffix = defaultSuffix;
                                    var filter = options.filter;
                                    if (typeof filter !== "function") filter = defaultFilter;
                                    var promisifier = options.promisifier;
                                    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

                                    if (!util.isIdentifier(suffix)) {
                                        throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
                                    }

                                    var keys = util.inheritedDataKeys(target);
                                    for (var i = 0; i < keys.length; ++i) {
                                        var value = target[keys[i]];
                                        if (keys[i] !== "constructor" && util.isClass(value)) {
                                            promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
                                            promisifyAll(value, suffix, filter, promisifier, multiArgs);
                                        }
                                    }

                                    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
                                };
                            };
                        }, { "./errors": 12, "./nodeback": 20, "./util": 36 }], 25: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, tryConvertToPromise, apiRejection) {
                                var util = _dereq_("./util");
                                var isObject = util.isObject;
                                var es5 = _dereq_("./es5");
                                var Es6Map;
                                if (typeof Map === "function") Es6Map = Map;

                                var mapToEntries = function () {
                                    var index = 0;
                                    var size = 0;

                                    function extractEntry(value, key) {
                                        this[index] = value;
                                        this[index + size] = key;
                                        index++;
                                    }

                                    return function mapToEntries(map) {
                                        size = map.size;
                                        index = 0;
                                        var ret = new Array(map.size * 2);
                                        map.forEach(extractEntry, ret);
                                        return ret;
                                    };
                                }();

                                var entriesToMap = function entriesToMap(entries) {
                                    var ret = new Es6Map();
                                    var length = entries.length / 2 | 0;
                                    for (var i = 0; i < length; ++i) {
                                        var key = entries[length + i];
                                        var value = entries[i];
                                        ret.set(key, value);
                                    }
                                    return ret;
                                };

                                function PropertiesPromiseArray(obj) {
                                    var isMap = false;
                                    var entries;
                                    if (Es6Map !== undefined && obj instanceof Es6Map) {
                                        entries = mapToEntries(obj);
                                        isMap = true;
                                    } else {
                                        var keys = es5.keys(obj);
                                        var len = keys.length;
                                        entries = new Array(len * 2);
                                        for (var i = 0; i < len; ++i) {
                                            var key = keys[i];
                                            entries[i] = obj[key];
                                            entries[i + len] = key;
                                        }
                                    }
                                    this.constructor$(entries);
                                    this._isMap = isMap;
                                    this._init$(undefined, -3);
                                }
                                util.inherits(PropertiesPromiseArray, PromiseArray);

                                PropertiesPromiseArray.prototype._init = function () {};

                                PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                    this._values[index] = value;
                                    var totalResolved = ++this._totalResolved;
                                    if (totalResolved >= this._length) {
                                        var val;
                                        if (this._isMap) {
                                            val = entriesToMap(this._values);
                                        } else {
                                            val = {};
                                            var keyOffset = this.length();
                                            for (var i = 0, len = this.length(); i < len; ++i) {
                                                val[this._values[i + keyOffset]] = this._values[i];
                                            }
                                        }
                                        this._resolve(val);
                                        return true;
                                    }
                                    return false;
                                };

                                PropertiesPromiseArray.prototype.shouldCopyValues = function () {
                                    return false;
                                };

                                PropertiesPromiseArray.prototype.getActualLength = function (len) {
                                    return len >> 1;
                                };

                                function props(promises) {
                                    var ret;
                                    var castValue = tryConvertToPromise(promises);

                                    if (!isObject(castValue)) {
                                        return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
                                    } else if (castValue instanceof Promise) {
                                        ret = castValue._then(Promise.props, undefined, undefined, undefined, undefined);
                                    } else {
                                        ret = new PropertiesPromiseArray(castValue).promise();
                                    }

                                    if (castValue instanceof Promise) {
                                        ret._propagateFrom(castValue, 2);
                                    }
                                    return ret;
                                }

                                Promise.prototype.props = function () {
                                    return props(this);
                                };

                                Promise.props = function (promises) {
                                    return props(promises);
                                };
                            };
                        }, { "./es5": 13, "./util": 36 }], 26: [function (_dereq_, module, exports) {
                            "use strict";

                            function arrayMove(src, srcIndex, dst, dstIndex, len) {
                                for (var j = 0; j < len; ++j) {
                                    dst[j + dstIndex] = src[j + srcIndex];
                                    src[j + srcIndex] = void 0;
                                }
                            }

                            function Queue(capacity) {
                                this._capacity = capacity;
                                this._length = 0;
                                this._front = 0;
                            }

                            Queue.prototype._willBeOverCapacity = function (size) {
                                return this._capacity < size;
                            };

                            Queue.prototype._pushOne = function (arg) {
                                var length = this.length();
                                this._checkCapacity(length + 1);
                                var i = this._front + length & this._capacity - 1;
                                this[i] = arg;
                                this._length = length + 1;
                            };

                            Queue.prototype._unshiftOne = function (value) {
                                var capacity = this._capacity;
                                this._checkCapacity(this.length() + 1);
                                var front = this._front;
                                var i = (front - 1 & capacity - 1 ^ capacity) - capacity;
                                this[i] = value;
                                this._front = i;
                                this._length = this.length() + 1;
                            };

                            Queue.prototype.unshift = function (fn, receiver, arg) {
                                this._unshiftOne(arg);
                                this._unshiftOne(receiver);
                                this._unshiftOne(fn);
                            };

                            Queue.prototype.push = function (fn, receiver, arg) {
                                var length = this.length() + 3;
                                if (this._willBeOverCapacity(length)) {
                                    this._pushOne(fn);
                                    this._pushOne(receiver);
                                    this._pushOne(arg);
                                    return;
                                }
                                var j = this._front + length - 3;
                                this._checkCapacity(length);
                                var wrapMask = this._capacity - 1;
                                this[j + 0 & wrapMask] = fn;
                                this[j + 1 & wrapMask] = receiver;
                                this[j + 2 & wrapMask] = arg;
                                this._length = length;
                            };

                            Queue.prototype.shift = function () {
                                var front = this._front,
                                    ret = this[front];

                                this[front] = undefined;
                                this._front = front + 1 & this._capacity - 1;
                                this._length--;
                                return ret;
                            };

                            Queue.prototype.length = function () {
                                return this._length;
                            };

                            Queue.prototype._checkCapacity = function (size) {
                                if (this._capacity < size) {
                                    this._resizeTo(this._capacity << 1);
                                }
                            };

                            Queue.prototype._resizeTo = function (capacity) {
                                var oldCapacity = this._capacity;
                                this._capacity = capacity;
                                var front = this._front;
                                var length = this._length;
                                var moveItemsCount = front + length & oldCapacity - 1;
                                arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                            };

                            module.exports = Queue;
                        }, {}], 27: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                                var util = _dereq_("./util");

                                var raceLater = function raceLater(promise) {
                                    return promise.then(function (array) {
                                        return race(array, promise);
                                    });
                                };

                                function race(promises, parent) {
                                    var maybePromise = tryConvertToPromise(promises);

                                    if (maybePromise instanceof Promise) {
                                        return raceLater(maybePromise);
                                    } else {
                                        promises = util.asArray(promises);
                                        if (promises === null) return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
                                    }

                                    var ret = new Promise(INTERNAL);
                                    if (parent !== undefined) {
                                        ret._propagateFrom(parent, 3);
                                    }
                                    var fulfill = ret._fulfill;
                                    var reject = ret._reject;
                                    for (var i = 0, len = promises.length; i < len; ++i) {
                                        var val = promises[i];

                                        if (val === undefined && !(i in promises)) {
                                            continue;
                                        }

                                        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
                                    }
                                    return ret;
                                }

                                Promise.race = function (promises) {
                                    return race(promises, undefined);
                                };

                                Promise.prototype.race = function () {
                                    return race(this, undefined);
                                };
                            };
                        }, { "./util": 36 }], 28: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                                var getDomain = Promise._getDomain;
                                var util = _dereq_("./util");
                                var tryCatch = util.tryCatch;

                                function ReductionPromiseArray(promises, fn, initialValue, _each) {
                                    this.constructor$(promises);
                                    var domain = getDomain();
                                    this._fn = domain === null ? fn : domain.bind(fn);
                                    if (initialValue !== undefined) {
                                        initialValue = Promise.resolve(initialValue);
                                        initialValue._attachCancellationCallback(this);
                                    }
                                    this._initialValue = initialValue;
                                    this._currentCancellable = null;
                                    this._eachValues = _each === INTERNAL ? [] : undefined;
                                    this._promise._captureStackTrace();
                                    this._init$(undefined, -5);
                                }
                                util.inherits(ReductionPromiseArray, PromiseArray);

                                ReductionPromiseArray.prototype._gotAccum = function (accum) {
                                    if (this._eachValues !== undefined && accum !== INTERNAL) {
                                        this._eachValues.push(accum);
                                    }
                                };

                                ReductionPromiseArray.prototype._eachComplete = function (value) {
                                    this._eachValues.push(value);
                                    return this._eachValues;
                                };

                                ReductionPromiseArray.prototype._init = function () {};

                                ReductionPromiseArray.prototype._resolveEmptyArray = function () {
                                    this._resolve(this._eachValues !== undefined ? this._eachValues : this._initialValue);
                                };

                                ReductionPromiseArray.prototype.shouldCopyValues = function () {
                                    return false;
                                };

                                ReductionPromiseArray.prototype._resolve = function (value) {
                                    this._promise._resolveCallback(value);
                                    this._values = null;
                                };

                                ReductionPromiseArray.prototype._resultCancelled = function (sender) {
                                    if (sender === this._initialValue) return this._cancel();
                                    if (this._isResolved()) return;
                                    this._resultCancelled$();
                                    if (this._currentCancellable instanceof Promise) {
                                        this._currentCancellable.cancel();
                                    }
                                    if (this._initialValue instanceof Promise) {
                                        this._initialValue.cancel();
                                    }
                                };

                                ReductionPromiseArray.prototype._iterate = function (values) {
                                    this._values = values;
                                    var value;
                                    var i;
                                    var length = values.length;
                                    if (this._initialValue !== undefined) {
                                        value = this._initialValue;
                                        i = 0;
                                    } else {
                                        value = Promise.resolve(values[0]);
                                        i = 1;
                                    }

                                    this._currentCancellable = value;

                                    if (!value.isRejected()) {
                                        for (; i < length; ++i) {
                                            var ctx = {
                                                accum: null,
                                                value: values[i],
                                                index: i,
                                                length: length,
                                                array: this
                                            };
                                            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
                                        }
                                    }

                                    if (this._eachValues !== undefined) {
                                        value = value._then(this._eachComplete, undefined, undefined, this, undefined);
                                    }
                                    value._then(completed, completed, undefined, value, this);
                                };

                                Promise.prototype.reduce = function (fn, initialValue) {
                                    return reduce(this, fn, initialValue, null);
                                };

                                Promise.reduce = function (promises, fn, initialValue, _each) {
                                    return reduce(promises, fn, initialValue, _each);
                                };

                                function completed(valueOrReason, array) {
                                    if (this.isFulfilled()) {
                                        array._resolve(valueOrReason);
                                    } else {
                                        array._reject(valueOrReason);
                                    }
                                }

                                function reduce(promises, fn, initialValue, _each) {
                                    if (typeof fn !== "function") {
                                        return apiRejection("expecting a function but got " + util.classString(fn));
                                    }
                                    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
                                    return array.promise();
                                }

                                function gotAccum(accum) {
                                    this.accum = accum;
                                    this.array._gotAccum(accum);
                                    var value = tryConvertToPromise(this.value, this.array._promise);
                                    if (value instanceof Promise) {
                                        this.array._currentCancellable = value;
                                        return value._then(gotValue, undefined, undefined, this, undefined);
                                    } else {
                                        return gotValue.call(this, value);
                                    }
                                }

                                function gotValue(value) {
                                    var array = this.array;
                                    var promise = array._promise;
                                    var fn = tryCatch(array._fn);
                                    promise._pushContext();
                                    var ret;
                                    if (array._eachValues !== undefined) {
                                        ret = fn.call(promise._boundValue(), value, this.index, this.length);
                                    } else {
                                        ret = fn.call(promise._boundValue(), this.accum, value, this.index, this.length);
                                    }
                                    if (ret instanceof Promise) {
                                        array._currentCancellable = ret;
                                    }
                                    var promiseCreated = promise._popContext();
                                    debug.checkForgottenReturns(ret, promiseCreated, array._eachValues !== undefined ? "Promise.each" : "Promise.reduce", promise);
                                    return ret;
                                }
                            };
                        }, { "./util": 36 }], 29: [function (_dereq_, module, exports) {
                            "use strict";

                            var util = _dereq_("./util");
                            var schedule;
                            var noAsyncScheduler = function noAsyncScheduler() {
                                throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                            };
                            if (util.isNode && typeof MutationObserver === "undefined") {
                                var GlobalSetImmediate = global.setImmediate;
                                var ProcessNextTick = process.nextTick;
                                schedule = util.isRecentNode ? function (fn) {
                                    GlobalSetImmediate.call(global, fn);
                                } : function (fn) {
                                    ProcessNextTick.call(process, fn);
                                };
                            } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && window.navigator.standalone)) {
                                schedule = function () {
                                    var div = document.createElement("div");
                                    var opts = { attributes: true };
                                    var toggleScheduled = false;
                                    var div2 = document.createElement("div");
                                    var o2 = new MutationObserver(function () {
                                        div.classList.toggle("foo");
                                        toggleScheduled = false;
                                    });
                                    o2.observe(div2, opts);

                                    var scheduleToggle = function scheduleToggle() {
                                        if (toggleScheduled) return;
                                        toggleScheduled = true;
                                        div2.classList.toggle("foo");
                                    };

                                    return function schedule(fn) {
                                        var o = new MutationObserver(function () {
                                            o.disconnect();
                                            fn();
                                        });
                                        o.observe(div, opts);
                                        scheduleToggle();
                                    };
                                }();
                            } else if (typeof setImmediate !== "undefined") {
                                schedule = function schedule(fn) {
                                    setImmediate(fn);
                                };
                            } else if (typeof setTimeout !== "undefined") {
                                schedule = function schedule(fn) {
                                    setTimeout(fn, 0);
                                };
                            } else {
                                schedule = noAsyncScheduler;
                            }
                            module.exports = schedule;
                        }, { "./util": 36 }], 30: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, debug) {
                                var PromiseInspection = Promise.PromiseInspection;
                                var util = _dereq_("./util");

                                function SettledPromiseArray(values) {
                                    this.constructor$(values);
                                }
                                util.inherits(SettledPromiseArray, PromiseArray);

                                SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
                                    this._values[index] = inspection;
                                    var totalResolved = ++this._totalResolved;
                                    if (totalResolved >= this._length) {
                                        this._resolve(this._values);
                                        return true;
                                    }
                                    return false;
                                };

                                SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                    var ret = new PromiseInspection();
                                    ret._bitField = 33554432;
                                    ret._settledValueField = value;
                                    return this._promiseResolved(index, ret);
                                };
                                SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
                                    var ret = new PromiseInspection();
                                    ret._bitField = 16777216;
                                    ret._settledValueField = reason;
                                    return this._promiseResolved(index, ret);
                                };

                                Promise.settle = function (promises) {
                                    debug.deprecated(".settle()", ".reflect()");
                                    return new SettledPromiseArray(promises).promise();
                                };

                                Promise.prototype.settle = function () {
                                    return Promise.settle(this);
                                };
                            };
                        }, { "./util": 36 }], 31: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, PromiseArray, apiRejection) {
                                var util = _dereq_("./util");
                                var RangeError = _dereq_("./errors").RangeError;
                                var AggregateError = _dereq_("./errors").AggregateError;
                                var isArray = util.isArray;
                                var CANCELLATION = {};

                                function SomePromiseArray(values) {
                                    this.constructor$(values);
                                    this._howMany = 0;
                                    this._unwrap = false;
                                    this._initialized = false;
                                }
                                util.inherits(SomePromiseArray, PromiseArray);

                                SomePromiseArray.prototype._init = function () {
                                    if (!this._initialized) {
                                        return;
                                    }
                                    if (this._howMany === 0) {
                                        this._resolve([]);
                                        return;
                                    }
                                    this._init$(undefined, -5);
                                    var isArrayResolved = isArray(this._values);
                                    if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
                                        this._reject(this._getRangeError(this.length()));
                                    }
                                };

                                SomePromiseArray.prototype.init = function () {
                                    this._initialized = true;
                                    this._init();
                                };

                                SomePromiseArray.prototype.setUnwrap = function () {
                                    this._unwrap = true;
                                };

                                SomePromiseArray.prototype.howMany = function () {
                                    return this._howMany;
                                };

                                SomePromiseArray.prototype.setHowMany = function (count) {
                                    this._howMany = count;
                                };

                                SomePromiseArray.prototype._promiseFulfilled = function (value) {
                                    this._addFulfilled(value);
                                    if (this._fulfilled() === this.howMany()) {
                                        this._values.length = this.howMany();
                                        if (this.howMany() === 1 && this._unwrap) {
                                            this._resolve(this._values[0]);
                                        } else {
                                            this._resolve(this._values);
                                        }
                                        return true;
                                    }
                                    return false;
                                };
                                SomePromiseArray.prototype._promiseRejected = function (reason) {
                                    this._addRejected(reason);
                                    return this._checkOutcome();
                                };

                                SomePromiseArray.prototype._promiseCancelled = function () {
                                    if (this._values instanceof Promise || this._values == null) {
                                        return this._cancel();
                                    }
                                    this._addRejected(CANCELLATION);
                                    return this._checkOutcome();
                                };

                                SomePromiseArray.prototype._checkOutcome = function () {
                                    if (this.howMany() > this._canPossiblyFulfill()) {
                                        var e = new AggregateError();
                                        for (var i = this.length(); i < this._values.length; ++i) {
                                            if (this._values[i] !== CANCELLATION) {
                                                e.push(this._values[i]);
                                            }
                                        }
                                        if (e.length > 0) {
                                            this._reject(e);
                                        } else {
                                            this._cancel();
                                        }
                                        return true;
                                    }
                                    return false;
                                };

                                SomePromiseArray.prototype._fulfilled = function () {
                                    return this._totalResolved;
                                };

                                SomePromiseArray.prototype._rejected = function () {
                                    return this._values.length - this.length();
                                };

                                SomePromiseArray.prototype._addRejected = function (reason) {
                                    this._values.push(reason);
                                };

                                SomePromiseArray.prototype._addFulfilled = function (value) {
                                    this._values[this._totalResolved++] = value;
                                };

                                SomePromiseArray.prototype._canPossiblyFulfill = function () {
                                    return this.length() - this._rejected();
                                };

                                SomePromiseArray.prototype._getRangeError = function (count) {
                                    var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
                                    return new RangeError(message);
                                };

                                SomePromiseArray.prototype._resolveEmptyArray = function () {
                                    this._reject(this._getRangeError(0));
                                };

                                function some(promises, howMany) {
                                    if ((howMany | 0) !== howMany || howMany < 0) {
                                        return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    var ret = new SomePromiseArray(promises);
                                    var promise = ret.promise();
                                    ret.setHowMany(howMany);
                                    ret.init();
                                    return promise;
                                }

                                Promise.some = function (promises, howMany) {
                                    return some(promises, howMany);
                                };

                                Promise.prototype.some = function (howMany) {
                                    return some(this, howMany);
                                };

                                Promise._SomePromiseArray = SomePromiseArray;
                            };
                        }, { "./errors": 12, "./util": 36 }], 32: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise) {
                                function PromiseInspection(promise) {
                                    if (promise !== undefined) {
                                        promise = promise._target();
                                        this._bitField = promise._bitField;
                                        this._settledValueField = promise._isFateSealed() ? promise._settledValue() : undefined;
                                    } else {
                                        this._bitField = 0;
                                        this._settledValueField = undefined;
                                    }
                                }

                                PromiseInspection.prototype._settledValue = function () {
                                    return this._settledValueField;
                                };

                                var value = PromiseInspection.prototype.value = function () {
                                    if (!this.isFulfilled()) {
                                        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    return this._settledValue();
                                };

                                var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function () {
                                    if (!this.isRejected()) {
                                        throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    return this._settledValue();
                                };

                                var isFulfilled = PromiseInspection.prototype.isFulfilled = function () {
                                    return (this._bitField & 33554432) !== 0;
                                };

                                var isRejected = PromiseInspection.prototype.isRejected = function () {
                                    return (this._bitField & 16777216) !== 0;
                                };

                                var isPending = PromiseInspection.prototype.isPending = function () {
                                    return (this._bitField & 50397184) === 0;
                                };

                                var isResolved = PromiseInspection.prototype.isResolved = function () {
                                    return (this._bitField & 50331648) !== 0;
                                };

                                PromiseInspection.prototype.isCancelled = Promise.prototype._isCancelled = function () {
                                    return (this._bitField & 65536) === 65536;
                                };

                                Promise.prototype.isCancelled = function () {
                                    return this._target()._isCancelled();
                                };

                                Promise.prototype.isPending = function () {
                                    return isPending.call(this._target());
                                };

                                Promise.prototype.isRejected = function () {
                                    return isRejected.call(this._target());
                                };

                                Promise.prototype.isFulfilled = function () {
                                    return isFulfilled.call(this._target());
                                };

                                Promise.prototype.isResolved = function () {
                                    return isResolved.call(this._target());
                                };

                                Promise.prototype.value = function () {
                                    return value.call(this._target());
                                };

                                Promise.prototype.reason = function () {
                                    var target = this._target();
                                    target._unsetRejectionIsUnhandled();
                                    return reason.call(target);
                                };

                                Promise.prototype._value = function () {
                                    return this._settledValue();
                                };

                                Promise.prototype._reason = function () {
                                    this._unsetRejectionIsUnhandled();
                                    return this._settledValue();
                                };

                                Promise.PromiseInspection = PromiseInspection;
                            };
                        }, {}], 33: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL) {
                                var util = _dereq_("./util");
                                var errorObj = util.errorObj;
                                var isObject = util.isObject;

                                function tryConvertToPromise(obj, context) {
                                    if (isObject(obj)) {
                                        if (obj instanceof Promise) return obj;
                                        var then = getThen(obj);
                                        if (then === errorObj) {
                                            if (context) context._pushContext();
                                            var ret = Promise.reject(then.e);
                                            if (context) context._popContext();
                                            return ret;
                                        } else if (typeof then === "function") {
                                            if (isAnyBluebirdPromise(obj)) {
                                                var ret = new Promise(INTERNAL);
                                                obj._then(ret._fulfill, ret._reject, undefined, ret, null);
                                                return ret;
                                            }
                                            return doThenable(obj, then, context);
                                        }
                                    }
                                    return obj;
                                }

                                function doGetThen(obj) {
                                    return obj.then;
                                }

                                function getThen(obj) {
                                    try {
                                        return doGetThen(obj);
                                    } catch (e) {
                                        errorObj.e = e;
                                        return errorObj;
                                    }
                                }

                                var hasProp = {}.hasOwnProperty;
                                function isAnyBluebirdPromise(obj) {
                                    return hasProp.call(obj, "_promise0");
                                }

                                function doThenable(x, then, context) {
                                    var promise = new Promise(INTERNAL);
                                    var ret = promise;
                                    if (context) context._pushContext();
                                    promise._captureStackTrace();
                                    if (context) context._popContext();
                                    var synchronous = true;
                                    var result = util.tryCatch(then).call(x, resolve, reject);
                                    synchronous = false;

                                    if (promise && result === errorObj) {
                                        promise._rejectCallback(result.e, true, true);
                                        promise = null;
                                    }

                                    function resolve(value) {
                                        if (!promise) return;
                                        promise._resolveCallback(value);
                                        promise = null;
                                    }

                                    function reject(reason) {
                                        if (!promise) return;
                                        promise._rejectCallback(reason, synchronous, true);
                                        promise = null;
                                    }
                                    return ret;
                                }

                                return tryConvertToPromise;
                            };
                        }, { "./util": 36 }], 34: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, INTERNAL, debug) {
                                var util = _dereq_("./util");
                                var TimeoutError = Promise.TimeoutError;

                                function HandleWrapper(handle) {
                                    this.handle = handle;
                                }

                                HandleWrapper.prototype._resultCancelled = function () {
                                    clearTimeout(this.handle);
                                };

                                var afterValue = function afterValue(value) {
                                    return delay(+this).thenReturn(value);
                                };
                                var delay = Promise.delay = function (ms, value) {
                                    var ret;
                                    var handle;
                                    if (value !== undefined) {
                                        ret = Promise.resolve(value)._then(afterValue, null, null, ms, undefined);
                                        if (debug.cancellation() && value instanceof Promise) {
                                            ret._setOnCancel(value);
                                        }
                                    } else {
                                        ret = new Promise(INTERNAL);
                                        handle = setTimeout(function () {
                                            ret._fulfill();
                                        }, +ms);
                                        if (debug.cancellation()) {
                                            ret._setOnCancel(new HandleWrapper(handle));
                                        }
                                    }
                                    ret._setAsyncGuaranteed();
                                    return ret;
                                };

                                Promise.prototype.delay = function (ms) {
                                    return delay(ms, this);
                                };

                                var afterTimeout = function afterTimeout(promise, message, parent) {
                                    var err;
                                    if (typeof message !== "string") {
                                        if (message instanceof Error) {
                                            err = message;
                                        } else {
                                            err = new TimeoutError("operation timed out");
                                        }
                                    } else {
                                        err = new TimeoutError(message);
                                    }
                                    util.markAsOriginatingFromRejection(err);
                                    promise._attachExtraTrace(err);
                                    promise._reject(err);

                                    if (parent != null) {
                                        parent.cancel();
                                    }
                                };

                                function successClear(value) {
                                    clearTimeout(this.handle);
                                    return value;
                                }

                                function failureClear(reason) {
                                    clearTimeout(this.handle);
                                    throw reason;
                                }

                                Promise.prototype.timeout = function (ms, message) {
                                    ms = +ms;
                                    var ret, parent;

                                    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
                                        if (ret.isPending()) {
                                            afterTimeout(ret, message, parent);
                                        }
                                    }, ms));

                                    if (debug.cancellation()) {
                                        parent = this.then();
                                        ret = parent._then(successClear, failureClear, undefined, handleWrapper, undefined);
                                        ret._setOnCancel(handleWrapper);
                                    } else {
                                        ret = this._then(successClear, failureClear, undefined, handleWrapper, undefined);
                                    }

                                    return ret;
                                };
                            };
                        }, { "./util": 36 }], 35: [function (_dereq_, module, exports) {
                            "use strict";

                            module.exports = function (Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
                                var util = _dereq_("./util");
                                var TypeError = _dereq_("./errors").TypeError;
                                var inherits = _dereq_("./util").inherits;
                                var errorObj = util.errorObj;
                                var tryCatch = util.tryCatch;

                                function thrower(e) {
                                    setTimeout(function () {
                                        throw e;
                                    }, 0);
                                }

                                function castPreservingDisposable(thenable) {
                                    var maybePromise = tryConvertToPromise(thenable);
                                    if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
                                        maybePromise._setDisposable(thenable._getDisposer());
                                    }
                                    return maybePromise;
                                }
                                function dispose(resources, inspection) {
                                    var i = 0;
                                    var len = resources.length;
                                    var ret = new Promise(INTERNAL);
                                    function iterator() {
                                        if (i >= len) return ret._fulfill();
                                        var maybePromise = castPreservingDisposable(resources[i++]);
                                        if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
                                            try {
                                                maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
                                            } catch (e) {
                                                return thrower(e);
                                            }
                                            if (maybePromise instanceof Promise) {
                                                return maybePromise._then(iterator, thrower, null, null, null);
                                            }
                                        }
                                        iterator();
                                    }
                                    iterator();
                                    return ret;
                                }

                                function Disposer(data, promise, context) {
                                    this._data = data;
                                    this._promise = promise;
                                    this._context = context;
                                }

                                Disposer.prototype.data = function () {
                                    return this._data;
                                };

                                Disposer.prototype.promise = function () {
                                    return this._promise;
                                };

                                Disposer.prototype.resource = function () {
                                    if (this.promise().isFulfilled()) {
                                        return this.promise().value();
                                    }
                                    return null;
                                };

                                Disposer.prototype.tryDispose = function (inspection) {
                                    var resource = this.resource();
                                    var context = this._context;
                                    if (context !== undefined) context._pushContext();
                                    var ret = resource !== null ? this.doDispose(resource, inspection) : null;
                                    if (context !== undefined) context._popContext();
                                    this._promise._unsetDisposable();
                                    this._data = null;
                                    return ret;
                                };

                                Disposer.isDisposer = function (d) {
                                    return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
                                };

                                function FunctionDisposer(fn, promise, context) {
                                    this.constructor$(fn, promise, context);
                                }
                                inherits(FunctionDisposer, Disposer);

                                FunctionDisposer.prototype.doDispose = function (resource, inspection) {
                                    var fn = this.data();
                                    return fn.call(resource, resource, inspection);
                                };

                                function maybeUnwrapDisposer(value) {
                                    if (Disposer.isDisposer(value)) {
                                        this.resources[this.index]._setDisposable(value);
                                        return value.promise();
                                    }
                                    return value;
                                }

                                function ResourceList(length) {
                                    this.length = length;
                                    this.promise = null;
                                    this[length - 1] = null;
                                }

                                ResourceList.prototype._resultCancelled = function () {
                                    var len = this.length;
                                    for (var i = 0; i < len; ++i) {
                                        var item = this[i];
                                        if (item instanceof Promise) {
                                            item.cancel();
                                        }
                                    }
                                };

                                Promise.using = function () {
                                    var len = arguments.length;
                                    if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
                                    var fn = arguments[len - 1];
                                    if (typeof fn !== "function") {
                                        return apiRejection("expecting a function but got " + util.classString(fn));
                                    }
                                    var input;
                                    var spreadArgs = true;
                                    if (len === 2 && Array.isArray(arguments[0])) {
                                        input = arguments[0];
                                        len = input.length;
                                        spreadArgs = false;
                                    } else {
                                        input = arguments;
                                        len--;
                                    }
                                    var resources = new ResourceList(len);
                                    for (var i = 0; i < len; ++i) {
                                        var resource = input[i];
                                        if (Disposer.isDisposer(resource)) {
                                            var disposer = resource;
                                            resource = resource.promise();
                                            resource._setDisposable(disposer);
                                        } else {
                                            var maybePromise = tryConvertToPromise(resource);
                                            if (maybePromise instanceof Promise) {
                                                resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                                                    resources: resources,
                                                    index: i
                                                }, undefined);
                                            }
                                        }
                                        resources[i] = resource;
                                    }

                                    var reflectedResources = new Array(resources.length);
                                    for (var i = 0; i < reflectedResources.length; ++i) {
                                        reflectedResources[i] = Promise.resolve(resources[i]).reflect();
                                    }

                                    var resultPromise = Promise.all(reflectedResources).then(function (inspections) {
                                        for (var i = 0; i < inspections.length; ++i) {
                                            var inspection = inspections[i];
                                            if (inspection.isRejected()) {
                                                errorObj.e = inspection.error();
                                                return errorObj;
                                            } else if (!inspection.isFulfilled()) {
                                                resultPromise.cancel();
                                                return;
                                            }
                                            inspections[i] = inspection.value();
                                        }
                                        promise._pushContext();

                                        fn = tryCatch(fn);
                                        var ret = spreadArgs ? fn.apply(undefined, inspections) : fn(inspections);
                                        var promiseCreated = promise._popContext();
                                        debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise);
                                        return ret;
                                    });

                                    var promise = resultPromise.lastly(function () {
                                        var inspection = new Promise.PromiseInspection(resultPromise);
                                        return dispose(resources, inspection);
                                    });
                                    resources.promise = promise;
                                    promise._setOnCancel(resources);
                                    return promise;
                                };

                                Promise.prototype._setDisposable = function (disposer) {
                                    this._bitField = this._bitField | 131072;
                                    this._disposer = disposer;
                                };

                                Promise.prototype._isDisposable = function () {
                                    return (this._bitField & 131072) > 0;
                                };

                                Promise.prototype._getDisposer = function () {
                                    return this._disposer;
                                };

                                Promise.prototype._unsetDisposable = function () {
                                    this._bitField = this._bitField & ~131072;
                                    this._disposer = undefined;
                                };

                                Promise.prototype.disposer = function (fn) {
                                    if (typeof fn === "function") {
                                        return new FunctionDisposer(fn, this, createContext());
                                    }
                                    throw new TypeError();
                                };
                            };
                        }, { "./errors": 12, "./util": 36 }], 36: [function (_dereq_, module, exports) {
                            "use strict";

                            var es5 = _dereq_("./es5");
                            var canEvaluate = typeof navigator == "undefined";

                            var errorObj = { e: {} };
                            var tryCatchTarget;
                            var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this !== undefined ? this : null;

                            function tryCatcher() {
                                try {
                                    var target = tryCatchTarget;
                                    tryCatchTarget = null;
                                    return target.apply(this, arguments);
                                } catch (e) {
                                    errorObj.e = e;
                                    return errorObj;
                                }
                            }
                            function tryCatch(fn) {
                                tryCatchTarget = fn;
                                return tryCatcher;
                            }

                            var inherits = function inherits(Child, Parent) {
                                var hasProp = {}.hasOwnProperty;

                                function T() {
                                    this.constructor = Child;
                                    this.constructor$ = Parent;
                                    for (var propertyName in Parent.prototype) {
                                        if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
                                            this[propertyName + "$"] = Parent.prototype[propertyName];
                                        }
                                    }
                                }
                                T.prototype = Parent.prototype;
                                Child.prototype = new T();
                                return Child.prototype;
                            };

                            function isPrimitive(val) {
                                return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
                            }

                            function isObject(value) {
                                return typeof value === "function" || (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null;
                            }

                            function maybeWrapAsError(maybeError) {
                                if (!isPrimitive(maybeError)) return maybeError;

                                return new Error(safeToString(maybeError));
                            }

                            function withAppended(target, appendee) {
                                var len = target.length;
                                var ret = new Array(len + 1);
                                var i;
                                for (i = 0; i < len; ++i) {
                                    ret[i] = target[i];
                                }
                                ret[i] = appendee;
                                return ret;
                            }

                            function getDataPropertyOrDefault(obj, key, defaultValue) {
                                if (es5.isES5) {
                                    var desc = Object.getOwnPropertyDescriptor(obj, key);

                                    if (desc != null) {
                                        return desc.get == null && desc.set == null ? desc.value : defaultValue;
                                    }
                                } else {
                                    return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                                }
                            }

                            function notEnumerableProp(obj, name, value) {
                                if (isPrimitive(obj)) return obj;
                                var descriptor = {
                                    value: value,
                                    configurable: true,
                                    enumerable: false,
                                    writable: true
                                };
                                es5.defineProperty(obj, name, descriptor);
                                return obj;
                            }

                            function thrower(r) {
                                throw r;
                            }

                            var inheritedDataKeys = function () {
                                var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

                                var isExcludedProto = function isExcludedProto(val) {
                                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                                        if (excludedPrototypes[i] === val) {
                                            return true;
                                        }
                                    }
                                    return false;
                                };

                                if (es5.isES5) {
                                    var getKeys = Object.getOwnPropertyNames;
                                    return function (obj) {
                                        var ret = [];
                                        var visitedKeys = Object.create(null);
                                        while (obj != null && !isExcludedProto(obj)) {
                                            var keys;
                                            try {
                                                keys = getKeys(obj);
                                            } catch (e) {
                                                return ret;
                                            }
                                            for (var i = 0; i < keys.length; ++i) {
                                                var key = keys[i];
                                                if (visitedKeys[key]) continue;
                                                visitedKeys[key] = true;
                                                var desc = Object.getOwnPropertyDescriptor(obj, key);
                                                if (desc != null && desc.get == null && desc.set == null) {
                                                    ret.push(key);
                                                }
                                            }
                                            obj = es5.getPrototypeOf(obj);
                                        }
                                        return ret;
                                    };
                                } else {
                                    var hasProp = {}.hasOwnProperty;
                                    return function (obj) {
                                        if (isExcludedProto(obj)) return [];
                                        var ret = [];

                                        /*jshint forin:false */
                                        enumeration: for (var key in obj) {
                                            if (hasProp.call(obj, key)) {
                                                ret.push(key);
                                            } else {
                                                for (var i = 0; i < excludedPrototypes.length; ++i) {
                                                    if (hasProp.call(excludedPrototypes[i], key)) {
                                                        continue enumeration;
                                                    }
                                                }
                                                ret.push(key);
                                            }
                                        }
                                        return ret;
                                    };
                                }
                            }();

                            var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
                            function isClass(fn) {
                                try {
                                    if (typeof fn === "function") {
                                        var keys = es5.names(fn.prototype);

                                        var hasMethods = es5.isES5 && keys.length > 1;
                                        var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
                                        var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

                                        if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
                                            return true;
                                        }
                                    }
                                    return false;
                                } catch (e) {
                                    return false;
                                }
                            }

                            function toFastProperties(obj) {
                                /*jshint -W027,-W055,-W031*/
                                function FakeConstructor() {}
                                FakeConstructor.prototype = obj;
                                var l = 8;
                                while (l--) {
                                    new FakeConstructor();
                                }return obj;
                                eval(obj);
                            }

                            var rident = /^[a-z$_][a-z$_0-9]*$/i;
                            function isIdentifier(str) {
                                return rident.test(str);
                            }

                            function filledRange(count, prefix, suffix) {
                                var ret = new Array(count);
                                for (var i = 0; i < count; ++i) {
                                    ret[i] = prefix + i + suffix;
                                }
                                return ret;
                            }

                            function safeToString(obj) {
                                try {
                                    return obj + "";
                                } catch (e) {
                                    return "[no string representation]";
                                }
                            }

                            function isError(obj) {
                                return obj !== null && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof obj.message === "string" && typeof obj.name === "string";
                            }

                            function markAsOriginatingFromRejection(e) {
                                try {
                                    notEnumerableProp(e, "isOperational", true);
                                } catch (ignore) {}
                            }

                            function originatesFromRejection(e) {
                                if (e == null) return false;
                                return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
                            }

                            function canAttachTrace(obj) {
                                return isError(obj) && es5.propertyIsWritable(obj, "stack");
                            }

                            var ensureErrorObject = function () {
                                if (!("stack" in new Error())) {
                                    return function (value) {
                                        if (canAttachTrace(value)) return value;
                                        try {
                                            throw new Error(safeToString(value));
                                        } catch (err) {
                                            return err;
                                        }
                                    };
                                } else {
                                    return function (value) {
                                        if (canAttachTrace(value)) return value;
                                        return new Error(safeToString(value));
                                    };
                                }
                            }();

                            function classString(obj) {
                                return {}.toString.call(obj);
                            }

                            function copyDescriptors(from, to, filter) {
                                var keys = es5.names(from);
                                for (var i = 0; i < keys.length; ++i) {
                                    var key = keys[i];
                                    if (filter(key)) {
                                        try {
                                            es5.defineProperty(to, key, es5.getDescriptor(from, key));
                                        } catch (ignore) {}
                                    }
                                }
                            }

                            var asArray = function asArray(v) {
                                if (es5.isArray(v)) {
                                    return v;
                                }
                                return null;
                            };

                            if (typeof Symbol !== "undefined" && Symbol.iterator) {
                                var ArrayFrom = typeof Array.from === "function" ? function (v) {
                                    return Array.from(v);
                                } : function (v) {
                                    var ret = [];
                                    var it = v[Symbol.iterator]();
                                    var itResult;
                                    while (!(itResult = it.next()).done) {
                                        ret.push(itResult.value);
                                    }
                                    return ret;
                                };

                                asArray = function asArray(v) {
                                    if (es5.isArray(v)) {
                                        return v;
                                    } else if (v != null && typeof v[Symbol.iterator] === "function") {
                                        return ArrayFrom(v);
                                    }
                                    return null;
                                };
                            }

                            var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";

                            function env(key, def) {
                                return isNode ? process.env[key] : def;
                            }

                            var ret = {
                                isClass: isClass,
                                isIdentifier: isIdentifier,
                                inheritedDataKeys: inheritedDataKeys,
                                getDataPropertyOrDefault: getDataPropertyOrDefault,
                                thrower: thrower,
                                isArray: es5.isArray,
                                asArray: asArray,
                                notEnumerableProp: notEnumerableProp,
                                isPrimitive: isPrimitive,
                                isObject: isObject,
                                isError: isError,
                                canEvaluate: canEvaluate,
                                errorObj: errorObj,
                                tryCatch: tryCatch,
                                inherits: inherits,
                                withAppended: withAppended,
                                maybeWrapAsError: maybeWrapAsError,
                                toFastProperties: toFastProperties,
                                filledRange: filledRange,
                                toString: safeToString,
                                canAttachTrace: canAttachTrace,
                                ensureErrorObject: ensureErrorObject,
                                originatesFromRejection: originatesFromRejection,
                                markAsOriginatingFromRejection: markAsOriginatingFromRejection,
                                classString: classString,
                                copyDescriptors: copyDescriptors,
                                hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
                                isNode: isNode,
                                env: env,
                                global: globalObject
                            };
                            ret.isRecentNode = ret.isNode && function () {
                                var version = process.versions.node.split(".").map(Number);
                                return version[0] === 0 && version[1] > 10 || version[0] > 0;
                            }();

                            if (ret.isNode) ret.toFastProperties(process);

                            try {
                                throw new Error();
                            } catch (e) {
                                ret.lastLineError = e;
                            }
                            module.exports = ret;
                        }, { "./es5": 13 }] }, {}, [4])(4);
                });;if (typeof window !== 'undefined' && window !== null) {
                    window.P = window.Promise;
                } else if (typeof self !== 'undefined' && self !== null) {
                    self.P = self.Promise;
                }
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "_process": 2 }], 4: [function (require, module, exports) {
            'use strict';

            //
            // We store our EE objects in a plain object whose properties are event names.
            // If `Object.create(null)` is not supported we prefix the event names with a
            // `~` to make sure that the built-in object properties are not overridden or
            // used as an attack vector.
            // We also assume that `Object.create(null)` is available when the event name
            // is an ES6 Symbol.
            //

            var prefix = typeof Object.create !== 'function' ? '~' : false;

            /**
             * Representation of a single EventEmitter function.
             *
             * @param {Function} fn Event handler to be called.
             * @param {Mixed} context Context for function execution.
             * @param {Boolean} once Only emit once
             * @api private
             */
            function EE(fn, context, once) {
                this.fn = fn;
                this.context = context;
                this.once = once || false;
            }

            /**
             * Minimal EventEmitter interface that is molded against the Node.js
             * EventEmitter interface.
             *
             * @constructor
             * @api public
             */
            function EventEmitter() {} /* Nothing to set */

            /**
             * Holds the assigned EventEmitters by name.
             *
             * @type {Object}
             * @private
             */
            EventEmitter.prototype._events = undefined;

            /**
             * Return a list of assigned event listeners.
             *
             * @param {String} event The events that should be listed.
             * @param {Boolean} exists We only need to know if there are listeners.
             * @returns {Array|Boolean}
             * @api public
             */
            EventEmitter.prototype.listeners = function listeners(event, exists) {
                var evt = prefix ? prefix + event : event,
                    available = this._events && this._events[evt];

                if (exists) return !!available;
                if (!available) return [];
                if (available.fn) return [available.fn];

                for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
                    ee[i] = available[i].fn;
                }

                return ee;
            };

            /**
             * Emit an event to all registered event listeners.
             *
             * @param {String} event The name of the event.
             * @returns {Boolean} Indication if we've emitted an event.
             * @api public
             */
            EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
                var evt = prefix ? prefix + event : event;

                if (!this._events || !this._events[evt]) return false;

                var listeners = this._events[evt],
                    len = arguments.length,
                    args,
                    i;

                if ('function' === typeof listeners.fn) {
                    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

                    switch (len) {
                        case 1:
                            return listeners.fn.call(listeners.context), true;
                        case 2:
                            return listeners.fn.call(listeners.context, a1), true;
                        case 3:
                            return listeners.fn.call(listeners.context, a1, a2), true;
                        case 4:
                            return listeners.fn.call(listeners.context, a1, a2, a3), true;
                        case 5:
                            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                        case 6:
                            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
                    }

                    for (i = 1, args = new Array(len - 1); i < len; i++) {
                        args[i - 1] = arguments[i];
                    }

                    listeners.fn.apply(listeners.context, args);
                } else {
                    var length = listeners.length,
                        j;

                    for (i = 0; i < length; i++) {
                        if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

                        switch (len) {
                            case 1:
                                listeners[i].fn.call(listeners[i].context);break;
                            case 2:
                                listeners[i].fn.call(listeners[i].context, a1);break;
                            case 3:
                                listeners[i].fn.call(listeners[i].context, a1, a2);break;
                            default:
                                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                                    args[j - 1] = arguments[j];
                                }

                                listeners[i].fn.apply(listeners[i].context, args);
                        }
                    }
                }

                return true;
            };

            /**
             * Register a new EventListener for the given event.
             *
             * @param {String} event Name of the event.
             * @param {Functon} fn Callback function.
             * @param {Mixed} context The context of the function.
             * @api public
             */
            EventEmitter.prototype.on = function on(event, fn, context) {
                var listener = new EE(fn, context || this),
                    evt = prefix ? prefix + event : event;

                if (!this._events) this._events = prefix ? {} : Object.create(null);
                if (!this._events[evt]) this._events[evt] = listener;else {
                    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
                }

                return this;
            };

            /**
             * Add an EventListener that's only called once.
             *
             * @param {String} event Name of the event.
             * @param {Function} fn Callback function.
             * @param {Mixed} context The context of the function.
             * @api public
             */
            EventEmitter.prototype.once = function once(event, fn, context) {
                var listener = new EE(fn, context || this, true),
                    evt = prefix ? prefix + event : event;

                if (!this._events) this._events = prefix ? {} : Object.create(null);
                if (!this._events[evt]) this._events[evt] = listener;else {
                    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
                }

                return this;
            };

            /**
             * Remove event listeners.
             *
             * @param {String} event The event we want to remove.
             * @param {Function} fn The listener that we need to find.
             * @param {Mixed} context Only remove listeners matching this context.
             * @param {Boolean} once Only remove once listeners.
             * @api public
             */
            EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
                var evt = prefix ? prefix + event : event;

                if (!this._events || !this._events[evt]) return this;

                var listeners = this._events[evt],
                    events = [];

                if (fn) {
                    if (listeners.fn) {
                        if (listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context) {
                            events.push(listeners);
                        }
                    } else {
                        for (var i = 0, length = listeners.length; i < length; i++) {
                            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                                events.push(listeners[i]);
                            }
                        }
                    }
                }

                //
                // Reset the array, or remove it completely if we have no more listeners.
                //
                if (events.length) {
                    this._events[evt] = events.length === 1 ? events[0] : events;
                } else {
                    delete this._events[evt];
                }

                return this;
            };

            /**
             * Remove all listeners or only the listeners for the specified event.
             *
             * @param {String} event The event want to remove all listeners for.
             * @api public
             */
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
                if (!this._events) return this;

                if (event) delete this._events[prefix ? prefix + event : event];else this._events = prefix ? {} : Object.create(null);

                return this;
            };

            //
            // Alias methods names because people roll like that.
            //
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
            EventEmitter.prototype.addListener = EventEmitter.prototype.on;

            //
            // This function doesn't apply anymore.
            //
            EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
                return this;
            };

            //
            // Expose the prefix.
            //
            EventEmitter.prefixed = prefix;

            //
            // Expose the module.
            //
            if ('undefined' !== typeof module) {
                module.exports = EventEmitter;
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
        }, { "buffer": 1 }], "Web3PromiEvent": [function (require, module, exports) {
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
             * @date 2016
             */

            "use strict";

            var EventEmitter = require('eventemitter3');
            var Promise = require("bluebird");

            /**
             * This function generates a defer promise and adds eventEmitter functionality to it
             *
             * @method eventifiedPromise
             */
            var PromiEvent = function PromiEvent(justPromise) {
                var resolve,
                    reject,
                    eventEmitter = new Promise(function () {
                    resolve = arguments[0];
                    reject = arguments[1];
                });

                if (justPromise) {
                    return {
                        resolve: resolve,
                        reject: reject,
                        eventEmitter: eventEmitter
                    };
                }

                // get eventEmitter
                var emitter = new EventEmitter();

                // add eventEmitter to the promise
                eventEmitter._events = emitter._events;
                eventEmitter.emit = emitter.emit;
                eventEmitter.on = emitter.on;
                eventEmitter.once = emitter.once;
                eventEmitter.off = emitter.off;
                eventEmitter.listeners = emitter.listeners;
                eventEmitter.addListener = emitter.addListener;
                eventEmitter.removeListener = emitter.removeListener;
                eventEmitter.removeAllListeners = emitter.removeAllListeners;

                return {
                    resolve: resolve,
                    reject: reject,
                    eventEmitter: eventEmitter
                };
            };

            PromiEvent.resolve = function (value) {
                var promise = PromiEvent(true);
                promise.resolve(value);
                return promise.eventEmitter;
            };

            module.exports = PromiEvent;
        }, { "bluebird": 3, "eventemitter3": 4 }] }, {}, ["Web3PromiEvent"])("Web3PromiEvent");
});
//# sourceMappingURL=web3-core-promievent.js.map
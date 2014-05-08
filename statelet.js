/**
 * @version 0.4
 * @twitter joshwnj, westonruter, kamilogorek
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.State = factory();
    }
}(this, function () {
    var undefined;

    var nextTick = (function () {
        return (typeof process !== 'undefined' && process.nextTick)
            ? process.nextTick
            : setTimeout;
    }());

    /**
     * Implementation of Array.indexOf which sadly is not available in IE<=8
     */
    var indexOf = Array.prototype.indexOf || function (item) {
        var i;
        var len = this.length;
        for( i = 0; i < len; i += 1 ){
            if( this[i] === item ){
                return i;
            }
        }
        return -1;
    };

    /**
     * Implementation of Array.forEach which is sadly not available in IE<=8
     */
    var forEach = Array.prototype.forEach || function (callback) {
        var i;
        var len = this.length;
        for (i = 0; i < len; i += 1) {
            callback(this[i]);
        }
    };

    var EventEmitter;
    if (typeof exports === 'object') {
        EventEmitter = require('events').EventEmitter;
    }
    else {
        // NOTE: not a true EventEmitter port, but close enough for this module
        EventEmitter = function () {
            this._listeners = [];
        };
        EventEmitter.prototype = {
            emit: function (_, data) {
                forEach.call(this._listeners, function (f) {
                    nextTick(function () {
                        f(data);
                    });
                });
            },

            on: function (_, listener) {
                // ignore duplicates
                var i = indexOf.call(this._listeners, listener);
                if(i >= 0) { return; }

                this._listeners.push(listener);
            },

            removeListener: function (_, listener) {
                var i = indexOf.call(this._listeners, listener);
                var found = (i !== -1);
                if (found) {
                    this._listeners.splice(i, 1);
                }
            }
        };
    }

    // -------------------------------------------------------------------------

    function State (value) {
        this._events = new EventEmitter();
        this._value = value;
    }

    State.prototype = {
        get: function () {
            return this._value;
        },

        set: function (value) {
            // no change: ignore
            if (value === this._value) { return; }

            this._value = value;
            this._events.emit('change', value);
        },

        toString: function(){
            return String(this.get());
        },

        /**
         * Watch for any change in value
         * @param {Function} callback
         * @return {Function} callback
         */
        watch: function (callback) {
            // if there is a value, run the callback immediately
            var value = this._value;
            if (value !== undefined) {
                nextTick(function () {
                    callback(value);
                });
            }

            // register the callback
            this._events.on('change', callback);
            return callback;
        },

        /**
         * Remove function that is watching for a change
         * @param {Function} callback initially added
         * @returns {Boolean} if the callback was removed
         */
        unwatch: function (callback) {
            this._events.removeListener('change', callback);
        },

        /**
         * Watch for a certain value.
         * Returns the watch-callback so you can unwatch at a later stage.
         * @param mixed
         * @param function
         * @return function
         */
        when: function (value, callback) {
            var watcher = function (v) {
                if (v === value) {
                    callback();
                }
            };
            this.watch(watcher);
            return watcher;
        }
    };

    return State;
}));

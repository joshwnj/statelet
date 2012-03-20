/**
 * @version 0.2
 * @twitter joshwnj, westonruter
 */
(function (context) {
    var run = (function () {
        return typeof window !== 'undefined'
            ? setTimeout
            : function (callback) {
                process.nextTick(callback);
            };
    }());

    /**
     * Implementation of array.indexOf which sadly is not available in IE<=8
     */
    var indexOf = (function () {
        // use native indexOf if provided
        return Array.prototype.indexOf
            ? function (array, item) {
                return array.indexOf(item);
            }
            : function(array, item){
                var i, len;
                for( i = 0, len = array.length; i < len; i += 1 ){
                    if( array[i] === item ){
                        return i;
                    }
                }
                return -1;
            };
    }());

    /**
     * Implementation of array.forEach which is sadly not available in IE<=8
     */
    var forEach = (function () {
        // use native forEach if available
        return Array.prototype.forEach
            ? function (array, callback) {
                array.forEach(callback);
            }
            : function (array, callback) {
                var i;
                var len = array.length;
                for (i = 0; i < len; i += 1) {
                    callback(array[i]);
                }
            };
    }());

    function State (value) {
        this._watchers = [];
        this._transition_watchers = [];
        this._value = value;
    }

    State.prototype = {
        get: function () {
            return this._value;
        },

        valueOf: function () {
            return this.get();
        },

        toString: function(){
            return String(this.get());
        },

        set: function (value) {
            // no change: ignore
            if (value === this._value) { return; }

            this._notifyTransitions(this._value, value);
            this._value = value;
            this._notify();
        },

        /**
         * Watch for any change in value
         * @param {Function} callback
         * @return {Function} callback
         * @todo Should we wrap the callback in a setTimeout() to force it to always be asynchronous? Otherwise, we do a setTimeout() some of the time?
         */
        watch: function (callback) {
            // if there is a value, run the callback immediately
            var value = this._value;
            if (typeof value !== 'undefined') {
                run(function () {
                    callback(value);
                });
            }

            // register the callback if it hasn't already been added
            var i = indexOf(this._watchers, callback);
            if(i === -1){
                this._watchers.push(callback);
            }
            return callback;
        },

        /**
         * Execute the callback when the the value is set
         * @param {Function} callback
         * @return {Function} callback
         */
        once: function (callback) {
            var self = this;
            var once_callback;

            once_callback = function(){
                var has_watcher = self.unwatch(once_callback);
                if( has_watcher ){
                    callback.call(null, arguments);
                }
            };

            this.watch(once_callback);
            return once_callback;
        },

        /**
         * Remove function that is watching for a change
         * @param {Function} callback initially added
         * @returns {Boolean} if the callback was removed
         */
        unwatch: function (callback) {
            var i = indexOf(this._watchers, callback);
            var found = (i !== -1);
            if (found) {
                this._watchers.splice(i, 1);
            }
            return found;
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
        },

        /**
         * Watch for a transition from one value to another
         * @param mixed
         * @param mixed
         * @param function
         */
        onTransition: function (from, to, callback) {
            this._transition_watchers.push({
                from: from,
                to: to,
                callback: callback
            });
        },

        // @todo Add offTransition

        /**
         * Notify all watchers
         */
        _notify: function () {
            var value = this._value;
            forEach(this._watchers, function (w) {
                run(function () {
                    w(value);
                });
            });
        },

        /**
         * Notify all watchers
         */
        _notifyTransitions: function (from, to) {
            var value = this._value;
            forEach(this._transition_watchers, function (info) {
                var match_from = (info.from === '*' || info.from === from);
                var match_to = (info.to === '*' || info.to === to);

                if (match_from && match_to) {
                    run(function () { info.callback(from, to); });
                }
            });
        }
    };

    if (typeof context.exports !== 'undefined') {
        context.exports = State;
    }
    else {
        context.State = State;
    }
}(typeof window !== 'undefined' ? window : module));

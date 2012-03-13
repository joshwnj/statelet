/**
 * @version 0.1
 * @twitter joshwnj
 */

function State (value) {
    this._watchers = [];
    this._transition_watchers = [];
    this._value = value;
}

State.prototype = {
    get: function () {
        return this._value;
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
     * @param function
     */
    watch: function (callback) {
        // if there is a value, run the callback immediately
        var value = this._value;
        if (typeof value !== 'undefined') {
            setTimeout(function () { callback(value); }, 0);
        }
        
        this._watchers.push(callback);
    },

    /**
     * Watch for a certain value
     * @param mixed
     * @param function
     */
    when: function (value, callback) {
        this.watch(function (v) {
            if (v === value) { callback(); }
        });
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
    
    /**
     * Notify all watchers
     */
    _notify: function () {
        var value = this._value;
        this._watchers.forEach(function (w) {
            setTimeout(function () { w(value); }, 0);
        });
    },

    /**
     * Notify all watchers
     */
    _notifyTransitions: function (from, to) {
        var value = this._value;
        this._transition_watchers.forEach(function (info) {
            var match_from = (info.from === '*' || info.from === from);
            var match_to = (info.to === '*' || info.to === to);
            
            if (match_from && match_to) {
                setTimeout(function () { info.callback(from, to); }, 0);
            }
        });
    }
};

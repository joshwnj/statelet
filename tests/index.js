var State = require('../states');
var test = require('tap').test;

test('Only notify if state changes', function (t) {
    var s = new State();

    var times = 0;
    s.watch(function (value) {
        times += 1;
        t.ok(times === 1, 'Watcher should only be called once');
    });

    s.set(true);
    s.set(true);

    // @todo We need to verify that the watcher even gets invoked; process.nextTick() is one way

    t.end();
});


test('Ensure once only invokes watcher for single change', function (t) {
    var s = new State();

    var times = 0;
    var watcher = function (value) {
        times += 1;
    };

    s.once(watcher);
    s.set('1st'); // Watcher fires synchronously since s.get() === undefined
    s.set('2nd'); // Watcher fires asynchronously since s.get() !== undefined

    // Note: process.nextTick() is needed here because the State.set() runs asyncrhonously for 2nd
    process.nextTick(function () {
        t.ok(times === 1, 'Watcher should only get invoked once (times = ' + times + ')');
    });

    t.end();
});


test('Ensure unwatch removes watcher', function (t) {
    var s = new State();

    var times = 0;
    var watcher = function (value) {
        times += 1;
    };

    s.watch(watcher);
    s.set('1st');
    s.set('2nd');
    s.unwatch(watcher);
    s.set('3rd');

    process.nextTick(function () {
        t.ok(times === 2, 'Watcher should only be called twice');
    });

    t.end();
});

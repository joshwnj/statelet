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


test('Watchers all fire asynchronously', function (t) {
    var s = new State();

    // Testing adding watcher when State is undefined
    var watcher1_values = [];
    var watcher1 = function (value) {
        watcher1_values.push(value);
    };
    s.watch(watcher1);
    s.set('1st');
    t.equal(watcher1_values.length, 0, 'First watcher should not be called yet (1st)');
    s.set('2nd');
    t.equal(watcher1_values.length, 0, 'First watcher should not be called yet (2nd)');
    s.set('3rd');
    process.nextTick(function () {
        t.deepEqual(
            watcher1_values,
            ['1st', '2nd', '3rd'],
            'First watcher should be called 3 times upon nextTick.');
    });

    // Testing adding watcher when State is not undefined
    var watcher2_values = [];
    var watcher2 = function (value) {
        watcher2_values.push(value);
    };
    // this will cause our watch() callback to be run,
    // as the state already has a value
    s.watch(watcher2);  
    s.set('4th');
    t.equal(watcher2_values.length, 0, 'Second watcher should still not have been called');

    process.nextTick(function () {
        t.deepEqual(
            watcher2_values,
            ['3rd', '4th'],
            'Second watcher should be called 2 times upon nextTick');
    });

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

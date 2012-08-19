var State = require('../statelet');
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

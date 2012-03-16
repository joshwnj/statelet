var State = require('../states');
var test = require('tap').test;

test('Only notify if state changes', function (t) {
    var s = new State();

    var times = 0;
    s.watch(function (value) {
        times += 1;
        t.ok(times === 1, 'Should only be called once');
    });

    s.set(true);
    s.set(true);
    
    t.end();
});
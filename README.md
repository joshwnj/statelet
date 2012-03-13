# States

Instead of this:

    if (SomeObject.is_ready) {
        // ...
    }
    
 Do this:
 
    SomeObject.is_ready.when(true, function () {
        // ....
    });

## Watching State

    var state = new State;

    // notify whenever the value changes
    state.watch(function (value) { ... });

    // notify when the value changes to something specific 
    state.when(value, function () { ... });

    // notify whenever a certain transition occurs
    state.onTransition(from, to, function () { ... });

    // wildcards work for transitions
    state.onTransition('*', to, function (from, to) { ... });
    state.onTransition(from, '*', function (from, to) { ... });
    state.onTransition('*', '*', function (from, to) { ... });

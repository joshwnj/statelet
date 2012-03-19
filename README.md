# States

[![Build Status](https://secure.travis-ci.org/joshwnj/States.png)](http://travis-ci.org/joshwnj/States)

Instead of this:

```js
if (SomeObject.is_ready) {
    // ...
}
```

Do this:

```js
SomeObject.is_ready.when(true, function () {
    // ....
});
```

## Watching State

```js
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
```

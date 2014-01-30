# Statelet

[![Build Status](https://secure.travis-ci.org/joshwnj/statelet.png)](http://travis-ci.org/joshwnj/statelet)

Sometimes we have a pattern like:

```js
if (is_ready) {
  // do the thing
}
else {
  // put into a queue and execute when is_ready=true
}
```

Events make it better:

```js
emitter.on('ready', function () {
  // do the thing
});
```

But what if you start listening too late and you miss the event?  You'll be waiting forever...

`statelet` takes a different approach where instead of listening for events we're watching for changes in state:

```js
is_ready.when(true, function () {
  // do the thing
});
```

## Combining States

Sometimes you want to know when multiple states align in a certain way.

```js
var State = require('statelet');

var is_happy = new State();
var knows_it = new State();
var action = new State();

function onChange () {
  var youre_happy = is_happy.get();
  var you_know_it = knows_it.get();

  if (youre_happy && you_know_it) {
    action.set('clap your hands');
  }
}
is_happy.watch(onChange);
knows_it.watch(onChange);
```

## Where can I use it?

Works in both node.js and browser.
You can use it as either AMD or CommonJS style module.

## Install

```
npm install statelet
```

## To do

 * make sure examples have decent cross-browser support
 * more examples

## License

MIT

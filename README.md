# Statelet

[![Build Status](https://secure.travis-ci.org/joshwnj/statelet.png)](http://travis-ci.org/joshwnj/statelet)

Instead of this:

```js
if (is_ready) {
   // do the thing
}
else {
   // put into a queue and execute when is_ready=true
}
```

Do this:

```js
is_ready.when(true, function () {
  // do the thing
});
```

## Logic Gates

```js
var burger = new State();
var fries = new State();
var meal_is_ready = new State();

function onMealChange () {
    var burger_ready = burger.get() === 'flipped';
    var fries_ready = fries.get() === 'fried';
    meal_is_ready.set(burger_ready && fries_ready);
}
burger.watch(onMealChange);
fries.watch(onMealChange);
meal_is_ready.when(true, function () {
    console.log('ding ding!');
});
```

## To do

 * make sure examples have decent cross-browser support
 * more examples


## Install

```
npm install statelet
```

## License

MIT

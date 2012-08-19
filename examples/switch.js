/*global State, $*/
var is_on = new State(false);
var button = $('#switch');
var text_elm = $('#text .value');

is_on.watch(function (value) {
    text_elm.text(value ? 'on' : 'off');
    button.toggleClass('is_on', value);
});

button.on('click', function () {
    is_on.set(!is_on.get());
});


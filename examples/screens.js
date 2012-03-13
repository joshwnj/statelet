function Screen (name, elm) {
    this.name = name;
    this._elm = elm;
    this.state = new State;
}

Screen.prototype = {
    getElm: function () {
        return this._elm;
    }
};

// ----

var screens = {};

// create screens
['a', 'b'].forEach(function (name) {
    var elm = $('#screens .screen-' + name);
    screens[name] = createScreen(name, elm);
});

function createScreen (name, elm) {
    var screen = new Screen(name, elm);

    // set a class of the current state
    screen.state.onTransition('*', '*', function (from, to) {
        if (from) { elm.removeClass('state-' + from); }
        elm.addClass('state-' + to);
    });

    return screen;
}

// ----
// store the current screen id as a state, so we can transition between them

var screen_id = new State;
screen_id.onTransition('*', '*', function (from, to) {
    // first screen: show immediately
    if (from === undefined) {
        screens[to].getElm().addClass('active');
        return;
    }

    // crossfade
    fadeOut(from);
    fadeIn(to);
});

function fadeIn (name) {
    var elm = screens[name].getElm();
    elm.css({ opacity: 0 });
    elm.addClass('active');
    elm.animate({ opacity: 1 });
}

function fadeOut (name) {
    var elm = screens[name].getElm();
    elm.animate({
        opacity: 0
    }, {
        complete: function () {
            elm.removeClass('active');
        }
    });
}

// ----
// create some buttons to switch between screens

var buttons = $('#buttons');
$.each(screens, function (name, screen) {
    var b = $('<button/>');
    b.attr({ name: name });
    b.text('Screen ' + name);

    buttons.append(b);
});

buttons.delegate('button', 'click', function (event) {
    event.preventDefault();
    var b = $(this);
    var name = b.attr('name');
    screen_id.set(name);
});

buttons.find('button:eq(0)').click();

// ----
// screen 'b' has to load before we can use it

(function (screen) {
    var state = screen.state;

    function load () {
        load = function () {};

        state.set('loading');
        
        // load for 3 seconds
        setTimeout(function () {
            state.set('ready');
        }, 3000);
    }

    screen_id.when(screen.name, load);
}(screens.b));
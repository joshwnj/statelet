// ----
// photo object

function Photo (src) {
    this._src = src;
    this.state = new State;
    this._image = null;
}

Photo.prototype = {
    getImage: function () {
        return this._image;
    },

    load: function () {
        this.load = function () {};
        
        var image = this._image = new Image;
        var state = this.state;
        image.onload = function () {
            setTimeout(function () {
                state.set('ready');
            }, 2000);
        };
        image.src = this._src;
        state.set('loading');
    }
};

// mixin State
_.each(['when', 'onTransition'], function (name) {
    Photo.prototype[name] = function () {
        this.state[name].apply(this.state, arguments);
    }
});

// ----

// photo gallery
var gallery_state = new State;
var current_photo = new State;
var holder = $('#photos');

// generic button handlers
$('body').delegate('button', 'click', function (event) {
    event.preventDefault();
    var name = $(this).attr('name');
    window[name]();
});

loadPhotos(function (err, photos) {
    
    var last_elm;
    var last_index;
    function showPhoto (index) {
        gallery_state.set('ready');
        
        if (last_index === index) { return; }
        
        var photo = photos[index];
        var image = photo.getImage();
        var image_elm = $(image);
        image_elm.css({
            opacity: 0,
            marginLeft: -0.5*image.width,
            marginTop: -0.5*image.height
        });
        image_elm.animate({ opacity: 1 });
        holder.append(image_elm);

        // transition out the old image element
        if (last_elm) {
            last_elm.animate({ opacity: 0 }, {
                complete: function () {
                    //$(this).remove();
                }
            });
        }
        last_elm = image_elm;
        last_index = index;
    }

    current_photo.watch(function (index) {
        var photo = photos[index];

        photo.when('ready', function () {
            showPhoto(current_photo.get());
        });

        photo.when('loading', function () {
            gallery_state.set('loading');
        });
        
        // load the photo
        photo.load();
    });

    window.next = function next () {
        var index = (current_photo.get() + 1) % photos.length;
        current_photo.set(index);
    }

    window.prev = function prev () {
        var index = (current_photo.get() - 1) % photos.length;
        if (index < 0) { index += photos.length; }

        current_photo.set(index);
    }

    // update the position element
    current_photo.watch(function (value) {
        $('.current').text(value);
    });
    
    // load the first photo
    current_photo.set(0);
});

// ----
// loading indicator

var loading_elm = holder.find('.loading');
gallery_state.when('loading', function () {
    loading_elm
        .css({ opacity: 0 })
        .animate({ opacity: 0.5 });
    holder.append(loading_elm);
});

gallery_state.onTransition('loading', '*', function () {
    loading_elm.animate({ opacity: 0 }, {
        complete: function () {
            loading_elm.remove();
        }
    });
});

gallery_state.set('loading');

// ----
// load photos from flickr

function loadPhotos (callback) {
    var photos = [];
    var max = 5;

    window.jsonFlickrFeed = function (data) {
        var i;
        for (i = 0; i < max; i += 1) {
            photos.push(new Photo(data.items[i].media.m));
        }

        callback(null, photos);
    };
    
    $.ajax({
        url: 'http://api.flickr.com/services/feeds/photos_public.gne?tags=squirrel&lang=en-us&format=json',
        dataType: 'jsonp'
    });
}
/**
 * Created by Eduardo on 07/09/2014.
 */

var core = (function (EventBus) {

    var animation = true;
    var controlsDisabled = false;
    var muted = false;
    var promises = 0;
    var promisesResolved = 0;
    var status = "menu";

    var game = {
        points: 0,
        startTimestamp: null,
        endTimestamp: null
    };

    var preloads = {};

    var getPromisesCount = function () {
        return promises;
    };

    var getPromisesResolved = function () {
        return promisesResolved;
    };

    var isLoading = function() {
        return promises !== promisesResolved;
    };

    var eventBus = new EventBus();

    var makeControlable = function (control, object) {

        setTimeout(function () {
            controls.setControls(control, object)
        });

    };

    var animation = function () {
        return animation;
    };

    var control = function () {
        return controlsDisabled;
    };


    var resume = function () {
        animation = true;
    };

    var pause = function () {
        animation = false;
    };

    var gameOver = function () {
        animation = false;
        controlsDisabled = true;
        controls.unsetControls();
        game.endTimestamp = new Date().valueOf();
    };

    var mute = function () {
        muted = true;
    };

    var unmute = function () {
        muted = false;
    };

    var isUnmuted = function () {
        return +(!muted);
    };


    var loadImage = function (url) {
        var image = new Image();
        image.src = url;
        promises = promises + 1;
        eventBus.dispatchEvent(new Event("promise-resolution"));
        image.addEventListener("error", function () {
            throw new Error("Image file not found: " + url);
            promisesResolved = promisesResolved + 1;
            eventBus.dispatchEvent(new Event("promise-resolution"));
        });
        image.addEventListener("load", function () {
            promisesResolved = promisesResolved + 1;
            eventBus.dispatchEvent(new Event("promise-resolution"));
        });
        return image;
    };

    var loadAudio = function (url) {
        var audio = new Audio(url);
        audio.volume = audio.volume * isUnmuted();
        promises = promises + 1;
        eventBus.dispatchEvent(new Event("promise-resolution"));
        audio.addEventListener("error", function () {
            throw new Error("Audio file not found: " + url);
            promisesResolved = promisesResolved + 1;
            eventBus.dispatchEvent(new Event("promise-resolution"));
        });
        audio.addEventListener("loadeddata", function () {
            promisesResolved = promisesResolved + 1;
            eventBus.dispatchEvent(new Event("promise-resolution"));
        });
        return audio;
    };

    return {
        eventBus: eventBus,
        status: status,
        preloads: preloads,
        getPromisesCount: getPromisesCount,
        getPromisesResolved: getPromisesResolved,
        isLoading: isLoading,
        makeControlable: makeControlable,
        animation: animation,
        control: control,
        pause: pause,
        resume: resume,
        game: game,
        gameOver: gameOver,
        mute: mute,
        unmute: unmute,
        isUnmuted: isUnmuted,
        loadImage: loadImage,
        loadAudio: loadAudio
    }


}(function () {
    return document.createElement("div");
}));
/**
 * Created by Eduardo on 07/09/2014.
 */

var controls = (function () {
    "use strict";

    var player = null;

    var directions = {
        left: false,
        right: false
    };

    var controls = {
        leftRightPress: function (event) {
            switch (event.keyCode) {
                case 37:
                    player.direction = -1;
                    directions.left = true;
                    event.preventDefault();
                    break;
                case 39:
                    player.direction = 1;
                    directions.right = true;
                    event.preventDefault();
                    break;
            }
        },
        leftRightRelease: function (event) {
            switch (event.keyCode) {
                case 37:
                    if (!directions.right) {
                        player.direction = 0;
                    } else {
                        player.direction = 1;
                    }
                    directions.left = false;
                    break;
                case 39:
                    if (!directions.left) {
                        player.direction = 0;
                    } else {
                        player.direction = -1;
                    }
                    directions.right = false;
                    break;
            }
        },
        spacePress: function (event) {
            if (event.keyCode === 32) {
                event.preventDefault();
                player.direction = 1
            }
        },
        spaceRelease: function (event) {
            if (event.keyCode === 32) {
                event.preventDefault();
                player.direction = -1
            }
        }
    };

    var unsetter = null;

    var standard = function () {

        window.addEventListener("keydown", controls.leftRightPress);
        window.addEventListener("keyup", controls.leftRightRelease);

        unsetter = function () {
            window.removeEventListener("keydown", controls.leftRightPress);
            window.removeEventListener("keyup", controls.leftRightRelease);
        }

    };

    var worm = function () {

        player.direction = -1;
        window.addEventListener("keydown", controls.spacePress);
        window.addEventListener("keyup", controls.spaceRelease);

        unsetter = function () {
            window.removeEventListener("keydown", controls.spacePress);
            window.removeEventListener("keyup", controls.spaceRelease);
        }
    };

    return {
        setControls: function (control, item) {
            player = item;
            switch (control) {
                case "standard":
                    standard();
                    break;
                case "worm":
                    worm();
                    break;
            }
        },
        unsetControls: function () {

            directions = {
                left: false,
                right: false
            };

            player.direction = 0;

            unsetter();
        }
    }

}());
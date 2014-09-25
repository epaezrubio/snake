/**
 * Created by Eduardo on 07/09/2014.
 */

var Apple = (function () {
    "use strict";

    var _Apple = function (attributes) {


        this.growRate = 1;
        this.type = "normal";
        this.size = 25;
        this.position = {
            x: 0,
            y: 0
        };

        this.pointsReward = 1;

        this.statics = {
            apple: core.loadImage("img/apple.png"),
            eatSound: core.loadAudio("fx/eat.mp3")
        };

        _.extend(this, attributes);

    };


    _Apple.prototype = Object.create(PObject.prototype);

    _Apple.prototype.snakeHit = function (map, snake) {
        this.statics.eatSound.play();
        if (this.type === "normal") {
            snake.grow(this.growRate);
            delete this.position;
            map.newApple(this);
        } else if (this.type === "golden") {
            var nextGoldenTime = Math.random() * 5000 + (15000 / map.goldenApplesAppearanceFrequency);
            snake.godMode(9000);
            map._nextGoldenTimeout = setTimeout(function() {
                map.newApple({type: "golden", pointsReward: 0});
            }, nextGoldenTime)
        }
        map.deleteApple(this);
    };

    _Apple.prototype.paint = function(ctx) {
        var typeOffset = {
            normal: 0,
            golden: 23
        }
        ctx.drawImage(this.statics.apple, typeOffset[this.type], 0, 23, 23, this.position.x, this.position.y, 23, 23);
    };

    return _Apple;

}());

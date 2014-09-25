/**
 * Created by Eduardo on 07/09/2014.
 */
var Map = (function () {
    "use strict";

    var _Map = function (attributes) {

        this.apples = [];
        this.snakes = [];
        this.size = {
            w: 500,
            h: 500
        };
        this.margin = 15;

        this.goldenApplesAppearanceFrequency = 60;
        this._nextGoldenTimeout = null;

        this.statics = {
            background: (function () {
                var image = new Image();
                image.src = "img/grass.png";
                return image;
            }())
        };

        _.extend(this, attributes);

    };

    _Map.prototype.paint = function (ctx) {
        ctx.drawImage(this.statics.background, 0, 0);
    };

    _Map.prototype.randomPosition = function () {
        return {
            x: this.margin + Math.random() * (this.size.w - (this.margin * 2)),
            y: this.margin + Math.random() * (this.size.h - (this.margin * 2))
        }
    };

    _Map.prototype.isOutOfLimits = function (object) {
        return ((object.position.x + object.size) > this.size.w) ||
            (object.position.x < 0) ||
            ((object.position.y + object.size) > this.size.h) ||
            (object.position.y < 0);
    };

    _Map.prototype.finish = function() {
        clearTimeout(this._nextGoldenTimeout);
    };

    _Map.prototype.newApple = function (attributes) {

        var _attributes = _.clone(attributes) || {};

        var suitableSpace = true;
        var apple = null;
        var loops = 0;
        do {
            loops = loops + 1;
            suitableSpace = true;
            _attributes.position = _attributes.position || this.randomPosition();
            apple = new Apple(_attributes);

            if (apple.distanceToClosestCorner(this) < (apple.size * 4)) {
                delete _attributes.position;
                suitableSpace = false;
                continue;
            }

            checkSuitableSpace:
                for (var i = 0; i < this.snakes.length; i++) {
                    for (var j = 0; j < this.snakes[i].bodyParts.length; j++) {
                        if (this.snakes[i].bodyParts[j].hitTest(apple)) {
                            suitableSpace = false;
                            delete _attributes.position;
                            break checkSuitableSpace;
                        }
                    }
                }

        } while (!suitableSpace && loops < 50);

        this.apples.push(apple);

    };

    _Map.prototype.deleteApple = function (apple) {

        this.apples.splice(this.apples.indexOf(apple), 1);

    };

    return _Map;

}());


/**
 * Created by Eduardo on 07/09/2014.
 */

var Snake = (function () {

    var _Snake = function (attributes) {

        this.bodyParts = [];

        this.length = 20;
        this.direction = 0;
        this.rotation = 0;
        this.speed = 3;
        this.rotateAbility = 0.06;

        this.bodyPartsOffset = 5;
        this.size = 20;
        this.color = "colorful";

        this._godMode = 0;
        this._godModeTimeout = null;

        this.godModeTime = 0;
        this.distanceCovered = 0;

        this.statics = {
            greenSnake: core.loadImage("img/snake_green.png"),
            pinkSnake: core.loadImage("img/snake_pink.png"),
            colorfulSnake: core.loadImage("img/snake_colorful.png")
        };

        for (var i = 0, ii = this.length; i < ii; i++) {
            this.bodyParts.unshift(new SnakePart({
                position: {
                    x: 50 - this.speed * i,
                    y: 200
                }
            }))
        }

        _.extend(this, attributes);

    };

    _Snake.prototype = Object.create(PObject.prototype);

    _Snake.prototype.getHead = function () {
        return this.bodyParts[this.bodyParts.length - 1];
    };

    _Snake.prototype.getLast = function () {
        return this.bodyParts[0];
    };

    _Snake.prototype.isPosVisible = function (i) {
        return ((i % this.bodyPartsOffset) === this.bodyPartsOffset - 1) && !this.bodyParts[i].wontMove;
    };

    _Snake.prototype.grow = function (rate) {
        var _rate = rate || 1;
        for (var i = 0; i < _rate; i++) {
            this.length = this.length + this.bodyPartsOffset;
            var wontMove = this.getLast().wontMove ? (this.getLast().wontMove - 1) : 0;
            this.bodyParts.unshift(new SnakePart({
                position: {
                    x: this.getLast().x,
                    y: this.getLast().y
                },
                rotation: this.getLast().rotation,
                wontMove: this.bodyPartsOffset + wontMove
            }));
            for (var j = 1, jj = this.bodyPartsOffset; j < jj; j++) {
                var _wontMove = this.getLast().wontMove ? (this.getLast().wontMove - 1) : 0;
                this.bodyParts.unshift(new SnakePart({
                    position: {
                        x: this.getLast().x,
                        y: this.getLast().y
                    },
                    rotation: this.getLast().rotation,
                    wontMove: _wontMove
                }))
            }
        }
    };

    _Snake.prototype.addDistanceCovered = function (distance) {
        if (!isNaN(distance)) {
            this.distanceCovered = this.distanceCovered + distance;
        }
    };

    _Snake.prototype.godMode = function(timeout) {

        var that = this,
            schueduleDecreaseGodMode = function(time) {
            return setTimeout(function () {
                that._godMode = that._godMode - time;
                that.godModeTime = that.godModeTime + time;
                that._godModeTimeout = schueduleDecreaseGodMode(time);
                if (that._godMode <= 0) {
                    clearTimeout(that._godModeTimeout);
                }
            }, time);
        };

        this._godMode = timeout;

        clearTimeout(this._godModeTimeout);
        this._godModeTimeout = schueduleDecreaseGodMode(1000);

    };

    _Snake.prototype.move = function () {

        if (this.direction) {
            this.rotation = this.rotation + (this.rotateAbility * this.direction);
        }

        var newPosition = new SnakePart({
            position: {
                x: this.getHead().position.x + (Math.cos(this.rotation) * this.speed),
                y: this.getHead().position.y + (Math.sin(this.rotation) * this.speed)
            },
            size: this.size,
            rotation: this.rotation
        });

        this.addDistanceCovered(this.getHead().distanceToObject(newPosition));

        this.bodyParts.push(newPosition);
        if (this.bodyParts.length > this.length) {
            this.bodyParts.splice(0, 1);
        }

    };

    _Snake.prototype.snakeHitTest = function (snake) {
        for (var i = 0, ii = snake.bodyParts.length; i < ii; i++) {
            if (this.isPosVisible(i) && this.getHead().hitTest(snake.bodyParts[i])) {
                return true;
            }
        }
        return false;
    };

    _Snake.prototype.selfHitTest = function () {

        if (this._godMode > 0) {
            return false;
        }

        var selfHitTestHeadOffset = function () {
            //TODO: calculate
            return 30;
        };

        for (var i = 0, ii = this.bodyParts.length - selfHitTestHeadOffset(); i < ii; i++) {
            if (this.isPosVisible(i) && this.getHead().hitTest(this.bodyParts[i])) {
                return true;
            }
        }
        return false;
    };

    _Snake.prototype.paintGodMode = function(ctx, x, y) {
        var formattedTime = "" + ((this._godMode / 1000) >> 0);
        ctx.font = '12pt Gloria Hallelujah';
        ctx.fillStyle = "white";
        ctx.fillText("godmode", x - 25, 20);
        ctx.font = 'bold 20pt Gloria Hallelujah';
        ctx.fillStyle = "white";
        ctx.fillText(formattedTime, x, y);
    };

    _Snake.prototype.paint = function (ctx) {
        var that = this;
        var paintPart = function (bodyPart, size) {
            ctx.save();
            ctx.translate(
                    that.bodyParts[i].position.x + 11.5,
                    that.bodyParts[i].position.y + 11.5
            );
            ctx.rotate(that.bodyParts[i].rotation);
            ctx.drawImage(
                that.statics[that.color + "Snake"],
                bodyPart.x,
                bodyPart.y,
                size,
                size,
                    size / (-2),
                    size / (-2),
                size,
                size,
                size,
                size
            );
            ctx.restore();
        };

        // paint body
        var i = 0,
            ii = this.bodyParts.length - 1,
            bodyVariations = 2,
            bodyVariation = ((ii + 1) % (this.bodyPartsOffset * 2)) % (this.bodyPartsOffset - 1);

        for (i, ii; i < ii; i++) {
            if (this.isPosVisible(i)) {
                paintPart({
                    x: 23 + (23 * (bodyVariation++ % bodyVariations)),
                    y: 0
                }, 23);
            }
        }

        // paint head
        paintPart({
            x: 0,
            y: 0
        }, 23);

    };

    return _Snake;

}());
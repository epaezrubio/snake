/**
 * Created by Eduardo on 07/09/2014.
 */

var PObject = (function () {
    "use strict";

    var _PObject = function (attributes) {
        this.position = {
            x: 0,
            y: 0
        };
        this.size = 0;

        _.extend(this, attributes);

    };

    _PObject.prototype.distanceToObject = function (object) {

        var thisCenter = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        };
        var objectCenter = {
            x: object.position.x + object.size / 2,
            y: object.position.y + object.size / 2
        };

        return Math.sqrt(Math.pow(thisCenter.x - objectCenter.x, 2) + Math.pow(thisCenter.y - objectCenter.y, 2));

    };

    _PObject.prototype.distanceToClosestCorner = function (map) {

        var cornerAsPObject = function(x, y) {
            return new PObject({
                position: {
                    x: x,
                    y: y
                }
            })
        };

        var distanceToCorners = [
            cornerAsPObject(0, 0).distanceToObject(this),
            cornerAsPObject(map.size.w, 0).distanceToObject(this),
            cornerAsPObject(map.size.w, map.size.h).distanceToObject(this),
            cornerAsPObject(0, map.size.h).distanceToObject(this)
        ].sort();


        return distanceToCorners[0];


    };

    _PObject.prototype.hitTest = function (object) {

        return (this.distanceToObject(object) < object.size);

    };

    return _PObject;

}());

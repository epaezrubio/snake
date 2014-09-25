/**
 * Created by Eduardo on 07/09/2014.
 */

var SnakePart = (function() {
    "use strict";

    var _SnakePart = function (attributes) {

        _.extend(this, attributes);

    };

    _SnakePart.prototype = Object.create(PObject.prototype);

    return _SnakePart;

}());
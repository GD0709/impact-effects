"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoMath = exports.Transform = exports.GeoVector = exports.GeoPoint = exports.Vector = exports.Point = void 0;
var Events_1 = require("../lib/Events");
var latlon_ellipsoidal_vincenty_js_1 = __importDefault(require("geodesy/latlon-ellipsoidal-vincenty.js"));
var Point = /** @class */ (function () {
    function Point(name, x, y) {
        this._x = 0;
        this._y = 0;
        this.on_changed = new Events_1.Emitter();
        this._x = x !== null && x !== void 0 ? x : 0;
        this._y = y !== null && y !== void 0 ? y : 0;
        this.name = name;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () { return this._x; },
        set: function (x) { this._x = 1. * x; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () { return this._y; },
        set: function (y) { this._y = 1. * y; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Point.prototype.set = function (x, y, passed) {
        if (!passed.includes(this.name) && (this.x != x || this.y != y)) {
            console.log(this.name, " set ", x, ", ", y, " passed:", passed);
            this._x = 1. * x;
            this._y = 1. * y;
            this.fire_changed(passed.concat(this.name));
            return true;
        }
        return false;
    };
    Object.defineProperty(Point.prototype, "changed", {
        get: function () {
            return this.on_changed;
        },
        enumerable: false,
        configurable: true
    });
    Point.prototype.fire_changed = function (passed) {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    };
    Point.prototype.to_string = function () {
        return "{x: ".concat(this.x, ", y:").concat(this.y, "}");
    };
    return Point;
}());
exports.Point = Point;
var Vector = /** @class */ (function (_super) {
    __extends(Vector, _super);
    function Vector(name, x, y, angle) {
        var _this = _super.call(this, name, x, y) || this;
        _this._angle = 0;
        _this._angle = angle !== null && angle !== void 0 ? angle : 0;
        return _this;
    }
    Object.defineProperty(Vector.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (angle) { this._angle = 1. * angle; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.set_vector = function (x, y, azimuth, passed) {
        console.log(this.name, " set ", x, ", ", y, ", azimuth", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._x != x || this._y != y || this._angle != azimuth)) {
            this._x = 1. * x;
            this._y = 1. * y;
            this._angle = 1. * azimuth;
            passed.push(this.name);
            this.fire_changed(passed);
        }
    };
    return Vector;
}(Point));
exports.Vector = Vector;
var GeoPoint = /** @class */ (function () {
    function GeoPoint(name, latitude, longitude) {
        this._latitude = 0;
        this._longitude = 0;
        this.on_changed = new Events_1.Emitter();
        this.name = name;
        this._latitude = latitude !== null && latitude !== void 0 ? latitude : 0;
        this._longitude = longitude !== null && longitude !== void 0 ? longitude : 0;
    }
    Object.defineProperty(GeoPoint.prototype, "latitude", {
        get: function () { return this._latitude; },
        set: function (latitude) { this._latitude = 1. * latitude; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GeoPoint.prototype, "longitude", {
        get: function () { return this._longitude; },
        set: function (longitude) { this._longitude = 1. * longitude; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    GeoPoint.prototype.set = function (latitude, longitude, passed) {
        console.log(this.name, " set ", latitude, ", ", longitude, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude)) {
            this._latitude = latitude;
            this._longitude = longitude;
            this.fire_changed(passed);
        }
    };
    Object.defineProperty(GeoPoint.prototype, "changed", {
        get: function () {
            return this.on_changed;
        },
        enumerable: false,
        configurable: true
    });
    GeoPoint.prototype.fire_changed = function (passed) {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    };
    GeoPoint.prototype.to_string = function () {
        return "".concat(this.name, " {latitude: ").concat(this.latitude, ", longitude:").concat(this.longitude, "}");
    };
    return GeoPoint;
}());
exports.GeoPoint = GeoPoint;
var GeoVector = /** @class */ (function (_super) {
    __extends(GeoVector, _super);
    function GeoVector(name, latitude, longitude, azimuth) {
        var _this = _super.call(this, name, latitude, longitude) || this;
        _this._azimuth = 0;
        _this._azimuth = azimuth !== null && azimuth !== void 0 ? azimuth : 0;
        return _this;
    }
    Object.defineProperty(GeoVector.prototype, "azimuth", {
        get: function () { return this._azimuth; },
        set: function (azimuth) { this._azimuth = 1. * azimuth; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    GeoVector.prototype.set_vector = function (latitude, longitude, azimuth, passed) {
        console.log(this.name, " set ", latitude, ", ", longitude, ", azimuth:", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude || this._azimuth != azimuth)) {
            this._latitude = latitude;
            this._longitude = longitude;
            this._azimuth = azimuth;
            this.fire_changed(passed);
        }
    };
    return GeoVector;
}(GeoPoint));
exports.GeoVector = GeoVector;
var GeoMath = /** @class */ (function () {
    function GeoMath() {
    }
    GeoMath.calc_distance = function (view_point, //view point coordinates (radians)
    target_point //target point coordinates (radians)
    ) {
        var p1 = new latlon_ellipsoidal_vincenty_js_1.default(view_point.latitude, view_point.longitude);
        var p2 = new latlon_ellipsoidal_vincenty_js_1.default(target_point.latitude, target_point.longitude);
        var dist2 = p1.distanceTo(p2);
        return dist2 / 1000;
    };
    // public static azimuth_calc(
    //     view_point: {latitude: number, longitude: number}, //view point coordinates (radians)
    //     target_point: {latitude: number, longitude: number} //target point coordinates (radians)
    //     ): number{
    //     let l = target_point.longitude - view_point.longitude;
    //     let alpha = Math.atan2(
    //         Math.sin(l) * Math.cos(target_point.latitude),
    //         (Math.cos(view_point.latitude) * Math.sin(target_point.latitude) - Math.sin(view_point.latitude) * Math.cos(target_point.latitude) * Math.cos(l))
    //     );
    //     return (alpha + 2 * Math.PI) % (2 * Math.PI);
    // }
    /** in dec */
    GeoMath.coords_by_distance_azimuth = function (view_point, //view point coordinates (dec)
    distance, // distance to the target point (meters)
    bearing // azimuth from the view point to the target point (dec)
    ) {
        var p1 = new latlon_ellipsoidal_vincenty_js_1.default(view_point.latitude, view_point.longitude);
        var p2 = p1.destinationPoint(distance, bearing);
        return { latitude: p2.latitude, longitude: p2.longitude };
    };
    GeoMath.final_bearing_to = function (view_point, //view point coordinates (dec)
    target_point) {
        var p1 = new latlon_ellipsoidal_vincenty_js_1.default(view_point.latitude, view_point.longitude);
        var p2 = new latlon_ellipsoidal_vincenty_js_1.default(target_point.latitude, target_point.longitude);
        return p1.finalBearingTo(p2);
    };
    GeoMath.initial_bearing_to = function (view_point, //view point coordinates (dec)
    target_point) {
        var p1 = new latlon_ellipsoidal_vincenty_js_1.default(view_point.latitude, view_point.longitude);
        var p2 = new latlon_ellipsoidal_vincenty_js_1.default(target_point.latitude, target_point.longitude);
        return p1.initialBearingTo(p2);
    };
    GeoMath.Earth_radius = 6371; // km.
    return GeoMath;
}());
exports.GeoMath = GeoMath;
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform(name, x, y, angle, mx, my) {
        var _this = _super.call(this, name, x, y, angle) || this;
        _this._mx = 0;
        _this._my = 0;
        _this._mx = mx !== null && mx !== void 0 ? mx : 1;
        _this._my = my !== null && my !== void 0 ? my : 1;
        return _this;
    }
    Object.defineProperty(Transform.prototype, "mx", {
        get: function () { return this._mx; },
        set: function (mx) { this._mx = 1. * mx; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "my", {
        get: function () { return this._my; },
        set: function (my) { this._my = 1. * my; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Transform.prototype.set_zoom = function (m, passed) {
        this._mx = 1. * m;
        this._my = 1. * m;
        this.fire_changed(passed);
    };
    Transform.prototype.set_transform = function (x, y, azimuth, mx, my, passed) {
        if (this._x != x || this._y != y || this._angle != azimuth || this._mx != mx || this._my != my) {
            this._x = 1. * x;
            this._y = 1. * y;
            this._angle = 1. * azimuth;
            this._mx = 1. * mx;
            this._my = 1. * my;
            //if(silent === false)
            this.fire_changed(passed);
        }
    };
    Transform.prototype.convert_to = function (p) {
        //console.log('changed ', p.to_string());
        var x = p.x;
        var y = p.y;
        x = x * this.mx;
        y = y * this.my;
        var r = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
        var a = Math.atan2(y, x);
        //console.log('angle: ', a / Math.PI * 180);
        x = r * Math.cos(-this.angle * Math.PI / 180 + a);
        y = r * Math.sin(-this.angle * Math.PI / 180 + a);
        //console.log('changed 2', x, ' ', y);
        x = x + this.x;
        y = y - this.y;
        //console.log('changed 3', x, ' ', y);
        return { x: x, y: y };
    };
    Transform.prototype.convert_from = function (p) {
        //console.log('changed back ', p.to_string());
        var x = p.x;
        var y = p.y;
        x = x - this.x;
        y = y + this.y;
        //console.log('changed back 2', x, ' ', y);
        var r = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
        var a = Math.atan2(y, x);
        x = r * Math.cos(a + this.angle * Math.PI / 180);
        y = r * Math.sin(a + this.angle * Math.PI / 180);
        x = x / this.mx;
        y = y / this.my;
        //console.log('changed 3', x, ' ', y);
        return { x: x, y: y };
    };
    return Transform;
}(Vector));
exports.Transform = Transform;

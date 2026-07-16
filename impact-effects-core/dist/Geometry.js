"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoMath = exports.Transform = exports.GeoVector = exports.GeoPoint = exports.Vector = exports.Point = void 0;
const Events_1 = require("./lib/Events");
class Point {
    constructor(name, x, y) {
        this._x = 0;
        this._y = 0;
        this.on_changed = new Events_1.Emitter();
        this._x = x ?? 0;
        this._y = y ?? 0;
        this.name = name;
    }
    get x() { return this._x; }
    set x(x) { this._x = 1. * x; this.fire_changed([]); }
    get y() { return this._y; }
    set y(y) { this._y = 1. * y; this.fire_changed([]); }
    set(x, y, passed) {
        if (!passed.includes(this.name) && (this.x != x || this.y != y)) {
            console.log(this.name, " set ", x, ", ", y, " passed:", passed);
            this._x = 1. * x;
            this._y = 1. * y;
            this.fire_changed(passed.concat(this.name));
            return true;
        }
        return false;
    }
    get changed() {
        return this.on_changed;
    }
    fire_changed(passed) {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    }
    to_string() {
        return `{x: ${this.x}, y:${this.y}}`;
    }
}
exports.Point = Point;
class Vector extends Point {
    constructor(name, x, y, angle) {
        super(name, x, y);
        this._angle = 0;
        this._angle = angle ?? 0;
    }
    get angle() { return this._angle; }
    set angle(angle) { this._angle = 1. * angle; this.fire_changed([]); }
    set_vector(x, y, azimuth, passed) {
        console.log(this.name, " set ", x, ", ", y, ", azimuth", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._x != x || this._y != y || this._angle != azimuth)) {
            this._x = 1. * x;
            this._y = 1. * y;
            this._angle = 1. * azimuth;
            passed.push(this.name);
            this.fire_changed(passed);
        }
    }
}
exports.Vector = Vector;
class GeoPoint {
    constructor(name, latitude, longitude) {
        this._latitude = 0;
        this._longitude = 0;
        this.on_changed = new Events_1.Emitter();
        this.name = name;
        this._latitude = latitude ?? 0;
        this._longitude = longitude ?? 0;
    }
    get latitude() { return this._latitude; }
    set latitude(latitude) { this._latitude = 1. * latitude; this.fire_changed([]); }
    get longitude() { return this._longitude; }
    set longitude(longitude) { this._longitude = 1. * longitude; this.fire_changed([]); }
    set(latitude, longitude, passed) {
        console.log(this.name, " set ", latitude, ", ", longitude, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude)) {
            this._latitude = latitude;
            this._longitude = longitude;
            this.fire_changed(passed);
        }
    }
    get changed() {
        return this.on_changed;
    }
    fire_changed(passed) {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    }
    to_string() {
        return `${this.name} {latitude: ${this.latitude}, longitude:${this.longitude}}`;
    }
}
exports.GeoPoint = GeoPoint;
class GeoVector extends GeoPoint {
    constructor(name, latitude, longitude, azimuth) {
        super(name, latitude, longitude);
        this._azimuth = 0;
        this._azimuth = azimuth ?? 0;
    }
    get azimuth() { return this._azimuth; }
    set azimuth(azimuth) { this._azimuth = 1. * azimuth; this.fire_changed([]); }
    set_vector(latitude, longitude, azimuth, passed) {
        console.log(this.name, " set ", latitude, ", ", longitude, ", azimuth:", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude || this._azimuth != azimuth)) {
            this._latitude = latitude;
            this._longitude = longitude;
            this._azimuth = azimuth;
            this.fire_changed(passed);
        }
    }
}
exports.GeoVector = GeoVector;
class GeoMath {
    static calc_distance(view_point, //view point coordinates (radians)
    target_point //target point coordinates (radians)
    ) {
        const p1 = new Test(view_point.latitude, view_point.longitude);
        const p2 = new Test(target_point.latitude, target_point.longitude, 0);
        let dist2 = p1.distanceTo(p2);
        return dist2 / 1000;
    }
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
    static coords_by_distance_azimuth(view_point, //view point coordinates (dec)
    distance, // distance to the target point (meters)
    bearing // azimuth from the view point to the target point (dec)
    ) {
        let p1 = new Test(view_point.latitude, view_point.longitude);
        let p2 = p1.destinationPoint(distance, bearing);
        return { latitude: p2.latitude, longitude: p2.longitude };
    }
    static final_bearing_to(view_point, //view point coordinates (dec)
    target_point) {
        let p1 = new Test(view_point.latitude, view_point.longitude);
        let p2 = new Test(target_point.latitude, target_point.longitude);
        return p1.finalBearingTo(p2);
    }
    static initial_bearing_to(view_point, //view point coordinates (dec)
    target_point) {
        let p1 = new Test(view_point.latitude, view_point.longitude);
        let p2 = new Test(target_point.latitude, target_point.longitude);
        return p1.initialBearingTo(p2);
    }
}
exports.GeoMath = GeoMath;
GeoMath.Earth_radius = 6371; // km.
class Transform extends Vector {
    constructor(name, x, y, angle, mx, my) {
        super(name, x, y, angle);
        this._mx = 0;
        this._my = 0;
        this._mx = mx ?? 1;
        this._my = my ?? 1;
    }
    get mx() { return this._mx; }
    set mx(mx) { this._mx = 1. * mx; this.fire_changed([]); }
    get my() { return this._my; }
    set my(my) { this._my = 1. * my; this.fire_changed([]); }
    set_zoom(m, passed) {
        this._mx = 1. * m;
        this._my = 1. * m;
        this.fire_changed(passed);
    }
    set_transform(x, y, azimuth, mx, my, passed) {
        if (this._x != x || this._y != y || this._angle != azimuth || this._mx != mx || this._my != my) {
            this._x = 1. * x;
            this._y = 1. * y;
            this._angle = 1. * azimuth;
            this._mx = 1. * mx;
            this._my = 1. * my;
            //if(silent === false)
            this.fire_changed(passed);
        }
    }
    convert_to(p) {
        //console.log('changed ', p.to_string());
        let x = p.x;
        let y = p.y;
        x = x * this.mx;
        y = y * this.my;
        let r = (x ** 2 + y ** 2) ** 0.5;
        let a = Math.atan2(y, x);
        //console.log('angle: ', a / Math.PI * 180);
        x = r * Math.cos(-this.angle * Math.PI / 180 + a);
        y = r * Math.sin(-this.angle * Math.PI / 180 + a);
        //console.log('changed 2', x, ' ', y);
        x = x + this.x;
        y = y - this.y;
        //console.log('changed 3', x, ' ', y);
        return { x, y };
    }
    convert_from(p) {
        //console.log('changed back ', p.to_string());
        let x = p.x;
        let y = p.y;
        x = x - this.x;
        y = y + this.y;
        //console.log('changed back 2', x, ' ', y);
        let r = (x ** 2 + y ** 2) ** 0.5;
        let a = Math.atan2(y, x);
        x = r * Math.cos(a + this.angle * Math.PI / 180);
        y = r * Math.sin(a + this.angle * Math.PI / 180);
        x = x / this.mx;
        y = y / this.my;
        //console.log('changed 3', x, ' ', y);
        return { x, y };
    }
}
exports.Transform = Transform;

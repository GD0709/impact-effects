"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroPoints = exports.ObservationPointDistanceAngle = exports.ObservationPointAlongAcross = exports.ObservationPointInput = void 0;
const MathExt_1 = __importDefault(require("./lib/MathExt"));
const Radiation_1 = __importDefault(require("./Effects/Radiation"));
const ShockWave_1 = __importDefault(require("./Effects/ShockWave"));
const Geometry_1 = require("./Geometry");
var ZeroPoints;
(function (ZeroPoints) {
    ZeroPoints[ZeroPoints["entry_point_100km"] = 1] = "entry_point_100km";
    ZeroPoints[ZeroPoints["max_overpressure_point"] = 2] = "max_overpressure_point";
    ZeroPoints[ZeroPoints["surface_intersection"] = 3] = "surface_intersection";
    ZeroPoints[ZeroPoints["max_thermal_effect_point"] = 4] = "max_thermal_effect_point";
})(ZeroPoints || (exports.ZeroPoints = ZeroPoints = {}));
class ObservationPointInput extends Geometry_1.Point {
    log(...data) {
        if (this.debug == true)
            console.log("ObservationPointInput:", ...data);
    }
    constructor(main_point, variant) {
        super("observation_point_rel");
        this.debug = false;
        this._relative_to = ZeroPoints.surface_intersection;
        // this is shift relative to zero_point and center 
        //shift_x: number = 0;
        this.shift_y = 0;
        this.along_across = new ObservationPointAlongAcross(this);
        //distance_angle= {distance: 0, angle:0 };
        this.distance_angle = new ObservationPointDistanceAngle(this);
        this.main_point = main_point;
        this.main_point.changed.on((s, p) => this.main_point_changed(s, p));
        this.variant = variant;
        this.update_shift([]);
        this.variant.changed.on((s, p) => this.update_shift(p));
    }
    main_point_changed(s, passed) {
        if (!passed.includes(this.name)) {
            console.log('main_point_changed', s.x, s.y - this.shift_y, passed);
            this.set(s.x, s.y - this.shift_y, passed);
        }
    }
    set_from_derivative(x, y, passed) {
        if (!passed.includes(this.name)) {
            console.log('ObservationPointInput', x, y, passed);
            this.set(x, y, passed);
            this.main_point.set(x, y + this.shift_y, passed);
            console.log('main point', this.main_point.to_string(), "this", this.to_string());
            //this.set(x, y, passed.concat(this.name));
        }
    }
    get relative_to() { return this._relative_to; }
    set relative_to(relative_to) { if (this._relative_to != relative_to) {
        this._relative_to = relative_to;
        this.update_shift([]);
    } }
    async update_shift(passed) {
        if (this.relative_to == ZeroPoints.surface_intersection) {
            //this.shift_x = 0;
            this.shift_y = 0;
            this.log(`relative to set: ${this.relative_to} surface_intersection and shift: ${this.shift_y}`);
        }
        else if (this.relative_to == ZeroPoints.max_overpressure_point) {
            let shock = new ShockWave_1.default();
            shock.calc_heff_and_zero_point(this.variant);
            //this.shift_x = 0;
            this.shift_y = shock.zero_point;
            this.log(`relative to set: ${this.relative_to} max_overpressure_point and shift: ${this.shift_y}`);
        }
        else if (this.relative_to == ZeroPoints.max_thermal_effect_point) {
            let rad = new Radiation_1.default();
            rad.calc_hrad_and_zero_point(this.variant);
            //this.shift_x = 0;
            this.shift_y = rad.zero_point;
            this.log(`relative to set: ${this.relative_to} max_thermal_effect_point and shift: ${this.shift_y}`);
        }
        else if (this.relative_to == ZeroPoints.entry_point_100km) {
            //this.shift_x = 0;
            this.shift_y = 100. / Math.tan(MathExt_1.default.deg2rad(this.variant.angle));
            this.log(`relative to set: ${this.relative_to} entry_point_100km and shift: ${this.shift_y}`);
        }
        this.set(this.main_point.x, this.main_point.y - this.shift_y, passed);
    }
}
exports.ObservationPointInput = ObservationPointInput;
class ObservationPointAlongAcross {
    constructor(input) {
        this.name = "along_across";
        this.input = input;
    }
    get along() { return -this.input.y; }
    set along(val) { if (!isNaN(val)) {
        this.input.set_from_derivative(this.input.x, -val, [this.name]);
    } }
    get across() { return this.input.x; }
    set across(val) { if (!isNaN(val)) {
        this.input.set_from_derivative(val, this.input.y, [this.name]);
    } }
}
exports.ObservationPointAlongAcross = ObservationPointAlongAcross;
class ObservationPointDistanceAngle {
    constructor(input) {
        this.name = "distance_angle";
        this.input = input;
    }
    get distance() { return (this.input.x ** 2 + this.input.y ** 2) ** 0.5; }
    set distance(val) {
        if (!isNaN(val)) {
            let angle = Math.atan2(this.input.x, -this.input.y);
            this.input.set_from_derivative(val * Math.sin(angle), -val * Math.cos(angle), [this.name]);
        }
    }
    static fix_quartile(angle_rad) {
        while (angle_rad < 0)
            angle_rad += 2 * Math.PI;
        while (angle_rad >= 2 * Math.PI)
            angle_rad -= 2 * Math.PI;
        return angle_rad;
    }
    static calc_angle(point) {
        return MathExt_1.default.rad2deg(ObservationPointDistanceAngle.fix_quartile(Math.atan2(point.x, -point.y)));
    }
    get angle() { return ObservationPointDistanceAngle.calc_angle(this.input); }
    set angle(val) {
        if (!isNaN(val)) {
            let distance = this.distance;
            let a = MathExt_1.default.deg2rad(val);
            this.input.set_from_derivative(distance * Math.sin(a), -distance * Math.cos(a), [this.name]);
        }
    }
}
exports.ObservationPointDistanceAngle = ObservationPointDistanceAngle;

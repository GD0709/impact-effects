"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Events_1 = require("./../lib/Events");
var ShockWave_1 = __importDefault(require("./Effects/ShockWave"));
var Variant = /** @class */ (function () {
    function Variant(name, density, diameter, angle, velocity) {
        this.on_changed = new Events_1.Emitter();
        this._velocity = 19.16;
        this._angle = 18;
        this._density = 3320;
        this._diameter = 19;
        this.angle_rad = 0;
        this.kenergy = 0;
        this.kenergy_kttnt = 0;
        this.heff = 0;
        this.name = name;
        this._density = density !== null && density !== void 0 ? density : 3320;
        this._diameter = diameter !== null && diameter !== void 0 ? diameter : 19;
        this._angle = angle !== null && angle !== void 0 ? angle : 18;
        this._velocity = velocity !== null && velocity !== void 0 ? velocity : 19;
        this.update_derivatives();
    }
    Variant.prototype.clone = function () {
        var res = new Variant(this.name);
        res._diameter = this.diameter;
        res._density = this.density;
        res._angle = this.angle;
        res._velocity = this.velocity;
        return res;
    };
    Object.defineProperty(Variant.prototype, "changed", {
        get: function () {
            return this.on_changed;
        },
        enumerable: false,
        configurable: true
    });
    Variant.prototype.fire_changed = function (passed) {
        passed.push(this.name);
        this.update_derivatives();
        this.on_changed.trigger(this, passed);
    };
    Object.defineProperty(Variant.prototype, "velocity", {
        get: function () { return this._velocity; },
        set: function (value) { this._velocity = value; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Variant.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (value) { this._angle = value; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Variant.prototype, "density", {
        get: function () { return this._density; },
        set: function (value) { this._density = value; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Variant.prototype, "diameter", {
        get: function () { return this._diameter; },
        set: function (value) { this._diameter = value; this.fire_changed([]); },
        enumerable: false,
        configurable: true
    });
    Variant.prototype.update_derivatives = function () {
        this.angle_rad = this.angle * Math.PI / 180;
        this.kenergy = this.kenergy_calc(this);
        this.kenergy_kttnt = this.kenergy_kttnt_calc(this.kenergy);
        this.heff = ShockWave_1.default.heff_calc(this);
    };
    Variant.prototype.kenergy_calc = function (variant) {
        // diameter (m)
        // density (km/m^3)
        // velocity (km/s)
        //
        // Returns kinetic energy (J)
        return variant.density / 2.0 * 4.0 / 3.0 * Math.PI * Math.pow(variant.diameter / 2.0, 3) * Math.pow(variant.velocity, 2) * Math.pow(10, 6);
    };
    Variant.prototype.kenergy_kttnt_calc = function (energy) {
        // energy (J)
        //
        // Returns kinetic energy (kt TNT)
        return 2.39 * Math.pow(10, -13) * energy;
    };
    Variant.prototype.to_string = function () {
        return "".concat(this.density, "-").concat(this.diameter, "-").concat(this.angle, "-").concat(this.velocity);
    };
    return Variant;
}());
exports.default = Variant;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./lib/Events");
const ShockWave_1 = __importDefault(require("./Effects/ShockWave"));
class Variant {
    constructor(name, density, diameter, angle, velocity) {
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
        this._density = density ?? 3320;
        this._diameter = diameter ?? 19;
        this._angle = angle ?? 18;
        this._velocity = velocity ?? 19;
        this.update_derivatives();
    }
    clone() {
        let res = new Variant(this.name);
        res._diameter = this.diameter;
        res._density = this.density;
        res._angle = this.angle;
        res._velocity = this.velocity;
        return res;
    }
    get changed() {
        return this.on_changed;
    }
    fire_changed(passed) {
        passed.push(this.name);
        this.update_derivatives();
        this.on_changed.trigger(this, passed);
    }
    get velocity() { return this._velocity; }
    set velocity(value) { this._velocity = value; this.fire_changed([]); }
    get angle() { return this._angle; }
    set angle(value) { this._angle = value; this.fire_changed([]); }
    get density() { return this._density; }
    set density(value) { this._density = value; this.fire_changed([]); }
    get diameter() { return this._diameter; }
    set diameter(value) { this._diameter = value; this.fire_changed([]); }
    update_derivatives() {
        this.angle_rad = this.angle * Math.PI / 180;
        this.kenergy = this.kenergy_calc(this);
        this.kenergy_kttnt = this.kenergy_kttnt_calc(this.kenergy);
        this.heff = ShockWave_1.default.heff_calc(this);
    }
    kenergy_calc(variant) {
        // diameter (m)
        // density (km/m^3)
        // velocity (km/s)
        //
        // Returns kinetic energy (J)
        return variant.density / 2.0 * 4.0 / 3.0 * Math.PI * Math.pow(variant.diameter / 2.0, 3) * Math.pow(variant.velocity, 2) * Math.pow(10, 6);
    }
    kenergy_kttnt_calc(energy) {
        // energy (J)
        //
        // Returns kinetic energy (kt TNT)
        return 2.39 * Math.pow(10, -13) * energy;
    }
    to_string() {
        return `${this.density}-${this.diameter}-${this.angle}-${this.velocity}`;
    }
}
exports.default = Variant;

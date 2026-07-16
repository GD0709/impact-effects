"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MathExt_1 = __importDefault(require("./../../lib/MathExt"));
var Variant_1 = __importDefault(require("../Variant"));
var ShockWaveEffects = /** @class */ (function () {
    function ShockWaveEffects() {
        /*     calc_effect(op: Point): void {
                
                let centered_op = new Point(op.x, op.y - this.zero_point);
                this.overpressure = this.overpressureF(centered_op);
                this.max_wind_speed = this.max_wind_speed_calc();
            } */
        this.heff = 0;
        this.zero_point = 0;
        this.max_value_of_overpressure = 0;
        this.areas_at = new Map();
        this.centered_overpressure_f = function (op) { return 0; };
        this.overpressure_f = function (op) { return 0; };
        this.point_assesment = {
            overpressure: 0,
            max_wind_speed: 0
        };
    }
    ShockWaveEffects.prototype.calc_heff_and_zero_point = function (variant) {
        this.heff = ShockWaveEffects.heff_calc(variant);
        this.zero_point = this.zero_point_calc(variant);
    };
    ShockWaveEffects.prototype.calc_variant = function (variant) {
        var _this = this;
        this.calc_heff_and_zero_point(variant);
        this.max_value_of_overpressure = this.max_value_of_overpressure_calc(variant);
        this.areas_at = this.areas_at_calc(variant);
        this.centered_overpressure_f = this.overpressure_calc(variant);
        this.overpressure_f = function (op) { return _this.centered_overpressure_f({ x: op.x, y: op.y - _this.zero_point }); };
    };
    ShockWaveEffects.prototype.calc_point = function (op) {
        console.log('shockwave updated for point');
        this.point_assesment.overpressure = this.overpressure_f(op);
        this.point_assesment.max_wind_speed = this.max_wind_speed_calc(this.point_assesment.overpressure);
    };
    /*     overpressure: number = 0;
    
        max_wind_speed: number = 0; */
    ShockWaveEffects.heff_calc = function (variant) {
        // diameter (m)
        // density  (kg/m^3)
        // entryAngle (degree)
        //
        // Returns (km)
        var H = 7500;
        var rho_0 = 1.29;
        var res = (H -
            1.3 *
                H *
                Math.log(variant.diameter *
                    Math.sin(MathExt_1.default.deg2rad(variant.angle)) /
                    H *
                    Math.pow(variant.density / rho_0, 2. / 3))) / 1000;
        if (res < 0.1)
            return 0;
        else
            return res;
    };
    ShockWaveEffects.prototype.zero_point_calc = function (variant) {
        var res = (0.33 * (3320. - variant.density) / 2320. + 0.4 * (variant.density - 1000.) / 2320.) *
            Math.pow(this.heff, 1.5) *
            1. / Math.pow(Math.tan(variant.angle_rad), 0.62);
        res = (120000.0 + 100000. * this.heff / Math.pow(variant.diameter, 0.17)) * (-1. + 1. / Math.pow(Math.sin(variant.angle_rad), 0.00005));
        if (this.heff == 0)
            res = 0;
        return res;
    };
    ShockWaveEffects.prototype.max_value_of_overpressure_calc = function (variant) {
        if (this.heff > 0)
            return 0.029 * Math.pow(variant.diameter, 0.98) * Math.pow(variant.velocity, 0.44) * Math.pow(variant.kenergy_kttnt, 0.18) / Math.pow(this.heff, 1.8);
        else
            return NaN;
    };
    ShockWaveEffects.prototype.areas_at_calc = function (variant) {
        var res = new Map();
        if (this.heff <= 0)
            return res;
        var v002 = 0.003 * Math.pow(this.heff, 0.14) * Math.pow(variant.kenergy_kttnt, 0.64) / Math.pow(Math.sin(variant.angle_rad), 0.19);
        var v005 = 0.00009 * Math.pow(this.heff, 0.125) * Math.pow(variant.kenergy_kttnt, 0.87) / Math.pow(Math.sin(variant.angle_rad), 0.51);
        var v01 = 0.00007 * Math.pow(this.heff, 0.15) * Math.pow(variant.kenergy_kttnt, 0.83) * Math.pow(Math.sin(variant.angle_rad), 0.1);
        var v02 = 0.00055 * Math.pow(this.heff, 0.064) * Math.pow(variant.kenergy_kttnt, 0.56) / Math.pow(Math.sin(variant.angle_rad), 0.08);
        var arr = [
            { level: 0.02, value: v002, fix_prev: null, fix_next: null },
            { level: 0.05, value: v005, fix_prev: null, fix_next: null },
            { level: 0.1, value: v01, fix_prev: null, fix_next: null },
            { level: 0.2, value: v02, fix_prev: null, fix_next: null }
        ];
        // arr.sort((o, t) => o.value- t.value)
        var previous = null;
        var min = function (p) { return Math.min.apply(Math, [p.value, p.fix_prev, p.fix_next].filter(function (f) { return f != null; })); };
        var max = function (p) { return Math.max.apply(Math, [p.value, p.fix_prev, p.fix_next].filter(function (f) { return f != null; })); };
        arr.map(function (p) {
            if (previous == null) {
                previous = p;
                return false;
            }
            else {
                console.log(p, "min:", min(p), "max:", max(p), " with ", previous, "min:", min(previous), "max:", max(previous));
                if (min(previous) < min(p)) {
                    previous.fix_next = p.value;
                    p.fix_prev = previous.value;
                }
                previous = p;
            }
        });
        arr.forEach(function (p) { return res.set(p.level, { min: min(p), max: max(p) }); });
        return res;
    };
    ShockWaveEffects.prototype.low_overpressure_calc = function (variant) {
        var _this = this;
        var hetp = MathExt_1.default.interpolate_by_density(0.19 * Math.pow(variant.diameter, 0.4) * Math.pow(Math.sin(variant.angle_rad), 0.32), 0.39 * Math.pow(variant.velocity, 0.26) * Math.pow(Math.sin(variant.angle_rad), 0.26), variant.density);
        var hetn = MathExt_1.default.interpolate_by_density(0.5 * Math.pow(variant.diameter, 0.1), 0.23 + 0.25 * Math.pow(this.heff, 0.37) * Math.pow(Math.sin(variant.angle_rad), 0.52), variant.density);
        var a = 0.0048;
        var pre_res = function (d) { return 1000000.0 * a * Math.pow((Math.pow(variant.kenergy_kttnt, (1. / 3.)) / d), 1.5); };
        return function (op) {
            var r = Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2));
            var phi = Math.atan2(op.y, op.x);
            var hetpORhetn = 0 <= phi && phi < Math.PI ? hetp : hetn;
            var el = 1.0 * hetpORhetn / Math.pow((Math.pow(Math.sin(phi), 2) + Math.pow(hetpORhetn, 2) * Math.pow(Math.cos(phi), 2)), 0.5);
            var d = 1000 * Math.pow((Math.pow(_this.heff, 2) + Math.pow(r, 2)), 0.5);
            var res = el * pre_res(d);
            return res > 0.001 ? res : 0;
        };
    };
    /* low_overpressure_calc(variant: Variant, op: Point): number {
        let r = Math.sqrt(op.x ** 2 + op.y ** 2);
        let phi = Math.atan2(op.y,op.x);
        let hetp = math_ext.interpolate_by_density(0.19 * variant.diameter**0.4 * Math.sin(math_ext.deg2rad(variant.angle))**0.32,
                                      0.39 * variant.velocity**0.26 * Math.sin(math_ext.deg2rad(variant.angle))**0.26,
                                      variant.density);
        let hetn = math_ext.interpolate_by_density(0.5 * variant.diameter**0.1,
                                      0.23 + 0.25 * this.heff**0.37 * Math.sin(math_ext.deg2rad(variant.angle))**0.52,
                                      variant.density);
        let hetpORhetn = 0<= phi && phi< Math.PI ? hetp: hetn;
        let el = 1.0 * hetpORhetn / (Math.sin(phi)**2 + hetpORhetn**2 * Math.cos(phi)**2)**0.5

        let a=0.0048
        let d=1000 * (this.heff**2 + r**2)**0.5

        let res = el * 1000000.0 * a * (variant.kenergy_kttnt**(1./3.) / d)**1.5
        return res > 0 ? res : 0;

    } */
    ShockWaveEffects.prototype.high_overpressure_calc = function (variant) {
        var _this = this;
        var hetl = MathExt_1.default.interpolate_by_density(1.1 * Math.pow(Math.sin(variant.angle_rad), -0.34), 0.56 * Math.pow(Math.sin(variant.angle_rad), -0.27), variant.density);
        var hetp = MathExt_1.default.interpolate_by_density(1.7 * Math.pow(Math.sin(variant.angle_rad), -0.54), 0.84 * Math.pow(Math.sin(variant.angle_rad), -1.2), variant.density);
        var hetn = MathExt_1.default.interpolate_by_density(0.65 + 0.064 * Math.pow(Math.sin(variant.angle_rad), -2.8), 0.44 + 0.0083 * Math.pow(Math.sin(variant.angle_rad), -3.8), variant.density);
        var a = 0.0046 - 0.0004 * Math.log10(variant.kenergy_kttnt);
        var pre_res = function (d) { return 1000000.0 * a * Math.pow((Math.pow(variant.kenergy_kttnt, (1. / 3.)) / d), 1.4); };
        return function (op) {
            var r = Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2));
            var phi = Math.atan2(op.y, op.x);
            var hetpORhetn = 0 <= phi && phi < Math.PI ? hetp : hetn;
            var el = 1.0 * hetl * hetpORhetn / Math.pow((Math.pow(hetl, 2) * Math.pow(Math.sin(phi), 2) + Math.pow(hetpORhetn, 2) * Math.pow(Math.cos(phi), 2)), 0.5);
            var d = 1000 * Math.pow((Math.pow(_this.heff, 2) + Math.pow(r, 2)), 0.5);
            var res = el * pre_res(d);
            return res > 0.001 ? res : 0;
        };
    };
    ShockWaveEffects.prototype.overpressure_to_kPa = function (val) {
        return (val) * 101.325;
    };
    ShockWaveEffects.prototype.overpressure_calc = function (variant) {
        var _this = this;
        var res = function (op) { return 0; };
        if (variant.diameter <= 150)
            res = this.low_overpressure_calc(variant);
        else if (variant.diameter < 300) {
            var var_150_1 = new Variant_1.default("var_150");
            var_150_1._density = variant.density;
            var_150_1._diameter = 150.;
            var_150_1._angle = variant.angle;
            var_150_1._velocity = variant.velocity;
            var_150_1.update_derivatives();
            var var_300_1 = new Variant_1.default("var_300");
            var_300_1._density = variant.density;
            var_300_1._diameter = 300.;
            var_300_1._angle = variant.angle;
            var_300_1._velocity = variant.velocity;
            var_300_1.update_derivatives();
            res = function (op) { return MathExt_1.default.interpolate_by(_this.low_overpressure_calc(var_150_1)(op) + 1, var_150_1.kenergy_kttnt, _this.high_overpressure_calc(var_300_1)(op) + 1, var_300_1.kenergy_kttnt, variant.kenergy_kttnt) - 1; };
        }
        else
            res = this.high_overpressure_calc(variant);
        var check = function (op) {
            var output = res(op);
            if (_this.heff > 0 && variant.diameter <= 150 && output > _this.max_value_of_overpressure)
                output = _this.max_value_of_overpressure;
            return output > 0.001 ? output : 0;
        };
        return check;
    };
    ShockWaveEffects.prototype.max_wind_speed_calc = function (overpressure_atm) {
        var pressure_value = (overpressure_atm + 1.0);
        var gamma = 1.4;
        var value = 330.0 / gamma * (pressure_value - 1) * Math.pow((1 + (gamma + 1) / (2 * gamma) * (pressure_value - 1)), (-0.5));
        return value > 0.1 ? value : 0;
    };
    return ShockWaveEffects;
}());
exports.default = ShockWaveEffects;

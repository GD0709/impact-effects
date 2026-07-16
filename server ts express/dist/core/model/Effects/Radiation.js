"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MathExt_1 = __importDefault(require("./../../lib/MathExt"));
var RadiationEffects = /** @class */ (function () {
    function RadiationEffects() {
        /* calc_effect(op: Point): void {
            
            let centered_op = new Point(op.x, op.y - this.zero_point);
            //console.log(`radiation calc at ${centered_op.to_string()}`);
            this.irradiation = this.irradiationF(centered_op);
            this.irradiation_flux = this.irradiation_fluxF(centered_op);
        }
     */
        this.point_assesment = {
            thermal_exposure: 0,
            thermal_flux: 0
        };
        this.hrad = 0;
        this.eta = 0;
        this.trad = 0;
        this.zero_point = 0;
        this.max_irradiation_energy = 0;
        this.max_irradiation_flux = 0;
        this.centered_irradiation_f = function (op) { return 0; };
        this.irradiation_f = function (op) { return 0; };
        this.centered_irradiation_flux_f = function (op) { return 0; };
        this.irradiation_flux_f = function (op) { return 0; };
    }
    RadiationEffects.prototype.calc_hrad_and_zero_point = function (variant) {
        this.hrad = RadiationEffects.hrad_calc(variant);
        this.zero_point = RadiationEffects.zero_point_calc(variant);
    };
    RadiationEffects.prototype.calc_variant = function (variant) {
        var _this = this;
        this.calc_hrad_and_zero_point(variant);
        this.eta = RadiationEffects.eta_calc(variant);
        this.trad = RadiationEffects.trad_calc(variant);
        this.max_irradiation_energy = RadiationEffects.max_irradiation_energy_calc(variant);
        this.max_irradiation_flux = RadiationEffects.max_irradiation_flux_calc(variant);
        this.centered_irradiation_f = this.irradiation_calc(variant);
        this.irradiation_f = function (op) { return _this.centered_irradiation_f({ x: op.x, y: op.y - _this.zero_point }); };
        this.centered_irradiation_flux_f = this.irradiation_flux_calc(variant);
        this.irradiation_flux_f = function (op) { return _this.centered_irradiation_flux_f({ x: op.x, y: op.y - _this.zero_point }); };
    };
    RadiationEffects.prototype.calc_point = function (op) {
        this.point_assesment.thermal_exposure = this.irradiation_f(op);
        this.point_assesment.thermal_flux = this.irradiation_flux_f(op);
    };
    RadiationEffects.hrad_small = function (variant) {
        //console.log("hrad small");
        var hrad_small_3320 = 3.85 + 1.05 * variant.heff;
        var hrad_small_1000 = 4.09 + 0.95 * variant.heff;
        return MathExt_1.default.interpolate_by(hrad_small_1000, 1000, hrad_small_3320, 3320, variant.density);
    };
    RadiationEffects.hrad_large = function (variant) {
        var hrad_large_1000 = 2700 * Math.pow(variant.kenergy_kttnt, 0.84) / (Math.pow(variant.velocity, 7.5) * Math.pow(Math.sin(variant.angle_rad), 3.8));
        var hrad_large_3320 = 0.8 * Math.pow(variant.kenergy_kttnt, 0.48) / (Math.pow(variant.velocity, 1.5) * Math.pow(Math.sin(variant.angle_rad), 1.5));
        var res = MathExt_1.default.interpolate_by(hrad_large_1000, 1000, hrad_large_3320, 3320, variant.density);
        if (variant.diameter >= 1500 && res > 100)
            res = 100;
        return res;
    };
    RadiationEffects.hrad_calc = function (variant) {
        var res = 0;
        if (variant.diameter <= 150)
            res = RadiationEffects.hrad_small(variant);
        else if (variant.diameter < 300) {
            var var_150 = variant.clone();
            var_150.diameter = 150.;
            var var_300 = variant.clone();
            var_300.diameter = 300.;
            res = MathExt_1.default.interpolate_by(RadiationEffects.hrad_small(var_150) + 1, var_150.kenergy_kttnt, RadiationEffects.hrad_large(var_300) + 1, var_300.kenergy_kttnt, variant.kenergy_kttnt);
        }
        else
            res = RadiationEffects.hrad_large(variant);
        return res > 0 ? (res > 100 ? 100 : res) : 0;
    };
    RadiationEffects.trad_300 = function (variant) {
        return 93000 * Math.pow(variant.kenergy_kttnt, 0.69) * (Math.pow(Math.sin(variant.angle_rad), 0.13)) / (Math.pow(variant.velocity, 5.6));
    };
    RadiationEffects.trad_1000 = function (variant) {
        return MathExt_1.default.interpolate_by_density(1.1 * Math.pow(variant.kenergy_kttnt, 0.33) * (Math.pow(Math.sin(variant.angle_rad), 1.4)), 4.6 * Math.pow(variant.kenergy_kttnt, 0.25) * (Math.pow(Math.sin(variant.angle_rad), 1.2)), variant.density);
    };
    RadiationEffects.trad_small = function (variant) {
        if (variant.density < 2630)
            return MathExt_1.default.interpolate_by(0.01 * Math.pow(variant.heff, 1.77) * Math.pow(variant.kenergy_kttnt, 0.67) * (Math.pow(Math.sin(variant.angle_rad), 0.68) / Math.pow(variant.velocity, 1.55)), 1000, 0.15 * Math.pow(variant.heff, 1.01) * Math.pow(variant.kenergy_kttnt, 0.52) * (Math.pow(Math.sin(variant.angle_rad), 0.37) / Math.pow(variant.velocity, 1.36)), 2630, variant.density);
        else
            return MathExt_1.default.interpolate_by(0.15 * Math.pow(variant.heff, 1.01) * Math.pow(variant.kenergy_kttnt, 0.52) * (Math.pow(Math.sin(variant.angle_rad), 0.37) / Math.pow(variant.velocity, 1.36)), 2630, 0.25 * Math.pow(variant.heff, 0.81) * Math.pow(variant.kenergy_kttnt, 0.45) * (Math.pow(Math.sin(variant.angle_rad), 0.24) / Math.pow(variant.velocity, 1.18)), 3320, variant.density);
    };
    RadiationEffects.trad_calc = function (variant) {
        if (variant.diameter <= 150)
            return RadiationEffects.trad_small(variant);
        else if (variant.diameter <= 300) {
            var var_150 = variant.clone();
            var_150.diameter = 150.;
            var var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt_1.default.interpolate_by(RadiationEffects.trad_small(var_150), 150, RadiationEffects.trad_300(var_300), 300, variant.diameter);
        }
        else if (variant.diameter < 1000) {
            var var_300 = variant.clone();
            var_300.diameter = 300.;
            var var_1000 = variant.clone();
            var_1000.diameter = 1000.;
            return MathExt_1.default.interpolate_by(RadiationEffects.trad_300(var_300), 300, RadiationEffects.trad_1000(var_1000), 1000, variant.diameter);
        }
        else
            return RadiationEffects.trad_1000(variant);
    };
    RadiationEffects.eta_small_calc = function (variant) {
        var res_3320 = 100.0 * 10938.7 * (Math.pow(variant.velocity, 0.56)) * 1.0 / Math.sin(variant.angle_rad) / (Math.pow(variant.kenergy, 0.386));
        var res_1000 = 100.0 * 1225.35 * (Math.pow(variant.velocity, 0.393)) * 1.0 / Math.sin(variant.angle_rad) / (Math.pow(variant.kenergy, 0.3));
        var res = MathExt_1.default.interpolate_by(res_3320, 3320, res_1000, 1000, variant.density);
        if (res >= 100)
            return 100.;
        if (res < 0)
            return 0.;
        return res;
    };
    RadiationEffects.eta_large_calc = function (variant) {
        return 0.021 * Math.pow(variant.diameter, 1.3) * Math.pow(variant.velocity, 1.5) / (Math.pow(variant.kenergy_kttnt, 0.45));
    };
    RadiationEffects.eta_calc = function (variant) {
        if (variant.diameter <= 150)
            return RadiationEffects.eta_small_calc(variant);
        else if (variant.diameter <= 300) {
            var var_150 = variant.clone();
            var_150.diameter = 150.;
            var var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt_1.default.interpolate_by(RadiationEffects.eta_small_calc(var_150), var_150.kenergy_kttnt, RadiationEffects.eta_large_calc(var_300), var_300.kenergy_kttnt, variant.kenergy_kttnt);
        }
        else
            return RadiationEffects.eta_large_calc(variant);
    };
    RadiationEffects.zero_point_small_calc = function (variant) {
        if (variant.diameter < 100)
            return MathExt_1.default.interpolate_by_density(1.08, 1.21, variant.density) * variant.heff / Math.tan(variant.angle_rad);
        else
            return 0.92 * variant.heff / Math.tan(variant.angle_rad);
    };
    RadiationEffects.zero_point_large_calc = function (variant) {
        return 18. + 0.0026 * variant.density - 1.6 * Math.log(variant.kenergy_kttnt);
    };
    RadiationEffects.zero_point_calc = function (variant) {
        if (variant.diameter < 150)
            return RadiationEffects.zero_point_small_calc(variant);
        else if (variant.diameter < 300) {
            var var_150 = variant.clone();
            var_150.diameter = 150.;
            var var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt_1.default.interpolate_by(RadiationEffects.zero_point_small_calc(var_150), var_150.kenergy_kttnt, RadiationEffects.zero_point_large_calc(var_300), var_300.kenergy_kttnt, variant.kenergy_kttnt);
        }
        else
            return RadiationEffects.zero_point_large_calc(variant);
    };
    RadiationEffects.max_irradiation_energy_calc = function (variant) {
        return 1.12 * Math.pow(10, -15) * Math.pow(variant.kenergy, 1.01);
    };
    RadiationEffects.max_irradiation_flux_calc = function (variant) {
        return MathExt_1.default.interpolate_by_density(0.14 * Math.pow(variant.kenergy_kttnt, 0.71), 0.01 * Math.pow(variant.kenergy_kttnt, 0.97), variant.density);
    };
    RadiationEffects.prototype.irradiation_small_calc = function (variant) {
        var _this = this;
        var cos_a = Math.cos(variant.angle_rad);
        var log_ke_kttnt = Math.log(variant.kenergy_kttnt);
        var elp_1000_2630 = MathExt_1.default.interpolate_by(1. + 0.03 * Math.pow(cos_a, 0.03) * log_ke_kttnt, 1000, 1. + 0.13 * Math.pow(cos_a, (4.38 * Math.pow(10, (-9)))) * log_ke_kttnt, 2630, variant.density);
        var elp_2630_3320 = MathExt_1.default.interpolate_by(1. + 0.13 * Math.pow(cos_a, (4.38 * Math.pow(10, (-9)))) * log_ke_kttnt, 2630, 1. - 0.07 * Math.pow(cos_a, 10.98) * log_ke_kttnt, 3320, variant.density);
        var elp = variant.density <= 2630 ? elp_1000_2630 : elp_2630_3320;
        var eln_1000_2630 = MathExt_1.default.interpolate_by(1. + 0.15 * Math.pow(cos_a, 0.75) * log_ke_kttnt, 1000, 1. + 0.12 * Math.pow(cos_a, (6.3 * Math.pow(10, (-11)))) * log_ke_kttnt, 2630, variant.density);
        var eln_2630_3320 = MathExt_1.default.interpolate_by(1. + 0.12 * Math.pow(cos_a, (6.3 * Math.pow(10, (-11)))) * log_ke_kttnt, 2630, 1. + 0.13 * Math.pow(cos_a, 0.015) * log_ke_kttnt, 3320, variant.density);
        var eln = variant.density <= 2630 ? eln_1000_2630 : eln_2630_3320;
        elp = 0.2 < elp && elp < 5 ? elp : 1;
        eln = 0.2 < eln && eln < 5 ? eln : 1;
        return function (op) {
            if (Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2)) <= 1)
                return _this.max_irradiation_energy;
            var el = op.y >= 0 ? elp : eln;
            var res = _this.eta * 4.184 * Math.pow(10, 12) * variant.kenergy_kttnt / (100 * 4 * Math.PI * Math.pow(10, 10) * (Math.pow(_this.hrad, 2) + Math.pow(op.x, 2) + el * Math.pow(op.y, 2)));
            console.log("irradiation result ", res);
            res = res > 0.1 ? res : 0.;
            res = res > _this.max_irradiation_energy ? _this.max_irradiation_energy : res;
            return res;
        };
    };
    RadiationEffects.prototype.irradiation_large_calc = function (variant) {
        var _this = this;
        var cos_scale = 190. * Math.pow(variant.kenergy_kttnt, 0.11) * Math.pow(variant.velocity, 0.11) * Math.pow(Math.sin(variant.angle_rad), 0.43);
        var shorter = (4.184 * Math.pow(10, 12)) / (100 * 4 * Math.PI) * (variant.kenergy_kttnt * this.eta);
        return function (op) {
            if (Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2)) <= 1)
                return _this.max_irradiation_energy;
            var r = Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2));
            var stuff = variant.angle <= 75 ? Math.cos(Math.PI * r / (2 * cos_scale)) : 1;
            var res = shorter * stuff / (Math.pow(10, 10) * (Math.pow(_this.hrad, 2) + Math.pow(r, 2)));
            res = res > 0.1 ? res : 0;
            return res;
        };
    };
    RadiationEffects.prototype.irradiation_calc = function (variant) {
        var _this = this;
        var res = function (op) { return 0; };
        if (variant.diameter <= 150)
            return this.irradiation_small_calc(variant);
        else if (variant.diameter < 300) {
            var var_150_1 = variant.clone();
            var_150_1.diameter = 150.;
            var var_300_1 = variant.clone();
            var_300_1.diameter = 300.;
            return function (op) {
                if (Math.sqrt(Math.pow(op.x, 2) + Math.pow(op.y, 2)) <= 1)
                    return _this.max_irradiation_energy;
                var res = MathExt_1.default.interpolate_by(_this.irradiation_small_calc(var_150_1)(op), var_150_1.kenergy_kttnt, _this.irradiation_large_calc(var_300_1)(op), var_300_1.kenergy_kttnt, variant.kenergy_kttnt);
                return res;
            };
        }
        return this.irradiation_large_calc(variant);
    };
    RadiationEffects.prototype.irradiation_flux_calc = function (variant) {
        var _this = this;
        var csc = 1 / Math.sin(variant.angle_rad);
        var cos = Math.cos(variant.angle_rad);
        var log10 = Math.log10(variant.kenergy);
        var eta_flux = MathExt_1.default.interpolate_by_density(100 * 353607.27 * Math.pow(variant.velocity, 1.42) / Math.pow(variant.kenergy, 0.54) * csc, 100 * 3.44 * Math.pow(10, 6) * Math.pow(variant.velocity, 1.37) / Math.pow(variant.kenergy, 0.61) * csc, variant.density);
        var elp = MathExt_1.default.interpolate_by_density(1 - 0.02 * Math.pow(cos, 0.19) * (-67.21 + log10), 1 - 0.13 * Math.pow(cos, 0.0004) * (-17.09 + log10), variant.density);
        var eln = MathExt_1.default.interpolate_by_density(1 + 3.73 * Math.pow(cos, 1.93) * (-15.71 + log10), 1 + 1.08 * Math.pow(cos, 0.53) * (-15.11 + log10), variant.density);
        if (eln < 0.15 || eln > 3)
            eln = 1;
        var shorter = 1.0 / (400.0 * Math.PI * Math.pow(10, 10)) * (eta_flux * variant.kenergy);
        return function (op) {
            var stuff = op.y >= 0 ? elp : eln;
            var res = shorter / (_this.hrad + Math.pow(op.x, 2) + stuff * Math.pow(op.y, 2));
            res = res > 0.1 ? res : 0;
            res = res > _this.max_irradiation_flux ? _this.max_irradiation_flux : res;
            return res;
        };
    };
    return RadiationEffects;
}());
exports.default = RadiationEffects;

"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var AtmosphericDisturbances = /** @class */ (function () {
    function AtmosphericDisturbances() {
        this.debug = false;
        this.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km = 0;
        this.peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km = 0;
    }
    AtmosphericDisturbances.prototype.log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (this.debug == true)
            console.log.apply(console, __spreadArray(["AtmosphericDisturbances:"], data, false));
    };
    AtmosphericDisturbances.prototype.calc_point = function (variant, op) {
        //let p = op;
        //let r = ((p.x)**2 + (p.y)**2)**0.5;
        this.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km =
            this.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km_calc(variant, op);
        this.peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km = this.alg1_func2(variant, op);
    };
    AtmosphericDisturbances.prototype.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km_calc = function (variant, op) {
        var R = Math.pow((Math.pow((op.x), 2) + Math.pow((op.y), 2)), 0.5);
        var ksi = Math.max(Math.pow(10., -10), Math.log10(variant.diameter / 30. * Math.pow((variant.velocity / 20.), (2. / 3.)) * Math.pow((0.001 * variant.density), (1. / 3.))));
        var Fmax = 1 + 10. * Math.pow(ksi, 0.5);
        var R0 = 1000. + 500. * ksi;
        var value = Fmax * R0 / (R0 + R);
        return value;
    };
    AtmosphericDisturbances.prototype.alg1_func1 = function (variant, R) {
        this.log("Alg1_func1 called with ", variant, " and R=", R);
        var Ek = variant.kenergy_kttnt / 1000.;
        var Ea = Ek * Math.pow(Math.sin(variant.angle_rad), 2);
        this.log("Ek:", Ek);
        this.log("Ea:", Ea);
        var ksi_r = 0;
        var Ka = 0;
        var Kro = 0;
        var ksi_max = 0;
        var R0 = 0;
        if (variant.diameter <= 200) {
            this.log("variant.diameter <= 200:", variant.diameter);
            if (variant.angle < 30) {
                Ka = Math.pow(Math.sin(30. * Math.PI / 180.), 2) / Math.pow(Math.sin(variant.angle_rad), 2);
                Kro = Math.pow((3300. / variant.density), 2);
            }
            else {
                Ka = 1;
                Kro = 1;
            }
            if (Ea >= 40)
                ksi_max = (2. * Math.pow(Ea, 2) + 56 * Ea - 100) * Ka * Kro;
            else if (Ea >= 1)
                ksi_max = Math.pow(10., (1.38 * (Math.pow(Math.log10(Ea), 2) - 0.025))) * Ka * Kro;
            else
                ksi_max = Math.pow(Ea, 0.5) * Ka * Kro;
            var R0_1 = 150;
            var Ylift = 2;
            var Ymax = Math.log10(ksi_max) + Ylift;
            var Ymin = Math.log10(30. * Ea / 140) + Ylift;
            var Ymid = (Ymin + Ymax) / 2.;
            var Delta_mid = 300. * Math.pow(Ea, 0.1);
            var B2 = Math.pow(Delta_mid, 2) / (Math.log(Ymax) - Math.log(Ymid));
            var Y = Ymax * Math.exp(0 - Math.pow((R - R0_1), 2) / B2) - Ylift;
            var ksi_g = Math.pow(10, Y);
            var Rstar = 150;
            var Rminus = -2000;
            var Rplus = 2000;
            var ksi_Rplus = 0;
            var ksi_Rminus = 0;
            var ksi_T = 0;
            if (R > R0_1) {
                ksi_Rplus = 0.13 * Ea * Ka;
                ksi_T = ksi_Rplus * Rplus / R;
            }
            else {
                if (Ea >= 1)
                    ksi_Rminus = (0.0465 * Ea + 0.05) * Ka;
                else
                    ksi_Rminus = 0.1 * Ea * Ka;
                ksi_T = ksi_Rminus * (Rminus - R0_1 - Rstar) / (R - R0_1 - Rstar);
            }
            ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);
        }
        else {
            this.log("variant.diameter > 200:", variant.diameter);
            ksi_max = 523. * Math.pow(Ea, 0.9);
            if (Ea < 2.5 * Math.pow(10, 4))
                R0 = 1.83 * Math.pow(10, 3) * Math.pow(Ea, (-0.167)) - 600;
            else
                R0 = 2.6 * Math.pow(10, 2) * Math.pow(Ea, 0.025) - 600;
            this.log("R0:", R0);
            var Ymin = 2 * Math.log10(variant.diameter) - 4;
            this.log("Ymin:", Ymin);
            var Ymax = Math.log10(ksi_max);
            this.log("Ymax:", Ymax);
            var Ymid = (Ymin + Ymax) / 2;
            var Delta_mid = 390. * Math.pow(Ea, 0.042);
            var B2 = Math.pow(Delta_mid, 2) / (Math.log(Ymax) - Math.log(Ymid));
            this.log("B2:", B2);
            var Y = Ymax * Math.exp(0 - Math.pow((R - R0), 2) / B2);
            this.log("Y:", Y);
            var ksi_g = Math.pow(10, Y);
            var Rstar = 100;
            var Rminus = -2000;
            var Rplus = 2000;
            if (R > R0) {
                this.log("R > R0:", R, ">", R0);
                var b_plus = 1.3 * Math.pow(Ea, 0.096);
                var ksi_Rplus = Math.pow(Ea, 0.615);
                var ksi_T = ksi_Rplus * Math.pow(((Rplus - R0 + Rstar) / (R - R0 + Rstar)), b_plus);
                ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);
                this.log("Y:", Y);
                this.log("Y:", Y);
                this.log("Y:", Y);
                this.log("Y:", Y);
            }
            else {
                var b_minus = 0;
                if (Ea < 8. * Math.pow(10, 3))
                    b_minus = 0.1 * Math.pow(Ea, 0.414);
                else
                    b_minus = 10 * Math.pow(Ea, (-0.095));
                var ksi_Rminus = 0.0023 * Math.pow(Ea, 1.36);
                var ksi_T = ksi_Rminus * Math.pow(((Rminus - R0 - Rstar) / (R - R0 - Rstar)), b_minus);
                ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);
            }
        }
        return ksi_r;
    };
    AtmosphericDisturbances.prototype.alg1_func2 = function (variant, op) {
        var Ek = variant.kenergy_kttnt / 1000.;
        var Ea = Ek * Math.pow(Math.sin(variant.angle_rad), 2);
        var Distance = Math.pow((Math.pow(op.x, 2) + Math.pow(op.y, 2)), 0.5);
        var Teta = Math.atan2(Math.abs(op.y), op.x);
        var R0 = 0;
        if (variant.diameter < 200)
            R0 = 150;
        else {
            if (Ea < 2.5 * Math.pow(10, 4))
                R0 = 1.83 * Math.pow(10, 3) * Math.pow(Ea, (-0.167)) - 600;
            else
                R0 = 2.6 * Math.pow(10, 2) * Math.pow(Ea, 0.025) - 600;
        }
        this.log("atmospheric_disturbances alg1_func2 " + "R0" + ": " + R0);
        var RC = Math.pow((Math.pow((Distance * Math.sin(Teta)), 2) + Math.pow((Distance * Math.cos(Teta) - R0), 2)), 0.5);
        this.log("atmospheric_disturbances alg1_func2 " + "RC" + ": " + RC);
        this.log(R0 + RC);
        this.log(R0 - RC);
        var ksi_1 = this.alg1_func1(variant, R0 - RC);
        var ksi_2 = this.alg1_func1(variant, R0 + RC);
        var gamma = Math.asin(Distance * Math.sin(Teta) / RC) * 180. / Math.PI;
        if (op.x < 0)
            gamma = 180 - gamma;
        this.log("atmospheric_disturbances alg1_func2 " + "gamma" + ": " + gamma);
        var L = Math.PI * RC * gamma / 180.;
        this.log("atmospheric_disturbances alg1_func2 " + "L" + ": " + L);
        var ksi = ksi_2 + (ksi_1 - ksi_2) * (gamma / 180);
        return ksi;
    };
    return AtmosphericDisturbances;
}());
exports.default = AtmosphericDisturbances;

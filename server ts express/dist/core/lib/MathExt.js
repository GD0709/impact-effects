"use strict";
/* declare global {
    interface Math {
        deg2rad(x: Number) : number;
        rad2deg(x: Number) : number;
    }
}



Math.deg2rad = function (x: number) : number {
    return x / 180. * Math.PI;
};

Math.rad2deg = function (x: number) : number {
    return x / Math.PI * 180.;
}; */
Object.defineProperty(exports, "__esModule", { value: true });
var MathExt = /** @class */ (function () {
    function MathExt() {
    }
    MathExt.range = function (start, end, step) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = 10; }
        if (step === void 0) { step = 1; }
        return Array.from({ length: Math.floor((end - start + step) / step) }, function (x, i) { return start + i * step; });
    };
    MathExt.deg2rad = function (angle_degree) {
        return angle_degree / 180. * Math.PI;
    };
    MathExt.point_deg2rad = function (point) {
        return { x: MathExt.deg2rad(point.x), y: MathExt.deg2rad(point.y) };
    };
    MathExt.geopoint_deg2rad = function (point) {
        return { latitude: MathExt.deg2rad(point.latitude), longitude: MathExt.deg2rad(point.longitude) };
    };
    MathExt.rad2deg = function (angle_rad) {
        return angle_rad / Math.PI * 180.;
    };
    MathExt.geopoint_rad2deg = function (point) {
        return { latitude: MathExt.rad2deg(point.latitude), longitude: MathExt.rad2deg(point.longitude) };
    };
    MathExt.interpolate_by_density = function (val1000, val3320, density) {
        return val1000 * (3320. - density) / 2320 + val3320 * (density - 1000.) / 2320;
    };
    MathExt.interpolate_by = function (val1, arg1, val2, arg2, arg) {
        return val1 * (arg2 - arg) / (arg2 - arg1) + val2 * (arg - arg1) / (arg2 - arg1);
    };
    MathExt.round_by_digits = function (real, n) {
        var sgn = real >= 0 ? 1 : -1;
        var absreal = real >= 0 ? real : -real;
        var mult = Math.pow(10., (Math.floor(Math.log10(absreal)) - n + 1));
        return 1. * sgn * mult * Math.round(absreal / mult);
    };
    MathExt.round_decimal_digits_to_string = function (real, after_dot_length) {
        var str = real.toString();
        var dot_pos = str.indexOf('.');
        if (dot_pos < 0)
            return str;
        if (after_dot_length == 0)
            after_dot_length = -1;
        return str.substring(0, dot_pos + 1 + after_dot_length);
    };
    MathExt.round_by_digits_to_string = function (real, n) {
        if (real == 0)
            return "0";
        if (n == 0) {
            var res_1 = Math.round(real).toString();
            var index = res_1.indexOf('.');
            if (index > 0)
                return res_1.substring(0, index);
            else
                return res_1;
        }
        if (n < 0) {
            var res_2 = real.toString();
            var index = res_2.indexOf('.');
            if (index > 0) {
                var count = index + 1 - n;
                if (count > res_2.length)
                    count = res_2.length;
                return res_2.substring(0, count);
            }
            else
                return res_2;
        }
        var sgn = real >= 0 ? 1 : -1;
        var absreal = real >= 0 ? real : -real;
        var power = Math.floor(Math.log10(absreal)) - n + 1;
        var mult = Math.pow(10., (power));
        var res = 1. * sgn * mult * Math.round(absreal / mult);
        var resstring = res.toString();
        var end = resstring.indexOf('.');
        if (end <= 0)
            end = resstring.length;
        else if (power < 0)
            end = end - power + 1;
        else
            end = resstring.length;
        return resstring.substring(0, end);
    };
    MathExt.dimension_prefix_format = function (real, dimension_formatter, n) {
        if (real == 0) {
            return "0 ";
        }
        var real_power = Math.floor(Math.log10(real));
        var rest_power = real_power % 3;
        var power = real_power - rest_power;
        var mult = MathExt.round_by_digits_to_string(real / Math.pow(10, power), n);
        return mult + ' ' + dimension_formatter(power);
    };
    MathExt.power_format = function (real, n) {
        if (real == 0) {
            return { mult: "1", power: "0", power_n: 0, html: "0" };
        }
        var power = Math.floor(Math.log10(real));
        var mult = MathExt.round_by_digits_to_string(real / Math.pow(10, power), n);
        var html = mult;
        if (power != 0)
            html += " * 10<sup>" + power.toString() + "</sup>";
        return { mult: mult, power: power.toString(), power_n: power, html: html };
    };
    MathExt.seconds_to_string = function (s, show_ms) {
        if (show_ms === void 0) { show_ms = false; }
        var local = s;
        var h = Math.floor(local / 3600);
        local = local - 3600 * h;
        var m = Math.floor(local / 60);
        local = local - 60 * m;
        var sec = Math.floor(local);
        var res = h.toString() + ":" + m.toString() + ":" + sec.toString();
        if (show_ms && s.toString().indexOf('.') >= 2) {
            var rest = s.toString().substring(s.toString().indexOf('.') + 1);
            res += "." + rest;
        }
        return res;
    };
    return MathExt;
}());
exports.default = MathExt;

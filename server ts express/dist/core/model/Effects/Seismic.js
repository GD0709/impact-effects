"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Seismic = /** @class */ (function () {
    function Seismic() {
        this.richter_scale_magnitude = 0;
        this.mercally_scale_intensity = 0;
        this.PGV = 0;
        this.PGA = 0;
        this.arrival_time = 0;
        /*  test = function(v, s)
     {
         let res = Ieff_to_string(v);
         if(res == s)
             console.log(v + " pass");
         else console.log(v + ":" +  res +  " != " +  s);
     }
     test(0.9, '-')
     test(1, 'I')
     test(1.1, 'I-II')
     test(1.9, 'I-II')
     test(2, 'II')
     test(2.1, 'II-III')
     test(2.9, 'II-III')
     
     test(3, 'III')
     test(3.1, 'III-IV')
     test(3.9, 'III-IV')
     
     test(4, 'IV')
     test(4.1, 'IV-V')
     test(4.9, 'IV-V')
     
     test(5, 'V')
     test(5.1, 'V-VI')
     test(5.9, 'V-VI')
     
     test(6, 'VI')
     test(6.1, 'VI-VII')
     test(6.9, 'VI-VII')
     
     test(7, 'VII')
     test(7.1, 'VII-VIII')
     test(7.9, 'VII-VIII')
     
     test(8, 'VIII')
     test(8.1, 'VIII-IX')
     test(8.9, 'VIII-IX')
     
     test(9, 'IX')
     test(9.1, 'IX-X')
     test(9.9, 'IX-X')
     
     test(10, 'X')
     test(10.1, 'X-XI')
     test(10.9, 'X-XI')
     
     test(11, 'XI')
     test(11.1, 'XI-XII')
     test(11.9, 'XI-XII')
     
     test(12, 'XII')
     test(12.1, 'unknown')
     test(12.9, 'unknown') */
    }
    Seismic.prototype.calc_point = function (variant, op, overpressure_zero_point) {
        var p = { x: op.x, y: op.y - overpressure_zero_point };
        var r = Math.pow((Math.pow((p.x), 2) + Math.pow((p.y), 2)), 0.5);
        var Θ = 1 - (variant.diameter - Seismic.de) / (Seismic.dc - Seismic.de);
        var C_value = Math.exp(-(4 * Seismic.g * Seismic.H) / (Math.sin(variant.angle_rad) * variant.density * variant.diameter));
        var kseism = 0;
        if (variant.diameter <= Seismic.de)
            kseism = Seismic.kse;
        else if (variant.diameter < Seismic.dc)
            kseism = Seismic.kse * Θ + Seismic.ksc * (1 - Θ) * C_value;
        else if (variant.diameter >= Seismic.dc)
            kseism = Seismic.ksc * C_value;
        kseism = kseism * Math.sin(variant.angle_rad);
        var Eseism = kseism * variant.kenergy;
        var Ms = 2 / 3 * (Math.log10(Eseism) - 4.8);
        var Meff = 0;
        if (r < 60)
            Meff = Ms - 0.0238 * r;
        else if (60 <= r && r < 700)
            Meff = Ms - 0.0048 * r - 1.1644;
        else if (r >= 700)
            Meff = Ms - 1.66 * Math.log10(r);
        var Ieff = 3 / 2 * (Meff - 1);
        var pgv = Ieff > 5 ? (Math.pow(10, (0.288 * Ieff - 0.677))) : (Math.pow(10, (0.476 * Ieff - 1.620)));
        var pga = Ieff > 5 ? (Math.pow(10, (0.27 * Ieff + 0.45))) : (Math.pow(10, (0.45 * Ieff - 0.45)));
        this.richter_scale_magnitude = Ms;
        this.mercally_scale_intensity = Ieff;
        this.PGV = pgv;
        this.PGA = pga;
        this.arrival_time = r / 5;
    };
    Seismic.Ieff_to_string = function (ieff) {
        var precision = 0.05;
        if (ieff < 1 - precision)
            return '-';
        if (ieff < 1 + precision)
            return 'I';
        if (ieff < 2 - precision)
            return 'I-II';
        if (ieff < 2 + precision)
            return 'II';
        if (ieff < 3 - precision)
            return 'II-III';
        if (ieff < 3 + precision)
            return 'III';
        if (ieff < 4 - precision)
            return 'III-IV';
        if (ieff < 4 + precision)
            return 'IV';
        if (ieff < 5 - precision)
            return 'IV-V';
        if (ieff < 5 + precision)
            return 'V';
        if (ieff < 6 - precision)
            return 'V-VI';
        if (ieff < 6 + precision)
            return 'VI';
        if (ieff < 7 - precision)
            return 'VI-VII';
        if (ieff < 7 + precision)
            return 'VII';
        if (ieff < 8 - precision)
            return 'VII-VIII';
        if (ieff < 8 + precision)
            return 'VIII';
        if (ieff < 9 - precision)
            return 'VIII-IX';
        if (ieff < 9 + precision)
            return 'IX';
        if (ieff < 10 - precision)
            return 'IX-X';
        if (ieff < 10 + precision)
            return 'X';
        if (ieff < 11 - precision)
            return 'X-XI';
        if (ieff < 11 + precision)
            return 'XI';
        if (ieff < 12 - precision)
            return 'XI-XII';
        if (ieff < 12 + precision)
            return 'XII';
        return 'unknown';
    };
    Seismic.de = 100;
    Seismic.dc = 300;
    Seismic.H = 8000;
    Seismic.g = 1.3;
    Seismic.kse = Math.pow(10, -5);
    Seismic.ksc = Math.pow(10, -3);
    return Seismic;
}());
exports.default = Seismic;

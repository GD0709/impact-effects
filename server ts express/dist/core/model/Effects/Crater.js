"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crater = exports.CraterTypes = void 0;
var CraterTypes;
(function (CraterTypes) {
    CraterTypes[CraterTypes["simple"] = 1] = "simple";
    CraterTypes[CraterTypes["comples"] = 2] = "comples";
})(CraterTypes || (exports.CraterTypes = CraterTypes = {}));
;
var Crater = /** @class */ (function () {
    function Crater() {
        this.variant = null;
        this.target = null;
        this.diameter_min = 0;
        this.transient_size = 0;
        this.transient_depth = 0;
        this.crater_type = CraterTypes.simple;
        this.final_size = 0;
        this.final_depth = 0;
        this.thickness_of_a_breccia_lens = 0;
        this.melt_volume = 0;
        this.melt_thickness = 0;
        this.ejecta = new Ejecta();
        this.c1 = 0;
        this.u = 0;
    }
    Crater.prototype.calc_point = function (op, overpressure_zero_point) {
        var p = { x: op.x, y: op.y - overpressure_zero_point };
        var s = Math.pow((Math.pow((p.x * 1000), 2) + Math.pow((p.y * 1000), 2)), 0.5);
        this.ejecta.ejecta_thickness = Ejecta.ejecta_thickness(this, s);
        this.ejecta.melted_ejecta_thickness = Ejecta.melted_ejecta_thickness(s);
    };
    Crater.prototype.calc_variant_target = function (variant, target) {
        this.variant = variant;
        this.target = target;
        this.diameter_min = 70. / Math.sin(variant.angle_rad) * Math.pow((3320 / target.target_density), (2. / 3.));
        this.c1 = Math.exp(-2. * Crater.ro_atm * Crater.h_atm / (Math.pow(Math.sin(variant.angle_rad), 2) * variant.density * variant.diameter));
        this.u = this.c1 * (1000 * variant.velocity) * Math.sin(variant.angle_rad);
        var d_tr = variant.diameter * Crater.K1.get(target.target_density) * Math.pow((9.8 * variant.diameter / (2 * Math.pow(this.u, 2)) *
            Math.pow((target.target_density / variant.density), (2 * Crater.NU / Crater.MU.get(target.target_density)))), (-Crater.MU.get(target.target_density) / (2 + Crater.MU.get(target.target_density))));
        this.transient_size = d_tr;
        this.transient_depth = d_tr / 3.;
        this.crater_type = d_tr < 2560 ? CraterTypes.simple : CraterTypes.comples;
        this.final_size = this.crater_type == CraterTypes.simple ? (1.25 * d_tr) : (1.17 * Math.pow(d_tr, 1.13) * Math.pow(Crater.D_STAR, (-0.13)));
        this.final_depth = this.crater_type == CraterTypes.simple ? (0.27 * d_tr) : (400 * Math.pow((this.final_size / 1000), 0.3));
        this.thickness_of_a_breccia_lens = 0.12 * d_tr;
        this.melt_volume = 0.22 * Math.pow(Crater.EM.get(target.target_density), -0.85)
            * variant.density / target.target_density
            * Math.pow(variant.diameter, 3.0)
            * Math.pow((1000 * variant.velocity), 1.7)
            * Math.pow(Math.sin(variant.angle_rad), (1.0 / 3.0));
        this.melt_thickness = 4.0 * this.melt_volume / (Math.PI * Math.pow(this.transient_size, 2));
        this.ejecta.d_min_pr = 70.0 / Math.sin(variant.angle_rad) * Math.pow((3320.0 / target.target_density), (2. / 3.));
    };
    Crater.K1 = new Map([
        [2650, 0.93],
        [1600, 1.03]
    ]);
    Crater.MU = new Map([
        [2650, 0.55],
        [1600, 0.41]
    ]);
    Crater.EM = new Map([
        [2650, 5.2 * Math.pow(10, 6)],
        [1600, 5 * Math.pow(10, 6)]
    ]);
    Crater.D_STAR = 3000; //# m
    Crater.ro_atm = 1.29;
    Crater.h_atm = 7500;
    Crater.NU = 0.4;
    Crater.SAND_C2 = 0.018;
    Crater.SAND_MU = 0.41;
    Crater.ROCK_C2 = 0.054;
    Crater.ROCK_MU = 0.55;
    Crater.GRAV_A = 9.81;
    return Crater;
}());
exports.Crater = Crater;
var Ejecta = /** @class */ (function () {
    function Ejecta() {
        this.d_min_pr = 0;
        this.melted_ejecta_thickness = 0;
        this.ejecta_thickness = 0;
    }
    Ejecta.ejecta_thickness = function (crater, distance_in_meters) {
        if (crater.target == null)
            return 0;
        if (crater.variant == null)
            return 0;
        //let s = ((p.x*1000)**2 + (p.y*1000)**2)**0.5;
        var c2 = Ejecta.C2.get(crater.target.target_density);
        var mu = Crater.MU.get(crater.target.target_density);
        return c2 * mu *
            (Math.pow((crater.variant.density / crater.target.target_density), (3 * Crater.NU))) *
            (Math.pow(crater.variant.diameter, 3)) *
            (Math.pow(Crater.GRAV_A, (-1.5 * mu))) *
            (Math.pow(crater.u, (3 * mu))) *
            (Math.pow(distance_in_meters, (-1.5 * mu - 2)));
    };
    Ejecta.melted_ejecta_thickness = function (distance_in_meters) {
        return Math.min(1, Math.pow((distance_in_meters * Crater.GRAV_A), 0.5) / Math.pow(10, 4));
    };
    Ejecta.C2 = new Map([
        [2650, 0.054],
        [1600, 0.018]
    ]);
    return Ejecta;
}());

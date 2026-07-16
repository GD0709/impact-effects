"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraterForTransients = void 0;
const MathExt_1 = __importDefault(require("../lib/MathExt"));
const Variant_1 = __importDefault(require("../Variant"));
var CraterTypes;
(function (CraterTypes) {
    CraterTypes[CraterTypes["simple"] = 1] = "simple";
    CraterTypes[CraterTypes["comples"] = 2] = "comples";
})(CraterTypes || (CraterTypes = {}));
;
class CraterForTransients {
    constructor() {
        this.variant = null;
        this.target = null;
        this.diameter_min = 0;
        this.transient_size = 0;
        this.transient_depth = 0;
        this.u = 0;
        this.crater_type = CraterTypes.simple;
        this.thickness_of_a_breccia_lens = 0;
        this.melt_volume = 0;
        this.melt_thickness = 0;
        this.final_size = 0;
        this.final_depth = 0;
    }
    calc_variant_target(variant_initial, target) {
        let EkPerEk0_ast = this.calc_EkPerEk0_asteroid(variant_initial.diameter, variant_initial.angle);
        let EkPerEk0_com = this.calc_EkPerEk0_comets(variant_initial.diameter, variant_initial.angle);
        let EkPerEk0 = MathExt_1.default.interpolate_by_density(EkPerEk0_com, EkPerEk0_ast, variant_initial.density);
        let V_final_ast = this.calc_velocity_final_asteroid(variant_initial.diameter, variant_initial.angle, variant_initial.velocity);
        let V_final_com = this.calc_velocity_final_comets(variant_initial.diameter, variant_initial.angle, variant_initial.velocity);
        let V_final = MathExt_1.default.interpolate_by_density(V_final_com, V_final_ast, variant_initial.density);
        let diamter_final_ast = this.calc_diametr_final(variant_initial.diameter, EkPerEk0_ast, V_final_ast, variant_initial.velocity);
        let diamter_final_com = this.calc_diametr_final(variant_initial.diameter, EkPerEk0_com, V_final_com, variant_initial.velocity);
        let diamter_final = MathExt_1.default.interpolate_by_density(diamter_final_com, diamter_final_ast, variant_initial.density);
        let variant_final = new Variant_1.default("final", variant_initial.density, diamter_final, variant_initial.angle, V_final);
        this.variant = variant_final;
        this.target = target;
        this.diameter_min = 70. / Math.sin(this.variant.angle_rad) * (3320 / target.target_density) ** (2. / 3.);
        // this.c1 = Math.exp(
        //     -2. * Crater.ro_atm *  Crater.h_atm / (Math.sin(variant.angle_rad)**2 * variant.density * variant.diameter));
        this.u = (1000 * this.variant.velocity) * Math.sin(this.variant.angle_rad);
        let d_tr = this.variant.diameter * CraterForTransients.K1.get(target.target_density) * (9.8 * this.variant.diameter / (2 * this.u ** 2) *
            (target.target_density / this.variant.density) ** (2 * CraterForTransients.NU / CraterForTransients.MU.get(target.target_density))) ** (-CraterForTransients.MU.get(target.target_density) / (2 + CraterForTransients.MU.get(target.target_density)));
        this.transient_size = d_tr;
        this.transient_depth = d_tr / 3.;
        this.crater_type = d_tr < 2560 ? CraterTypes.simple : CraterTypes.comples;
        this.final_size = this.crater_type == CraterTypes.simple ? (1.25 * d_tr) : (1.17 * d_tr ** 1.13 * CraterForTransients.D_STAR ** (-0.13));
        this.final_depth = this.crater_type == CraterTypes.simple ? (0.27 * d_tr) : (400 * (this.final_size / 1000) ** 0.3);
        this.thickness_of_a_breccia_lens = 0.12 * d_tr;
        this.melt_volume = 0.22 * CraterForTransients.EM.get(target.target_density) ** -0.85
            * this.variant.density / target.target_density
            * this.variant.diameter ** 3.0
            * (1000 * this.variant.velocity) ** 1.7
            * Math.sin(this.variant.angle_rad) ** (1.0 / 3.0);
        this.melt_thickness = 4.0 * this.melt_volume / (Math.PI * this.transient_size ** 2);
        //this.ejecta.d_min_pr = 70.0 / Math.sin(variant.angle_rad) * (3320.0 / target.target_density) ** (2./3.);
        console.log("transient  craters input", this.variant.to_string());
        console.log("transient  craters Ek", EkPerEk0_com, EkPerEk0_ast, EkPerEk0);
        console.log("transient  craters V", V_final_com, V_final_ast, V_final);
        console.log("transient  craters D", diamter_final_com, diamter_final_ast, diamter_final);
        console.log("transient  craters d_tr", d_tr);
    }
    // Конечная скорость
    calc_velocity_final_asteroid(diametr, entryAngle, velocity) {
        let dc = 16 + 2421 / entryAngle;
        let sigma = Math.max(1, -22 + (0.58 - 0.003 * entryAngle) * diametr + 0.5 * entryAngle);
        let model = 0.5 * velocity * (1 + 1 * Math.tanh((diametr - dc) / (sigma)));
        return model;
    }
    calc_velocity_final_comets(diametr, entryAngle, velocity) {
        let dc = 80 + 10000 / entryAngle;
        let sigma = Math.max(1, 102 - 0.6846 * entryAngle + 0.35 * diametr);
        let model = 0.5 * velocity * (1 + 1 * Math.tanh((diametr - dc) / (sigma)));
        return model;
    }
    calc_diametr_final(diametr_initial, EkPerEk0, V_final, V_initial) {
        if (V_final > 1) {
            return diametr_initial * Math.pow(EkPerEk0 * V_initial ** 2 / (V_final ** 2), 1 / 3);
        }
        else {
            return 0.;
        }
    }
    // EkPerEk0
    calc_EkPerEk0_asteroid(diametr, entryAngle) {
        let k = 0.5 * (1.15 - 0.0019 * entryAngle);
        let DC = Math.log(30 + 7500 / entryAngle);
        let sigma = 0.6 + 0.0024 * entryAngle;
        let n = (0.31 + 0.018 * entryAngle - 0.00023 * (entryAngle ** 2)) / 1000.;
        let model = k * (1 + 1 * Math.tanh((Math.log(diametr) - DC) / (sigma + diametr * n)));
        console.log("calc_EkPerEk0_asteroid ", k, DC, sigma, n, model);
        return model;
    }
    calc_EkPerEk0_comets(diametr, entryAngle) {
        let k = 0.5 * (1.2 + 0.006 * entryAngle);
        let DC = Math.log(5.37 * entryAngle + 26600 / entryAngle - 10.5);
        let sigma = 0.3 - 0.0031 * entryAngle;
        let n = (0.045 * entryAngle - 0.34) / 1000.;
        let model = k * (1 + 1 * Math.tanh((Math.log(diametr) - DC) / (sigma + diametr * n)));
        console.log("calc_EkPerEk0_comets ", k, DC, sigma, n, model);
        return model;
    }
}
exports.CraterForTransients = CraterForTransients;
CraterForTransients.K1 = new Map([
    [2650, 0.93],
    [1600, 1.03]
]);
CraterForTransients.MU = new Map([
    [2650, 0.55],
    [1600, 0.41]
]);
CraterForTransients.EM = new Map([
    [2650, 5.2 * 10 ** 6],
    [1600, 5 * 10 ** 6]
]);
CraterForTransients.D_STAR = 3000; //# m
CraterForTransients.ro_atm = 1.29;
CraterForTransients.h_atm = 7500;
CraterForTransients.NU = 0.4;
CraterForTransients.SAND_C2 = 0.018;
CraterForTransients.SAND_MU = 0.41;
CraterForTransients.ROCK_C2 = 0.054;
CraterForTransients.ROCK_MU = 0.55;
CraterForTransients.GRAV_A = 9.81;

import MathExt from "../../lib/MathExt";
import { IPoint } from "../Geometry";
import Target from '../Target';
import Variant from "../Variant";
import { ITargetEffectAssesment } from "./EffectsAssessment";


class CraterForTransients implements ITargetEffectAssesment {
  
    calc_variant_target(variant_initial: Variant, target: Target): void {


        let EkPerEk0_ast = this.calc_EkPerEk0_asteroid(variant_initial.diameter, variant_initial.angle)
        let EkPerEk0_com = this.calc_EkPerEk0_comets(variant_initial.diameter, variant_initial.angle)
        let EkPerEk0 = MathExt.interpolate_by_density(EkPerEk0_com, EkPerEk0_ast, variant_initial.density);

        let V_final_ast = this.calc_velocity_final_asteroid(variant_initial.diameter, variant_initial.angle, variant_initial.velocity);
        let V_final_com = this.calc_velocity_final_comets(variant_initial.diameter, variant_initial.angle, variant_initial.velocity);
        let V_final = MathExt.interpolate_by_density(V_final_com, V_final_ast, variant_initial.density);

        let diamter_final_ast = this.calc_diametr_final(variant_initial.diameter, EkPerEk0_ast, V_final_ast, variant_initial.velocity);
        let diamter_final_com = this.calc_diametr_final(variant_initial.diameter, EkPerEk0_com, V_final_com, variant_initial.velocity);
        let diamter_final = MathExt.interpolate_by_density(diamter_final_com, diamter_final_ast, variant_initial.density);


        let variant_final: Variant = new Variant("final", variant_initial.density, diamter_final, variant_initial.angle, V_final)

        this.variant = variant_final;
        this.target = target;


        this.diameter_min = 70./ Math.sin(this.variant.angle_rad) * (3320 / target.target_density) ** (2./3.);

        // this.c1 = Math.exp(
        //     -2. * Crater.ro_atm *  Crater.h_atm / (Math.sin(variant.angle_rad)**2 * variant.density * variant.diameter));

        this.u = (1000 * this.variant.velocity) * Math.sin(this.variant.angle_rad);
        let d_tr = this.variant.diameter * <number>CraterForTransients.K1.get(target.target_density) * (
            9.8 * this.variant.diameter / (2 * this.u ** 2) *
            (target.target_density / this.variant.density) ** (2 * CraterForTransients.NU / <number>CraterForTransients.MU.get(target.target_density))
        ) ** (-<number>CraterForTransients.MU.get(target.target_density) / (2 + <number>CraterForTransients.MU.get(target.target_density)))

        this.transient_size = d_tr;
        this.transient_depth = d_tr /3.;
        // this.crater_type = d_tr < 2560 ? CraterTypes.simple : CraterTypes.comples;

        // this.final_size = this.crater_type == CraterTypes.simple ? (1.25 * d_tr): (1.17 * d_tr ** 1.13 * Crater.D_STAR ** (-0.13));
        // this.final_depth = this.crater_type == CraterTypes.simple ? (0.27* d_tr) : (400 * (this.final_size/1000)**0.3);
        // this.thickness_of_a_breccia_lens = 0.12* d_tr;
        // this.melt_volume = 0.22 * (<number>Crater.EM.get(target.target_density))**-0.85 
        //     * variant.density/target.target_density 
        //     * variant.diameter **3.0 
        //     * (1000*variant.velocity)**1.7 
        //     * Math.sin(variant.angle_rad)**(1.0/3.0);

        // this.melt_thickness = 4.0 * this.melt_volume/(Math.PI * this.transient_size ** 2);

        // this.ejecta.d_min_pr = 70.0 / Math.sin(variant.angle_rad) * (3320.0 / target.target_density) ** (2./3.);


        console.log("transient  craters input", this.variant.to_string())
        console.log("transient  craters Ek", EkPerEk0_com, EkPerEk0_ast, EkPerEk0)
        console.log("transient  craters V", V_final_com, V_final_ast, V_final)
        console.log("transient  craters D", diamter_final_com, diamter_final_ast, diamter_final)
        console.log("transient  craters d_tr", d_tr)
    }

    variant: Variant | null = null;
    target: Target | null = null;


    static K1: Map<number, number> = new Map<number, number>([
        [2650, 0.93],
        [1600, 1.03]
    ]);
    static MU: Map<number, number> = new Map<number, number>([
        [2650, 0.55],
        [1600, 0.41]
    ]);
    static EM: Map<number, number> = new Map<number, number>([
        [2650, 5.2 * 10 ** 6],
        [1600, 5 * 10 ** 6]
    ]);

    static D_STAR = 3000; //# m
    static ro_atm = 1.29;
    static h_atm = 7500;
    static NU = 0.4;
    static SAND_C2 = 0.018;
    static SAND_MU = 0.41;
    static ROCK_C2 = 0.054;
    static ROCK_MU = 0.55;
    static GRAV_A = 9.81;


    diameter_min: number = 0;
    transient_size: number = 0;
    transient_depth: number = 0;
    u: number = 0;


    // Конечная скорость
    calc_velocity_final_asteroid(diametr: number, entryAngle: number, velocity: number): number {
        let dc = 16 + 2421 / entryAngle;
        let sigma = Math.max(1, -22 + (0.58 - 0.003 * entryAngle) * diametr + 0.5 * entryAngle);

        let model = 0.5 * velocity * (1 + 1 * Math.tanh((diametr - dc) / (sigma)));
        return model;
    }
    calc_velocity_final_comets(diametr: number, entryAngle: number, velocity: number): number {
        let dc = 80 + 10000 / entryAngle;
        let sigma = Math.max(1, 102 - 0.6846 * entryAngle + 0.35 * diametr);

        let model = 0.5 * velocity * (1 + 1 * Math.tanh((diametr - dc) / (sigma)));
        return model;
    }
    calc_diametr_final(diametr_initial: number, EkPerEk0: number, V_final: number, V_initial: number): number {
        if (V_final > 1) {
            return diametr_initial * Math.pow(EkPerEk0 * V_initial**2/(V_final**2), 1/3)
        } else {
            return 0.;
        }
    }

    // EkPerEk0
    calc_EkPerEk0_asteroid(diametr: number, entryAngle: number): number {
        let k = 0.5 * (1.15 - 0.0019 * entryAngle);
        let DC = Math.log(30 + 7500 / entryAngle);
        let sigma = 0.6 + 0.0024 * entryAngle;
        let n = (0.31 + 0.018 * entryAngle - 0.00023 * (entryAngle ** 2)) / 1000.;

        let model = k * (1 + 1 * Math.tanh((Math.log(diametr) - DC) / (sigma + diametr * n)))
        console.log("calc_EkPerEk0_asteroid ", k, DC, sigma, n, model);
        return model;
    }
    calc_EkPerEk0_comets(diametr: number, entryAngle: number): number {
        let k = 0.5 * (1.2 + 0.006 * entryAngle);
        let DC = Math.log(5.37 * entryAngle + 26600 / entryAngle - 10.5);
        let sigma = 0.3 - 0.0031 * entryAngle;
        let n = (0.045 * entryAngle - 0.34) / 1000.

        let model = k * (1 + 1 * Math.tanh((Math.log(diametr) - DC) / (sigma + diametr * n)))
        console.log("calc_EkPerEk0_comets ", k, DC, sigma, n, model);
        return model;
    }

}
export {CraterForTransients}
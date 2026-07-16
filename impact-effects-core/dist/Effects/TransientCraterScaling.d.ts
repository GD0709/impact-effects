import Target from '../Target';
import Variant from "../Variant";
import { ITargetEffectAssesment } from "./EffectsAssessment";
declare enum CraterTypes {
    simple = 1,
    comples = 2
}
declare class CraterForTransients implements ITargetEffectAssesment {
    calc_variant_target(variant_initial: Variant, target: Target): void;
    variant: Variant | null;
    target: Target | null;
    static K1: Map<number, number>;
    static MU: Map<number, number>;
    static EM: Map<number, number>;
    static D_STAR: number;
    static ro_atm: number;
    static h_atm: number;
    static NU: number;
    static SAND_C2: number;
    static SAND_MU: number;
    static ROCK_C2: number;
    static ROCK_MU: number;
    static GRAV_A: number;
    diameter_min: number;
    transient_size: number;
    transient_depth: number;
    u: number;
    crater_type: CraterTypes;
    thickness_of_a_breccia_lens: number;
    melt_volume: number;
    melt_thickness: number;
    final_size: number;
    final_depth: number;
    calc_velocity_final_asteroid(diametr: number, entryAngle: number, velocity: number): number;
    calc_velocity_final_comets(diametr: number, entryAngle: number, velocity: number): number;
    calc_diametr_final(diametr_initial: number, EkPerEk0: number, V_final: number, V_initial: number): number;
    calc_EkPerEk0_asteroid(diametr: number, entryAngle: number): number;
    calc_EkPerEk0_comets(diametr: number, entryAngle: number): number;
}
export { CraterForTransients };

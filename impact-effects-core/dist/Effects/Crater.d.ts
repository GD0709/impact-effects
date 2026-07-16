import { IPoint } from "../Geometry";
import Target from '../Target';
import Variant from "../Variant";
import { ITargetEffectAssesment } from "./EffectsAssessment";
declare enum CraterTypes {
    simple = 1,
    comples = 2
}
declare class Crater implements ITargetEffectAssesment {
    calc_point(op: IPoint, overpressure_zero_point: number): void;
    calc_variant_target(variant: Variant, target: Target): void;
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
    crater_type: CraterTypes;
    final_size: number;
    final_depth: number;
    thickness_of_a_breccia_lens: number;
    melt_volume: number;
    melt_thickness: number;
    ejecta: Ejecta;
    c1: number;
    u: number;
}
declare class Ejecta {
    d_min_pr: number;
    melted_ejecta_thickness: number;
    ejecta_thickness: number;
    static C2: Map<number, number>;
    static ejecta_thickness(crater: Crater, distance_in_meters: number): number;
    static melted_ejecta_thickness(distance_in_meters: number): number;
}
export { CraterTypes, Crater };

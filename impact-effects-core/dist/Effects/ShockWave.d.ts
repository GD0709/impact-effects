import { IPoint } from "../Geometry";
import Variant from "../Variant";
import { IEffectAssesment, IPointEffectAssesment } from "./EffectsAssessment";
export default class ShockWaveEffects implements IEffectAssesment, IPointEffectAssesment {
    calc_heff_and_zero_point(variant: Variant): void;
    calc_variant(variant: Variant): void;
    calc_point(op: IPoint): void;
    heff: number;
    zero_point: number;
    max_value_of_overpressure: number;
    areas_at: Map<number, {
        min: number;
        max: number;
    }>;
    centered_overpressure_f: (op: IPoint) => number;
    overpressure_f: (op: IPoint) => number;
    point_assesment: {
        overpressure: number;
        max_wind_speed: number;
    };
    static heff_calc(variant: Variant): number;
    zero_point_calc(variant: Variant): number;
    max_value_of_overpressure_calc(variant: Variant): number;
    areas_at_calc(variant: Variant): Map<number, {
        min: number;
        max: number;
    }>;
    low_overpressure_calc(variant: Variant): (op: IPoint) => number;
    high_overpressure_calc(variant: Variant): (op: IPoint) => number;
    overpressure_to_kPa(val: number): number;
    overpressure_calc(variant: Variant): (op: IPoint) => number;
    max_wind_speed_calc(overpressure_atm: number): number;
}

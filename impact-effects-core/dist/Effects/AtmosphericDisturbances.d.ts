import { IPoint } from "../Geometry";
import Variant from "../Variant";
export default class AtmosphericDisturbances {
    debug: boolean;
    log(...data: any[]): void;
    calc_point(variant: Variant, op: IPoint): void;
    peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km_calc(variant: Variant, op: IPoint): number;
    alg1_func1(variant: Variant, R: number): number;
    alg1_func2(variant: Variant, op: IPoint): number;
    peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km: number;
    peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km: number;
}

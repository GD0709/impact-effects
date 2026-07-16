import { IPoint } from "../Geometry";
import Variant from "../Variant";
export default class Seismic {
    calc_point(variant: Variant, op: IPoint, overpressure_zero_point: number): void;
    static de: number;
    static dc: number;
    static H: number;
    static g: number;
    static kse: number;
    static ksc: number;
    richter_scale_magnitude: number;
    mercally_scale_intensity: number;
    PGV: number;
    PGA: number;
    arrival_time: number;
    static Ieff_to_string(ieff: number): string;
}

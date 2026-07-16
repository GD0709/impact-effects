import { Point } from "./Geometry";
import Variant from "./Variant";
declare enum ZeroPoints {
    entry_point_100km = 1,
    max_overpressure_point = 2,
    surface_intersection = 3,
    max_thermal_effect_point = 4
}
declare class ObservationPointInput extends Point {
    debug: boolean;
    log(...data: any[]): void;
    main_point: Point;
    variant: Variant;
    constructor(main_point: Point, variant: Variant);
    main_point_changed(s: Point, passed: string[]): void;
    set_from_derivative(x: number, y: number, passed: string[]): void;
    _relative_to: ZeroPoints;
    get relative_to(): ZeroPoints;
    set relative_to(relative_to: ZeroPoints);
    shift_y: number;
    update_shift(passed: string[]): Promise<void>;
    along_across: ObservationPointAlongAcross;
    distance_angle: ObservationPointDistanceAngle;
}
declare class ObservationPointAlongAcross {
    private input;
    constructor(input: ObservationPointInput);
    name: string;
    get along(): number;
    set along(val: number);
    get across(): number;
    set across(val: number);
}
declare class ObservationPointDistanceAngle {
    private input;
    constructor(input: ObservationPointInput);
    name: string;
    get distance(): number;
    set distance(val: number);
    static fix_quartile(angle_rad: number): number;
    static calc_angle(point: Point): number;
    get angle(): number;
    set angle(val: number);
}
export { ObservationPointInput, ObservationPointAlongAcross, ObservationPointDistanceAngle, ZeroPoints };

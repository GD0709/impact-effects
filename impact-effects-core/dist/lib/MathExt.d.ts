export default class MathExt {
    static range(start?: number, end?: number, step?: number): ReadonlyArray<number>;
    static deg2rad(angle_degree: number): number;
    static point_deg2rad(point: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    static geopoint_deg2rad(point: {
        latitude: number;
        longitude: number;
    }): {
        latitude: number;
        longitude: number;
    };
    static rad2deg(angle_rad: number): number;
    static geopoint_rad2deg(point: {
        latitude: number;
        longitude: number;
    }): {
        latitude: number;
        longitude: number;
    };
    static interpolate_by_density(val1000: number, val3320: number, density: number): number;
    static interpolate_by(val1: number, arg1: number, val2: number, arg2: number, arg: number): number;
    static round_by_digits(real: number, n: number): number;
    static round_decimal_digits_to_string(real: number, after_dot_length: number): string;
    static round_by_digits_to_string(real: number, n: number): string;
    static dimension_prefix_format(real: number, dimension_formatter: (power: number) => string, n: number): string;
    static power_format(real: number, n: number): {
        mult: string;
        power: string;
        power_n: number;
        html: string;
    };
    static seconds_to_string(s: number, show_ms?: boolean): string;
}

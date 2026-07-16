import { type IEmitter, type INotifyChanged } from "./lib/Events";
interface IPoint {
    x: number;
    y: number;
}
interface IGeoPoint extends INotifyChanged<IGeoPoint> {
    latitude: number;
    longitude: number;
    set(latitude: number, longitude: number, passed: string[]): void;
}
declare class Point implements INotifyChanged<Point>, IPoint {
    constructor(name: string, x?: number, y?: number);
    protected _x: number;
    protected _y: number;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    name: string;
    set(x: number, y: number, passed: string[]): boolean;
    private readonly on_changed;
    get changed(): IEmitter<Point>;
    fire_changed(passed: string[]): void;
    to_string(): string;
}
declare class Vector extends Point {
    constructor(name: string, x?: number, y?: number, angle?: number);
    protected _angle: number;
    get angle(): number;
    set angle(angle: number);
    set_vector(x: number, y: number, azimuth: number, passed: string[]): void;
}
declare class GeoPoint implements INotifyChanged<IGeoPoint>, IGeoPoint {
    constructor(name: string, latitude?: number, longitude?: number);
    name: string;
    protected _latitude: number;
    protected _longitude: number;
    get latitude(): number;
    set latitude(latitude: number);
    get longitude(): number;
    set longitude(longitude: number);
    set(latitude: number, longitude: number, passed: string[]): void;
    private readonly on_changed;
    get changed(): IEmitter<GeoPoint>;
    fire_changed(passed: string[]): void;
    to_string(): string;
}
declare class GeoVector extends GeoPoint {
    constructor(name: string, latitude?: number, longitude?: number, azimuth?: number);
    private _azimuth;
    get azimuth(): number;
    set azimuth(azimuth: number);
    set_vector(latitude: number, longitude: number, azimuth: number, passed: string[]): void;
}
declare class GeoMath {
    static calc_distance(view_point: {
        latitude: number;
        longitude: number;
    }, //view point coordinates (radians)
    target_point: {
        latitude: number;
        longitude: number;
    }): number;
    static Earth_radius: number;
    /** in dec */
    static coords_by_distance_azimuth(view_point: {
        latitude: number;
        longitude: number;
    }, //view point coordinates (dec)
    distance: number, // distance to the target point (meters)
    bearing: number): {
        latitude: number;
        longitude: number;
    };
    static final_bearing_to(view_point: {
        latitude: number;
        longitude: number;
    }, //view point coordinates (dec)
    target_point: {
        latitude: number;
        longitude: number;
    }): number;
    static initial_bearing_to(view_point: {
        latitude: number;
        longitude: number;
    }, //view point coordinates (dec)
    target_point: {
        latitude: number;
        longitude: number;
    }): number;
}
declare class Transform extends Vector {
    constructor(name: string, x?: number, y?: number, angle?: number, mx?: number, my?: number);
    protected _mx: number;
    get mx(): number;
    set mx(mx: number);
    protected _my: number;
    get my(): number;
    set my(my: number);
    set_zoom(m: number, passed: string[]): void;
    set_transform(x: number, y: number, azimuth: number, mx: number, my: number, passed: string[]): void;
    convert_to(p: Point): {
        x: number;
        y: number;
    };
    convert_from(p: Point): {
        x: number;
        y: number;
    };
}
export { Point, Vector, GeoPoint, GeoVector, Transform, GeoMath };
export type { IPoint, IGeoPoint };

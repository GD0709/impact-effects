
import { Emitter, IEmitter, INotifyChanged } from "../lib/Events";
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';


interface IPoint {
    x: number;
    y: number;
}

interface IGeoPoint extends INotifyChanged<IGeoPoint> {
    latitude: number;
    longitude: number;
    set(latitude: number, longitude: number, passed:string[]): void
}
class Point implements INotifyChanged<Point>, IPoint {
    constructor(name: string, x?:number, y?: number)
    {
        this._x = x ?? 0;
        this._y = y ?? 0;
        this.name = name;
    }
    protected _x: number = 0;
    protected _y: number = 0;

    get x():number {return this._x;} set x(x: number) { this._x = 1.*x; this.fire_changed([]); }
    get y():number {return this._y;} set y(y: number) { this._y = 1.*y; this.fire_changed([]); }
    name: string;


    public set(x: number, y: number, passed:string[]): boolean {

        if (!passed.includes(this.name) && (this.x != x || this.y != y))
        {
            console.log(this.name, " set ", x,", ", y," passed:", passed);
            this._x = 1.*x;
            this._y = 1.*y;
            this.fire_changed(passed.concat(this.name));
            
            return true;
        }
        return false;
    }

    private readonly on_changed = new Emitter<Point>();
    get changed(): IEmitter<Point> {
        return this.on_changed;
    }

    public fire_changed(passed: string[]): void {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    }

    to_string():string {
        return `{x: ${this.x}, y:${this.y}}`;
    }
}
class Vector extends Point {
    constructor(name: string, x?:number, y?: number, angle?: number)
    {
        super(name, x, y);
        this._angle = angle ?? 0;
    }
    protected _angle: number = 0;
    get angle():number {return this._angle;} set angle(angle: number) { this._angle = 1.*angle; this.fire_changed([]); }

    set_vector(x:number, y: number, azimuth: number, passed: string[]): void{

        console.log(this.name, " set ", x,", ", y,", azimuth", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._x != x || this._y != y|| this._angle != azimuth))
        {
            this._x = 1.*x;
            this._y = 1.*y;
            this._angle = 1.*azimuth;
            passed.push(this.name);
            this.fire_changed(passed);
        }
    }
}


class GeoPoint implements INotifyChanged<IGeoPoint>, IGeoPoint {
    constructor(name: string, latitude?:number, longitude?: number)
    {
        this.name = name;
        this._latitude = latitude ?? 0;
        this._longitude = longitude ?? 0;
    }
    name: string;
    protected _latitude: number = 0;
    protected _longitude: number = 0;

    get latitude():number {return this._latitude;} set latitude(latitude: number) { this._latitude = 1.*latitude; this.fire_changed([]); }
    get longitude():number {return this._longitude;} set longitude(longitude: number) { this._longitude = 1.*longitude; this.fire_changed([]); }

    set(latitude:number, longitude: number, passed: string[]): void
    {
        console.log(this.name, " set ", latitude,", ", longitude, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude))
        {
            this._latitude = latitude;
            this._longitude = longitude;
            this.fire_changed(passed);
        }
    }

    private readonly on_changed = new Emitter<GeoPoint>();
    get changed(): IEmitter<GeoPoint> {
        return this.on_changed;
    }

    public fire_changed(passed: string[]): void {
        passed.push(this.name);
        this.on_changed.trigger(this, passed);
    }

    to_string():string {
        return `${this.name} {latitude: ${this.latitude}, longitude:${this.longitude}}`;
    }
}
class GeoVector extends GeoPoint {
    constructor(name: string, latitude?:number, longitude?: number, azimuth?: number)
    {
        super(name, latitude, longitude);
        this._azimuth = azimuth ?? 0;
    }
    private _azimuth: number = 0;
    get azimuth():number {return this._azimuth;} set azimuth(azimuth: number) { this._azimuth = 1.*azimuth; this.fire_changed([]); }

    set_vector(latitude:number, longitude: number, azimuth: number, passed: string[]): void{
        console.log(this.name, " set ", latitude,", ", longitude,", azimuth:", azimuth, " passed:", passed);
        if (!passed.includes(this.name) && (this._latitude != latitude || this._longitude != longitude|| this._azimuth != azimuth))
        {
            this._latitude = latitude;
            this._longitude = longitude;
            this._azimuth = azimuth;
            this.fire_changed(passed);
        }
    }
}

class GeoMath{

    public static calc_distance(
        view_point: {latitude: number, longitude: number}, //view point coordinates (radians)
        target_point: {latitude: number, longitude: number} //target point coordinates (radians)
    ): number {
        
        const p1 = new LatLon(view_point.latitude, view_point.longitude);
        const p2 = new LatLon(target_point.latitude, target_point.longitude);
        let dist2 = p1.distanceTo(p2);
        return dist2/1000;
    }


    public static Earth_radius: number = 6371; // km.

    // public static azimuth_calc(
    //     view_point: {latitude: number, longitude: number}, //view point coordinates (radians)
    //     target_point: {latitude: number, longitude: number} //target point coordinates (radians)
    //     ): number{

    //     let l = target_point.longitude - view_point.longitude;
    //     let alpha = Math.atan2(
    //         Math.sin(l) * Math.cos(target_point.latitude),
    //         (Math.cos(view_point.latitude) * Math.sin(target_point.latitude) - Math.sin(view_point.latitude) * Math.cos(target_point.latitude) * Math.cos(l))
    //     );
    //     return (alpha + 2 * Math.PI) % (2 * Math.PI);
    // }

    /** in dec */
    public static coords_by_distance_azimuth(
        view_point: {latitude: number, longitude: number}, //view point coordinates (dec)
        distance: number, // distance to the target point (meters)
        bearing: number // azimuth from the view point to the target point (dec)
    ): {latitude: number, longitude: number}
    {
        let p1 = new LatLon(view_point.latitude, view_point.longitude);
        let p2 = p1.destinationPoint(distance, bearing);
        return {latitude: p2.latitude, longitude: p2.longitude};
    }

    public static final_bearing_to(
        view_point: {latitude: number, longitude: number}, //view point coordinates (dec)
        target_point: {latitude: number, longitude: number} 
    ): number {
        let p1 = new LatLon(view_point.latitude, view_point.longitude);
        let p2 = new LatLon(target_point.latitude, target_point.longitude);
        return p1.finalBearingTo(p2);
    }
    public static initial_bearing_to(
        view_point: {latitude: number, longitude: number}, //view point coordinates (dec)
        target_point: {latitude: number, longitude: number} 
    ): number {
        let p1 = new LatLon(view_point.latitude, view_point.longitude);
        let p2 = new LatLon(target_point.latitude, target_point.longitude);
        return p1.initialBearingTo(p2);
    }
    
}


class Transform extends Vector {
    constructor(name: string, x?:number, y?: number, angle?: number, mx?: number, my?: number)
    {
        super(name, x, y, angle);
        this._mx = mx ?? 1;
        this._my = my ?? 1;
    }

    protected _mx: number = 0;
    get mx():number {return this._mx;} set mx(mx: number) { this._mx = 1.*mx; this.fire_changed([]); }
    protected _my: number = 0;
    get my():number {return this._my;} set my(my: number) { this._my = 1.*my; this.fire_changed([]); }

    set_zoom(m: number, passed: string[])
    {
        this._mx = 1.*m;
        this._my = 1.*m;
        this.fire_changed(passed);
    }
    
    set_transform(x:number, y: number, azimuth: number, mx:number, my: number, passed: string[]): void{
        if(this._x != x || this._y != y || this._angle != azimuth ||this._mx != mx || this._my != my)
        {
            this._x = 1.*x;
            this._y = 1.*y;
            this._angle = 1.*azimuth;
            this._mx = 1.*mx;
            this._my = 1.*my;
            //if(silent === false)
            this.fire_changed(passed);
        }
    }

    convert_to(p: Point): {x:number, y: number}{
        //console.log('changed ', p.to_string());

        let x = p.x;
        let y = p.y;

        x = x * this.mx;
        y = y * this.my;
        let r = (x**2 + y**2)**0.5;
        let a = Math.atan2(y,x);
        //console.log('angle: ', a / Math.PI * 180);
        x = r * Math.cos(-this.angle * Math.PI / 180 + a);
        y = r * Math.sin(-this.angle * Math.PI / 180 + a);
        //console.log('changed 2', x, ' ', y);
        x = x + this.x;
        y = y - this.y;
        //console.log('changed 3', x, ' ', y);
        return {x,y};
    }

    convert_from(p: Point):{x:number, y: number}{
        //console.log('changed back ', p.to_string());
        let x = p.x;
        let y = p.y;

        x = x - this.x;
        y = y + this.y;
        //console.log('changed back 2', x, ' ', y);
        let r = (x**2 + y**2)**0.5;
        let a = Math.atan2(y,x);
        x = r * Math.cos(a+this.angle * Math.PI / 180);
        y = r * Math.sin(a+this.angle * Math.PI / 180);
        
        x = x / this.mx;
        y = y / this.my;
        //console.log('changed 3', x, ' ', y);
        return {x,y};
    }
}


export { Point, Vector, GeoPoint, GeoVector, Transform, GeoMath };
export type { IPoint, IGeoPoint };

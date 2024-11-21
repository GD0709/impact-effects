import { INotifyChanged, IEmitter, Emitter } from './../lib/Events';
import ShockWaveEffects from './Effects/ShockWave';

export default class Variant implements INotifyChanged<Variant> {

    constructor(name: string, density?: number, diameter?: number, angle?: number, velocity?: number){
        this.name = name;
        this._density = density??3320;
        this._diameter = diameter??19;
        this._angle = angle??18;
        this._velocity = velocity??19;
        this.update_derivatives();
    }

    clone():Variant {
        let res = new Variant(this.name);
        res._diameter = this.diameter;
        res._density = this.density;
        res._angle = this.angle;
        res._velocity = this.velocity;
        return res;
    } 
    name: string;
    private readonly on_changed = new Emitter<Variant>();
    get changed(): IEmitter<Variant> {
        return this.on_changed;
    }

    public fire_changed(passed: string[]): void {
        passed.push(this.name);
        this.update_derivatives();
        this.on_changed.trigger(this, passed);
    }

    _velocity: number = 19.16;
    get velocity() : number { return this._velocity; } set velocity(value: number) { this._velocity = value; this.fire_changed([]); }

    _angle: number = 18;
    get angle() : number { return this._angle; } set angle(value: number) { this._angle = value; this.fire_changed([]); }

    _density: number = 3320;
    get density() : number { return this._density; } set density(value: number) { this._density = value; this.fire_changed([]); }

    _diameter: number = 19;
    get diameter() : number { return this._diameter; } set diameter(value: number) { this._diameter = value; this.fire_changed([]); }

    
    update_derivatives() {

        this.angle_rad = this.angle * Math.PI/180;
        this.kenergy = this.kenergy_calc(this);
        this.kenergy_kttnt = this.kenergy_kttnt_calc(this.kenergy);
        this.heff = ShockWaveEffects.heff_calc(this);
    }
 
    angle_rad: number = 0;
    kenergy: number = 0;
    

    kenergy_kttnt: number = 0;
    
    heff: number = 0;

    kenergy_calc(variant: Variant) : number {
        // diameter (m)
        // density (km/m^3)
        // velocity (km/s)
        //
        // Returns kinetic energy (J)
        return variant.density / 2.0 * 4.0 / 3.0 * Math.PI * Math.pow(variant.diameter/2.0, 3) * Math.pow(variant.velocity, 2) * Math.pow(10, 6);
    }

    kenergy_kttnt_calc(energy: number): number {
        // energy (J)
        //
        // Returns kinetic energy (kt TNT)
        return 2.39 * Math.pow(10, -13) * energy;
    }

    to_string()
    {
        return `${this.density}-${this.diameter}-${this.angle}-${this.velocity}`
    }
}
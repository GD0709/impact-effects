import MathExt from "./../../lib/MathExt";
import { IPoint } from "../Geometry";
import Variant from "../Variant";
import { IEffectAssesment, IPointEffectAssesment } from "./EffectsAssessment";

export default class ShockWaveEffects implements IEffectAssesment, IPointEffectAssesment 
{

    calc_heff_and_zero_point(variant: Variant): void {
        this.heff = ShockWaveEffects.heff_calc(variant);
        this.zero_point = this.zero_point_calc(variant);
    }
    calc_variant(variant: Variant): void {
        
        this.calc_heff_and_zero_point(variant);
        this.max_value_of_overpressure = this.max_value_of_overpressure_calc(variant);
        this.areas_at = this.areas_at_calc(variant);
        this.centered_overpressure_f = this.overpressure_calc(variant);
        this.overpressure_f = op => this.centered_overpressure_f({x: op.x, y: op.y - this.zero_point});
    }
    calc_point(op: IPoint): void {
        console.log('shockwave updated for point');
        this.point_assesment.overpressure = this.overpressure_f(op);
        this.point_assesment.max_wind_speed = this.max_wind_speed_calc(this.point_assesment.overpressure);
    }    

/*     calc_effect(op: Point): void {
        
        let centered_op = new Point(op.x, op.y - this.zero_point);
        this.overpressure = this.overpressureF(centered_op);
        this.max_wind_speed = this.max_wind_speed_calc();
    } */


    heff: number = 0;

    zero_point: number = 0;

    max_value_of_overpressure: number = 0;

    areas_at: Map<number, {min: number, max:number}> = new Map<number, {min: number, max:number}>();
    
    centered_overpressure_f: (op: IPoint) => number = op => 0;
    overpressure_f:(op: IPoint) => number = op => 0;

    point_assesment = {
        overpressure: 0,
        max_wind_speed: 0
    }

/*     overpressure: number = 0;

    max_wind_speed: number = 0; */

    static heff_calc(variant: Variant): number {
        // diameter (m)
        // density  (kg/m^3)
        // entryAngle (degree)
        //
        // Returns (km)
        let H=7500;
        let rho_0 =1.29;
        let res = (
            H -
            1.3 *
            H *
            Math.log(
                variant.diameter *
                Math.sin(MathExt.deg2rad(variant.angle)) /
                H *
                Math.pow(variant.density / rho_0, 2. / 3)
            )
        ) / 1000;
        if(res < 0.1) return 0;
        else return res;
    }

    zero_point_calc(variant: Variant): number {
        let res = ( 0.33*(3320.-variant.density)/2320. + 0.4 * (variant.density - 1000.)/2320.) * 
            Math.pow(this.heff, 1.5) * 
            1./Math.pow(Math.tan(variant.angle_rad), 0.62);

        res = (120000.0 + 100000. * this.heff / variant.diameter ** 0.17) * (-1. + 1./Math.sin(variant.angle_rad)**0.00005)
        if(this.heff == 0)
            res = 0;
        return res;
    }

    max_value_of_overpressure_calc(variant: Variant): number {
        if(this.heff > 0)
            return 0.029 * variant.diameter ** 0.98 * variant.velocity ** 0.44 * variant.kenergy_kttnt ** 0.18 / this.heff ** 1.8
        else return NaN;
    }

    areas_at_calc(variant: Variant): Map<number, {min: number, max: number}> {
        let res = new Map<number, {min: number, max: number}>();
        if(this.heff <= 0) return res;

        let v002 = 0.003 * this.heff**0.14 * variant.kenergy_kttnt**0.64 / Math.sin(variant.angle_rad)**0.19
        let v005 = 0.00009 * this.heff**0.125 * variant.kenergy_kttnt**0.87 / Math.sin(variant.angle_rad)**0.51
        let v01 = 0.00007 * this.heff**0.15 * variant.kenergy_kttnt**0.83 * Math.sin(variant.angle_rad)**0.1
        let v02 = 0.00055 * this.heff**0.064 * variant.kenergy_kttnt**0.56 / Math.sin(variant.angle_rad)**0.08

        let arr = [
            {level: 0.02, value: v002, fix_prev: null, fix_next: null},
            {level: 0.05, value: v005, fix_prev: null, fix_next: null},
            {level: 0.1, value: v01, fix_prev: null, fix_next: null},
            {level: 0.2, value: v02, fix_prev: null, fix_next: null}];
        // arr.sort((o, t) => o.value- t.value)
        
        let previous:any = null;
        let min = (p:any) => Math.min(...[p.value, p.fix_prev, p.fix_next].filter(f => f != null));
        let max = (p:any) => Math.max(...[p.value, p.fix_prev, p.fix_next].filter(f => f != null));

       arr.map(p => {
            if(previous == null)
            {
                previous = p;
                return false;
            }
            else
            {
                console.log(p, "min:", min(p), "max:", max(p), " with ", previous, "min:", min(previous), "max:", max(previous))
                if(min(previous) < min(p))
                {
                    previous.fix_next = p.value;
                    p.fix_prev = previous.value;
                }
                previous = p;
            }   
        
        })
        

        arr.forEach(p => res.set(p.level, {min: min(p), max: max(p)}));
        
        return res;
    }

    low_overpressure_calc(variant: Variant) : (op: IPoint) => number{
        let hetp = MathExt.interpolate_by_density(0.19 * variant.diameter**0.4 * Math.sin(variant.angle_rad)**0.32,
                                      0.39 * variant.velocity**0.26 * Math.sin(variant.angle_rad)**0.26,
                                      variant.density);
        let hetn = MathExt.interpolate_by_density(0.5 * variant.diameter**0.1,
                                      0.23 + 0.25 * this.heff**0.37 * Math.sin(variant.angle_rad)**0.52,
                                      variant.density);

        let a=0.0048;
        let pre_res = (d:number):number => 1000000.0 * a * (variant.kenergy_kttnt**(1./3.) / d)**1.5;

        return (op: IPoint) => {
            let r = Math.sqrt(op.x ** 2 + op.y ** 2);
            let phi = Math.atan2(op.y,op.x);
            let hetpORhetn = 0<= phi && phi< Math.PI ? hetp: hetn;
            let el = 1.0 * hetpORhetn / (Math.sin(phi)**2 + hetpORhetn**2 * Math.cos(phi)**2)**0.5
            let d=1000 * (this.heff**2 + r**2)**0.5;
            let res = el * pre_res(d);
            return res > 0.001 ? res : 0;
        }
    }

    /* low_overpressure_calc(variant: Variant, op: Point): number {
        let r = Math.sqrt(op.x ** 2 + op.y ** 2);
        let phi = Math.atan2(op.y,op.x);
        let hetp = math_ext.interpolate_by_density(0.19 * variant.diameter**0.4 * Math.sin(math_ext.deg2rad(variant.angle))**0.32,
                                      0.39 * variant.velocity**0.26 * Math.sin(math_ext.deg2rad(variant.angle))**0.26,
                                      variant.density);
        let hetn = math_ext.interpolate_by_density(0.5 * variant.diameter**0.1,
                                      0.23 + 0.25 * this.heff**0.37 * Math.sin(math_ext.deg2rad(variant.angle))**0.52,
                                      variant.density);
        let hetpORhetn = 0<= phi && phi< Math.PI ? hetp: hetn;
        let el = 1.0 * hetpORhetn / (Math.sin(phi)**2 + hetpORhetn**2 * Math.cos(phi)**2)**0.5

        let a=0.0048
        let d=1000 * (this.heff**2 + r**2)**0.5

        let res = el * 1000000.0 * a * (variant.kenergy_kttnt**(1./3.) / d)**1.5
        return res > 0 ? res : 0;

    } */
    high_overpressure_calc(variant: Variant): (op: IPoint) => number {



        
        let hetl = MathExt.interpolate_by_density(1.1 * Math.sin(variant.angle_rad)**-0.34,
                                                   0.56 * Math.sin(variant.angle_rad)**-0.27,
                                                   variant.density);
        let hetp = MathExt.interpolate_by_density(1.7 * Math.sin(variant.angle_rad)**-0.54,
                                                    0.84 * Math.sin(variant.angle_rad)**-1.2,
                                                    variant.density);
        let hetn = MathExt.interpolate_by_density(0.65 + 0.064* Math.sin(variant.angle_rad)**-2.8,
                                                    0.44+0.0083 * Math.sin(variant.angle_rad)**-3.8,
                                                    variant.density);
        let a=0.0046 - 0.0004 * Math.log10(variant.kenergy_kttnt);

        let pre_res = (d:number):number => 1000000.0 * a * (variant.kenergy_kttnt**(1./3.) / d)**1.4;

        return (op: IPoint) => {
            let r = Math.sqrt(op.x ** 2 + op.y ** 2);
            let phi = Math.atan2(op.y,op.x);

            let hetpORhetn = 0<= phi && phi< Math.PI ? hetp: hetn;
            let el = 1.0 * hetl* hetpORhetn / (hetl**2 * Math.sin(phi)**2 + hetpORhetn**2 * Math.cos(phi)**2)**0.5;

            
            
            let d=1000 * (this.heff**2 + r**2)**0.5

            let res = el * pre_res(d);
            return res > 0.001 ? res : 0;
        }

    }

    overpressure_to_kPa(val: number): number {
        return (val) * 101.325;
    }

    overpressure_calc(variant: Variant): (op: IPoint) => number {
        let res = (op:IPoint) => 0;

        

        if(variant.diameter <= 150)
            res = this.low_overpressure_calc(variant);
        else if (variant.diameter < 300)
        {
            let var_150 = new Variant("var_150");
            var_150._density = variant.density;
            var_150._diameter = 150.;
            var_150._angle = variant.angle;
            var_150._velocity = variant.velocity;
            var_150.update_derivatives();

            let var_300 = new Variant("var_300");
            var_300._density = variant.density;
            var_300._diameter = 300.;
            var_300._angle = variant.angle;
            var_300._velocity = variant.velocity;
            var_300.update_derivatives();

            res = (op: IPoint) => MathExt.interpolate_by(this.low_overpressure_calc(var_150)(op) + 1, var_150.kenergy_kttnt, this.high_overpressure_calc(var_300)(op) + 1, var_300.kenergy_kttnt, variant.kenergy_kttnt) - 1;
        }
        else res = this.high_overpressure_calc(variant);


        let check = (op: IPoint) => {
            let output = res(op);
            if(this.heff > 0 && variant.diameter <= 150 && output > this.max_value_of_overpressure)
                output = this.max_value_of_overpressure;
            return output > 0.001 ? output : 0;
        };

        return check;
    }


     max_wind_speed_calc(overpressure_atm: number) : number {
        let pressure_value=(overpressure_atm+1.0);
        let gamma=1.4;
        let value= 330.0/gamma * (pressure_value -1) * (1+(gamma + 1)/(2*gamma) * (pressure_value-1))**(-0.5);
        return value > 0.1 ? value : 0;
    } 
}
import { IPoint } from "../Geometry";
import Target from '../Target';
import Variant from "../Variant";
import { ITargetEffectAssesment } from "./EffectsAssessment";

enum CraterTypes {simple = 1, comples = 2};
class Crater implements ITargetEffectAssesment
{
    calc_point(op: IPoint, overpressure_zero_point: number): void {
        let p = {x: op.x, y: op.y - overpressure_zero_point};
        let s = ((p.x*1000)**2 + (p.y*1000)**2)**0.5;
        this.ejecta.ejecta_thickness = Ejecta.ejecta_thickness(this, s);
        this.ejecta.melted_ejecta_thickness = Ejecta.melted_ejecta_thickness(s);

    }

    calc_variant_target(variant: Variant, target: Target): void {
        this.variant = variant;
        this.target = target;

        this.diameter_min = 70./ Math.sin(variant.angle_rad) * (3320 / target.target_density) ** (2./3.);

        this.c1 = Math.exp(
            -2. * Crater.ro_atm *  Crater.h_atm / (Math.sin(variant.angle_rad)**2 * variant.density * variant.diameter));

        this.u = this.c1 * (1000 * variant.velocity) * Math.sin(variant.angle_rad);
        let d_tr = variant.diameter * <number>Crater.K1.get(target.target_density) * (
            9.8 * variant.diameter / (2 * this.u ** 2) *
            (target.target_density / variant.density) ** (2 * Crater.NU / <number>Crater.MU.get(target.target_density))
        ) ** (-<number>Crater.MU.get(target.target_density) / (2 + <number>Crater.MU.get(target.target_density)))

        this.transient_size = d_tr;
        this.transient_depth = d_tr /3.;
        this.crater_type = d_tr < 2560 ? CraterTypes.simple : CraterTypes.comples;

        this.final_size = this.crater_type == CraterTypes.simple ? (1.25 * d_tr): (1.17 * d_tr ** 1.13 * Crater.D_STAR ** (-0.13));
        this.final_depth = this.crater_type == CraterTypes.simple ? (0.27* d_tr) : (400 * (this.final_size/1000)**0.3);
        this.thickness_of_a_breccia_lens = 0.12* d_tr;
        this.melt_volume = 0.22 * (<number>Crater.EM.get(target.target_density))**-0.85 
            * variant.density/target.target_density 
            * variant.diameter **3.0 
            * (1000*variant.velocity)**1.7 
            * Math.sin(variant.angle_rad)**(1.0/3.0);

        this.melt_thickness = 4.0 * this.melt_volume/(Math.PI * this.transient_size ** 2);

        this.ejecta.d_min_pr = 70.0 / Math.sin(variant.angle_rad) * (3320.0 / target.target_density) ** (2./3.);

        
        

    }

    variant: Variant|null = null;
    target: Target|null = null;
   

    static K1:Map<number, number> = new Map<number, number>([
        [2650, 0.93],
        [1600, 1.03]
    ]);
    static MU:Map<number, number> =  new Map<number, number>([
        [2650, 0.55],
        [1600, 0.41]
    ]);
    static EM:Map<number, number> = new Map<number, number>([
        [2650, 5.2 * 10**6],
        [1600, 5*10**6]
    ]);

    static D_STAR = 3000; //# m
    static ro_atm = 1.29;
    static h_atm = 7500;
    static NU = 0.4;
    static SAND_C2 = 0.018;
    static SAND_MU = 0.41;
    static ROCK_C2 = 0.054;
    static ROCK_MU = 0.55;
    static GRAV_A = 9.81;

    diameter_min: number = 0;
    transient_size: number = 0;
    transient_depth: number = 0;

    crater_type: CraterTypes = CraterTypes.simple;

    final_size: number = 0;
    final_depth: number = 0;
    thickness_of_a_breccia_lens: number = 0;
    melt_volume: number = 0;
    melt_thickness: number = 0;

    ejecta: Ejecta = new  Ejecta();



    c1: number = 0;
    u: number = 0;

}
class Ejecta {
    d_min_pr: number = 0;
    melted_ejecta_thickness: number = 0;
    ejecta_thickness: number = 0;

    static C2:Map<number, number> = new Map<number, number>([
        [2650, 0.054],
        [1600, 0.018]
    ]);

    static ejecta_thickness(crater: Crater, distance_in_meters: number)
    {
        if(crater.target == null) return 0;
        if(crater.variant == null) return 0;
        //let s = ((p.x*1000)**2 + (p.y*1000)**2)**0.5;
        let c2 =<number>Ejecta.C2.get(crater.target.target_density); 
        let mu = <number>Crater.MU.get(crater.target.target_density); 

        return c2 * mu * 
            ((crater.variant.density / crater.target.target_density) ** (3 * Crater.NU)) * 
            (crater.variant.diameter ** 3) *
            (Crater.GRAV_A ** (-1.5 * mu)) * 
            (crater.u ** (3 * mu)) * 
            (distance_in_meters ** (-1.5 * mu - 2));
    }

    static melted_ejecta_thickness(distance_in_meters: number)
    {        
        return Math.min(1, (distance_in_meters * Crater.GRAV_A) ** 0.5 / 10**4);
    }

}

export {CraterTypes, Crater}
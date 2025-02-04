import MathExt from "./../../lib/MathExt";
import { IPoint, Point } from "../Geometry";
import Variant from "../Variant";
import { IEffectAssesment } from "./EffectsAssessment";




export default class RadiationEffects implements IEffectAssesment {
    calc_hrad_and_zero_point(variant: Variant): void {        
        this.hrad = RadiationEffects.hrad_calc(variant);
        this.zero_point = RadiationEffects.zero_point_calc(variant);
    }
    calc_variant(variant: Variant): void {
        this.calc_hrad_and_zero_point(variant);
        this.eta = RadiationEffects.eta_calc(variant);
        this.trad = RadiationEffects.trad_calc(variant);
        this.max_irradiation_energy = RadiationEffects.max_irradiation_energy_calc(variant);
        this.max_irradiation_flux = RadiationEffects.max_irradiation_flux_calc(variant);

        this.centered_irradiation_f = this.irradiation_calc(variant);
        this.irradiation_f = op => this.centered_irradiation_f({x: op.x, y: op.y - this.zero_point});

        this.centered_irradiation_flux_f = this.irradiation_flux_calc(variant);
        this.irradiation_flux_f = op => this.centered_irradiation_flux_f({x: op.x, y: op.y - this.zero_point});
    }
    calc_point(op: IPoint): void {
        this.point_assesment.thermal_exposure = this.irradiation_f(op);
        this.point_assesment.thermal_flux = this.irradiation_flux_f(op);
    }    

    /* calc_effect(op: Point): void {
        
        let centered_op = new Point(op.x, op.y - this.zero_point);
        //console.log(`radiation calc at ${centered_op.to_string()}`);
        this.irradiation = this.irradiationF(centered_op);
        this.irradiation_flux = this.irradiation_fluxF(centered_op);
    }
 */
    point_assesment = {
        thermal_exposure: 0,
        thermal_flux: 0
    }


    hrad: number = 0;

    eta: number = 0;

    trad:number = 0;

    zero_point:number = 0;
    max_irradiation_energy : number = 0;
    max_irradiation_flux : number = 0;


    centered_irradiation_f: (op: IPoint) => number = op => 0;
    irradiation_f:(op: IPoint) => number = op => 0;

    centered_irradiation_flux_f: (op: IPoint) => number = op => 0;
    irradiation_flux_f:(op: IPoint) => number = op => 0;


    static hrad_small(variant: Variant): number {
        //console.log("hrad small");
        let hrad_small_3320 = 3.85 + 1.05 * variant.heff
        let hrad_small_1000 = 4.09 + 0.95 * variant.heff
        return MathExt.interpolate_by(
            hrad_small_1000,
            1000,
            hrad_small_3320,
            3320,
            variant.density,
        )
    }

    static hrad_large(variant: Variant): number {
        let hrad_large_1000 = 2700 * variant.kenergy_kttnt ** 0.84 / (variant.velocity ** 7.5 * Math.sin(variant.angle_rad) ** 3.8)
        let hrad_large_3320 = 0.8 * variant.kenergy_kttnt ** 0.48 / (variant.velocity ** 1.5 * Math.sin(variant.angle_rad) ** 1.5)
        let res =  MathExt.interpolate_by(
            hrad_large_1000,
            1000,
            hrad_large_3320,
            3320,
            variant.density,
        );
        if(variant.diameter >= 1500 && res >100) res = 100;
        return res;
    }

    static hrad_calc(variant: Variant): number {
        let res = 0;
        if(variant.diameter <= 150)
            res = RadiationEffects.hrad_small(variant);
        else if (variant.diameter < 300)
        {
            let var_150 = variant.clone();
            var_150.diameter = 150.;

            let var_300 = variant.clone();
            var_300.diameter = 300.;

            res = MathExt.interpolate_by(RadiationEffects.hrad_small(var_150) + 1, var_150.kenergy_kttnt, RadiationEffects.hrad_large(var_300) + 1, var_300.kenergy_kttnt, variant.kenergy_kttnt);
        }
        else res = RadiationEffects.hrad_large(variant);
        return res > 0 ? (res > 100 ? 100 : res) : 0;
    }
    

    static trad_300(variant: Variant): number {
        return 93000 * variant.kenergy_kttnt ** 0.69 * (Math.sin(variant.angle_rad) ** 0.13) / (variant.velocity ** 5.6)
    }
    static trad_1000(variant: Variant): number {
        return MathExt.interpolate_by_density(
            1.1 * variant.kenergy_kttnt ** 0.33 * (Math.sin(variant.angle_rad) ** 1.4),
            4.6 * variant.kenergy_kttnt ** 0.25 * (Math.sin(variant.angle_rad) ** 1.2),
            variant.density);
    }

    static trad_small(variant: Variant): number {
        if(variant.density < 2630)
            return MathExt.interpolate_by(
                0.01 * variant.heff**1.77 * variant.kenergy_kttnt ** 0.67 * (Math.sin(variant.angle_rad) ** 0.68 / variant.velocity**1.55), 1000,
                0.15 * variant.heff**1.01 * variant.kenergy_kttnt ** 0.52 * (Math.sin(variant.angle_rad) ** 0.37 / variant.velocity**1.36), 2630,
                variant.density);
        else
            return MathExt.interpolate_by(
            0.15 * variant.heff**1.01 * variant.kenergy_kttnt ** 0.52 * (Math.sin(variant.angle_rad) ** 0.37 / variant.velocity**1.36), 2630,
            0.25 * variant.heff**0.81 * variant.kenergy_kttnt ** 0.45 * (Math.sin(variant.angle_rad) ** 0.24 / variant.velocity**1.18), 3320,
            variant.density);
    }
    static trad_calc(variant:Variant): number {
        if(variant.diameter <= 150) return RadiationEffects.trad_small(variant);
        else if(variant.diameter <= 300)
        {
            let var_150 = variant.clone();
            var_150.diameter = 150.;

            let var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt.interpolate_by(RadiationEffects.trad_small(var_150), 150,
                                            RadiationEffects.trad_300(var_300), 300,
                                            variant.diameter);
        }
        else if(variant.diameter < 1000)
        {
            let var_300 = variant.clone();
            var_300.diameter = 300.;

            let var_1000 = variant.clone();
            var_1000.diameter = 1000.;
            return MathExt.interpolate_by(RadiationEffects.trad_300(var_300), 300,
                                            RadiationEffects.trad_1000(var_1000), 1000,
                                            variant.diameter);
        }
        else return RadiationEffects.trad_1000(variant);
    }

    static eta_small_calc(variant: Variant): number {
        let res_3320 = 100.0 * 10938.7 * (variant.velocity ** 0.56) * 1.0 /Math.sin(variant.angle_rad) / (variant.kenergy ** 0.386)
        let res_1000 = 100.0 * 1225.35 * (variant.velocity ** 0.393) * 1.0 /Math.sin(variant.angle_rad) / (variant.kenergy ** 0.3)
        let res = MathExt.interpolate_by(
            res_3320,
            3320,
            res_1000,
            1000,
            variant.density
        )
        if (res >= 100)
            return 100.
        if (res < 0)
            return 0.
        return res;        
    }
    static eta_large_calc(variant: Variant): number {
        return 0.021 * variant.diameter ** 1.3 * variant.velocity ** 1.5 / (variant.kenergy_kttnt ** 0.45)
    }
    static eta_calc(variant:Variant): number {
        if(variant.diameter <= 150) return RadiationEffects.eta_small_calc(variant);
        else if(variant.diameter <= 300)
        {
            let var_150 = variant.clone();
            var_150.diameter = 150.;

            let var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt.interpolate_by(RadiationEffects.eta_small_calc(var_150), var_150.kenergy_kttnt,
                                            RadiationEffects.eta_large_calc(var_300), var_300.kenergy_kttnt,
                                            variant.kenergy_kttnt);
        }
        else return RadiationEffects.eta_large_calc(variant);
    }



    static zero_point_small_calc(variant: Variant): number {
        if(variant.diameter < 100)
            return MathExt.interpolate_by_density(1.08,1.21, variant.density) * variant.heff / Math.tan(variant.angle_rad);
        else return 0.92 * variant.heff/Math.tan(variant.angle_rad);
    }
    static zero_point_large_calc(variant: Variant): number {
        return 18. + 0.0026 * variant.density - 1.6 * Math.log(variant.kenergy_kttnt);
    }
    static zero_point_calc(variant: Variant): number {
        if(variant.diameter < 150)
            return RadiationEffects.zero_point_small_calc(variant);
        else if(variant.diameter < 300)
        {
            let var_150 = variant.clone();
            var_150.diameter = 150.;

            let var_300 = variant.clone();
            var_300.diameter = 300.;
            return MathExt.interpolate_by(RadiationEffects.zero_point_small_calc(var_150), var_150.kenergy_kttnt,
                                            RadiationEffects.zero_point_large_calc(var_300), var_300.kenergy_kttnt,
                                            variant.kenergy_kttnt);
        }
        else return RadiationEffects.zero_point_large_calc(variant);
    }

    static max_irradiation_energy_calc(variant: Variant): number {
        return 1.12 * 10**-15 * variant.kenergy**1.01;
    }

    static max_irradiation_flux_calc(variant: Variant): number {
        return MathExt.interpolate_by_density( 0.14 * variant.kenergy_kttnt ** 0.71, 0.01 * variant.kenergy_kttnt ** 0.97, variant.density);
    }

    irradiation_small_calc(variant: Variant): (op: IPoint) => number {

        let cos_a = Math.cos(variant.angle_rad);
        let log_ke_kttnt = Math.log(variant.kenergy_kttnt);

        let elp_1000_2630 = MathExt.interpolate_by(1. + 0.03 * cos_a ** 0.03 * log_ke_kttnt, 1000,
                                        1. + 0.13 * cos_a ** (4.38 * 10 ** (-9)) * log_ke_kttnt, 2630,
                                        variant.density);
        let elp_2630_3320 = MathExt.interpolate_by(1. + 0.13 * cos_a ** (4.38 * 10 ** (-9)) * log_ke_kttnt, 2630,
                                        1. - 0.07 * cos_a ** 10.98 * log_ke_kttnt, 3320,
                                        variant.density);

        let elp = variant.density <= 2630 ? elp_1000_2630 :  elp_2630_3320;


        let eln_1000_2630 = MathExt.interpolate_by(1. + 0.15 * cos_a ** 0.75 * log_ke_kttnt, 1000,
                                       1. + 0.12 * cos_a ** (6.3 * 10 ** (-11)) * log_ke_kttnt, 2630,
                                       variant.density);
        let eln_2630_3320 = MathExt.interpolate_by(1. + 0.12 * cos_a ** (6.3 * 10 ** (-11)) * log_ke_kttnt, 2630,
                                       1. + 0.13 * cos_a ** 0.015 * log_ke_kttnt, 3320,
                                       variant.density);


        let eln = variant.density <= 2630 ? eln_1000_2630 : eln_2630_3320;

        elp = 0.2 < elp && elp < 5 ? elp : 1;
        eln = 0.2 < eln && eln < 5 ? eln : 1;



        return (op: IPoint): number => {
            if (Math.sqrt(op.x**2 + op.y**2)<=1) return this.max_irradiation_energy;
            let el = op.y >= 0 ? elp : eln;
            let res =  this.eta * 4.184 * 10 ** 12 * variant.kenergy_kttnt / (100*4 * Math.PI * 10**10 * (this.hrad**2 + op.x**2 + el * op.y**2))
            console.log("irradiation result ", res);
            res =  res > 0.1 ? res : 0.;
            res = res > this.max_irradiation_energy ? this.max_irradiation_energy : res
            return res
        }
    }

    irradiation_large_calc(variant: Variant): (op: IPoint) => number {

        
        let cos_scale = 190. * variant.kenergy_kttnt ** 0.11 * variant.velocity ** 0.11 * Math.sin(variant.angle_rad) ** 0.43;
        let shorter = (4.184*10**12) / (100*4 * Math.PI) * (variant.kenergy_kttnt * this.eta);

        return (op: IPoint): number => {
            if (Math.sqrt(op.x**2 + op.y**2)<=1) return this.max_irradiation_energy;

            let r = Math.sqrt(op.x**2 + op.y**2);
            let stuff = variant.angle <= 75 ? Math.cos(Math.PI * r / (2 * cos_scale)): 1;
            let res = shorter * stuff / (10**10 * (this.hrad**2 + r**2));
            res = res > 0.1 ? res : 0;
            return res
        }
    }

    irradiation_calc(variant: Variant): (op: IPoint) => number {
        let res: (op:Point) => number = (op: IPoint) => 0;
        
        if(variant.diameter <= 150)
            return this.irradiation_small_calc(variant);
        else if (variant.diameter < 300)
        {
            let var_150 = variant.clone();
            var_150.diameter = 150.;

            let var_300 = variant.clone();
            var_300.diameter = 300.;

            return (op: IPoint) => {
                if (Math.sqrt(op.x**2 + op.y**2)<=1) return this.max_irradiation_energy;

                let res = MathExt.interpolate_by(this.irradiation_small_calc(var_150)(op), var_150.kenergy_kttnt,
                                            this.irradiation_large_calc(var_300)(op), var_300.kenergy_kttnt,
                                            variant.kenergy_kttnt);
                                            return res;
            }
        }
        return this.irradiation_large_calc(variant);
    }

    irradiation_flux_calc(variant: Variant): (op: IPoint) => number {
        let csc = 1/Math.sin(variant.angle_rad);
        let cos = Math.cos(variant.angle_rad);
        let log10 = Math.log10(variant.kenergy);

        let eta_flux = MathExt.interpolate_by_density(
            100 * 353607.27 * variant.velocity ** 1.42 / variant.kenergy ** 0.54 * csc,
            100 * 3.44 * 10 ** 6 * variant.velocity ** 1.37 / variant.kenergy ** 0.61 * csc,
            variant.density
        );

        let elp = MathExt.interpolate_by_density(
            1 - 0.02 * cos**0.19 * (-67.21 + log10),
            1 - 0.13 * cos ** 0.0004 * (-17.09 + log10),
            variant.density
        )

        let eln = MathExt.interpolate_by_density(
            1 + 3.73 * cos ** 1.93 * (-15.71 + log10),
            1 + 1.08 * cos ** 0.53 * (- 15.11 + log10),
            variant.density
        )

        if (eln < 0.15 || eln > 3)
            eln = 1;

        let shorter = 1.0 / (400.0 * Math.PI * 10**10) * (eta_flux * variant.kenergy)
        return (op: IPoint):number => {
            let stuff = op.y >= 0 ? elp : eln;

            let res = shorter  / (this.hrad + op.x**2 + stuff * op.y**2);
            res = res > 0.1 ? res : 0;
            res = res > this.max_irradiation_flux ? this.max_irradiation_flux : res
            return res
        }
    }

}
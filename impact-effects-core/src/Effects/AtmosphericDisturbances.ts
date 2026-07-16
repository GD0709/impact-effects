import { IPoint } from "../Geometry";
import Variant from "../Variant";


export default class AtmosphericDisturbances
{
    
    debug: boolean = false;
    log(...data: any[])
    {
        if(this.debug == true)
            console.log("AtmosphericDisturbances:", ...data);
    }
    calc_point(variant: Variant, op: IPoint): void {
        //let p = op;
        //let r = ((p.x)**2 + (p.y)**2)**0.5;

        this.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km = 
            this.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km_calc(variant, op);
        this.peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km = this.alg1_func2(variant, op);

    }

    peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km_calc(variant: Variant, op: IPoint)
    {
        let R = ((op.x)**2 + (op.y)**2)**0.5;
        let ksi = Math.max(10.**-10, Math.log10(variant.diameter/30. * (variant.velocity/20.)**(2./3.) * (0.001*variant.density)**(1./3.)));
        let Fmax = 1 + 10.*ksi**0.5;
        let R0=1000. + 500. * ksi;

        let value =  Fmax * R0/(R0+R);
        return value;
    }



    alg1_func1(variant: Variant, R: number): number
    {
        this.log("Alg1_func1 called with ", variant, " and R=", R);
        let Ek = variant.kenergy_kttnt / 1000.;
        let Ea = Ek * Math.sin(variant.angle_rad) ** 2;

        this.log("Ek:", Ek);
        this.log("Ea:", Ea);
        let ksi_r = 0;

        let Ka = 0;
        let Kro = 0;
        let ksi_max = 0;
        let R0 = 0;

        if(variant.diameter <= 200)
        {
            this.log("variant.diameter <= 200:", variant.diameter );
            if(variant.angle < 30)
            {
                Ka = Math.sin(30. * Math.PI / 180.) ** 2 / Math.sin(variant.angle_rad) ** 2;
                Kro = (3300. / variant.density)**2;
            }
            else
            {
                Ka = 1;
                Kro = 1;
            }

            if(Ea >= 40)
                ksi_max = (2. * Ea ** 2 + 56 * Ea - 100) * Ka * Kro;
            else if(Ea >= 1)
                ksi_max = 10. ** (1.38 * (Math.log10(Ea) ** 2 - 0.025)) * Ka * Kro;
            else
                ksi_max = Ea ** 0.5 * Ka * Kro;

            let R0 = 150;
            let Ylift = 2;
            let Ymax = Math.log10(ksi_max) + Ylift;
            
            let Ymin = Math.log10(30. * Ea / 140) + Ylift;        
            let Ymid = (Ymin + Ymax) / 2.;
            let Delta_mid = 300. * Ea ** 0.1;
            let B2 = Delta_mid ** 2 / (Math.log(Ymax) - Math.log(Ymid));
            let Y = Ymax * Math.exp(0 - (R - R0) ** 2 / B2) - Ylift;
            let ksi_g = 10 ** Y;
            
            let Rstar = 150;
            let Rminus = -2000;
            let Rplus = 2000;

            let ksi_Rplus = 0;
            let ksi_Rminus = 0;
            let ksi_T =  0;
            if(R > R0)
            {
                ksi_Rplus = 0.13 * Ea * Ka;
                ksi_T = ksi_Rplus * Rplus / R;
            }
            else 
            {
                if(Ea >= 1)
                    ksi_Rminus = (0.0465 * Ea + 0.05) * Ka;
                else
                    ksi_Rminus = 0.1 * Ea * Ka;
                ksi_T = ksi_Rminus * (Rminus - R0 - Rstar) / (R - R0 - Rstar);
            }
            ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);
        }
        else
        {
            this.log("variant.diameter > 200:", variant.diameter );
            ksi_max = 523. * Ea ** 0.9;
            if (Ea < 2.5 * 10 ** 4)
                R0 = 1.83 * 10 ** 3 * Ea ** (-0.167) - 600;
            else
                R0 = 2.6 * 10 ** 2 * Ea ** 0.025 - 600;
            this.log("R0:", R0 );

            
            let Ymin = 2 * Math.log10(variant.diameter) - 4
            this.log("Ymin:", Ymin );
            let Ymax = Math.log10(ksi_max)
            this.log("Ymax:", Ymax );
            let Ymid = (Ymin + Ymax) / 2
            let Delta_mid = 390. * Ea ** 0.042
            let B2 = Delta_mid ** 2 / (Math.log(Ymax) - Math.log(Ymid))
            this.log("B2:", B2 );
            let Y = Ymax * Math.exp(0 - (R - R0) ** 2 / B2)
            this.log("Y:", Y );
            let ksi_g = 10 ** Y
            let Rstar = 100
            let Rminus = -2000
            let Rplus = 2000

            if (R > R0)
            {    
                this.log("R > R0:", R, ">", R0 );
                let b_plus = 1.3 * Ea ** 0.096;
                let ksi_Rplus = Ea ** 0.615;
                let ksi_T = ksi_Rplus * ((Rplus - R0 + Rstar) / (R - R0 + Rstar)) ** b_plus;
                ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);

                this.log("Y:", Y );
                this.log("Y:", Y );
                this.log("Y:", Y );
                this.log("Y:", Y );
            }
            else
            {
             
                let b_minus = 0;
                if (Ea < 8. * 10 ** 3)
                    b_minus = 0.1 * Ea ** 0.414
                else
                    b_minus = 10 * Ea ** (-0.095)
                
                let ksi_Rminus = 0.0023 * Ea ** 1.36;
                let ksi_T = ksi_Rminus * ((Rminus - R0 - Rstar) / (R - R0 - Rstar)) ** b_minus;
                ksi_r = Math.min(Math.max(ksi_g, ksi_T), ksi_max);
            }
        }
        return ksi_r;
    }

    alg1_func2(variant: Variant, op: IPoint)
    {

        let Ek = variant.kenergy_kttnt / 1000.;
        let Ea = Ek * Math.sin(variant.angle_rad) ** 2;
        let Distance = (op.x ** 2 + op.y ** 2) ** 0.5;
        
        let Teta = Math.atan2(Math.abs(op.y), op.x);
        
        let R0 = 0;
        if (variant.diameter < 200)
            R0 = 150;
        else
        {
            if (Ea < 2.5 * 10 ** 4)
                R0 = 1.83 * 10 ** 3 * Ea ** (-0.167) - 600;
            else
                R0 = 2.6 * 10 ** 2 * Ea ** 0.025 - 600;
        }
        this.log("atmospheric_disturbances alg1_func2 " + "R0" + ": " + R0)
        let RC = ((Distance * Math.sin(Teta)) ** 2 + (Distance * Math.cos(Teta) - R0) ** 2) ** 0.5;
        this.log("atmospheric_disturbances alg1_func2 " + "RC" + ": " + RC)
        this.log(R0 + RC)
        this.log(R0 - RC)

        let ksi_1 = this.alg1_func1(variant, R0 - RC);
        let ksi_2 = this.alg1_func1(variant, R0 + RC);

        let gamma = Math.asin(Distance * Math.sin(Teta) / RC) * 180. / Math.PI;
        if (op.x < 0)
            gamma = 180 - gamma;
        this.log("atmospheric_disturbances alg1_func2 " + "gamma" + ": " + gamma)
        let L = Math.PI * RC * gamma / 180.;
        this.log("atmospheric_disturbances alg1_func2 " + "L" + ": " + L)
        let ksi = ksi_2 + (ksi_1 - ksi_2) * (gamma / 180);
        
        return ksi;
    }
    peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km: number = 0;
    peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km: number = 0;

}


/* declare global {
    interface Math {
        deg2rad(x: Number) : number;
        rad2deg(x: Number) : number;
    }
}



Math.deg2rad = function (x: number) : number {
    return x / 180. * Math.PI;
};

Math.rad2deg = function (x: number) : number {
    return x / Math.PI * 180.;
}; */


export default class MathExt
{
    static range(start: number = 0, end:number = 10, step:number = 1):ReadonlyArray<number> {
        return Array.from({length: Math.floor((end - start + step)/step)}, (x, i) => start + i* step);
    }

    static deg2rad(angle_degree: number) : number {
        return angle_degree / 180. * Math.PI;
    }
    static point_deg2rad(point: {x:number, y: number}) : {x:number, y: number} {
        return {x: MathExt.deg2rad(point.x), y: MathExt.deg2rad(point.y) };
    }
    static geopoint_deg2rad(point: {latitude:number, longitude: number}) : {latitude:number, longitude: number} {
        return {latitude: MathExt.deg2rad(point.latitude), longitude: MathExt.deg2rad(point.longitude) };
    }
    static rad2deg(angle_rad: number) : number {
        return angle_rad / Math.PI * 180.;
    }
    static geopoint_rad2deg(point: {latitude:number, longitude: number}) : {latitude:number, longitude: number} {
        return {latitude: MathExt.rad2deg(point.latitude), longitude: MathExt.rad2deg(point.longitude) };
    }

    static interpolate_by_density(val1000: number, val3320: number, density: number){
        return val1000 * (3320. - density)/2320 + val3320 * (density - 1000.)/2320;
    }
    static interpolate_by(val1: number, arg1: number,val2: number, arg2: number, arg: number){
        return val1 * (arg2 - arg)/(arg2- arg1) + val2 * (arg - arg1)/(arg2- arg1);
    }
    static round_by_digits(real: number, n: number){
    
        let sgn = real >= 0 ? 1 :  -1;
        let absreal = real >= 0 ? real :  -real;
        let mult = 10.**(Math.floor(Math.log10(absreal))-n + 1);
        return 1. * sgn * mult * Math.round(absreal/mult)
    }

    static round_decimal_digits_to_string(real: number, after_dot_length: number)
    {
        let str = real.toString();
        let dot_pos = str.indexOf('.');
        if(dot_pos<0) return str;
        if(after_dot_length == 0)
            after_dot_length = -1;
        return str.substring(0, dot_pos + 1 + after_dot_length);
    }
    static round_by_digits_to_string(real: number, n: number){

        if(real == 0) return "0";
        if(n == 0)
        {
            let res = Math.round(real).toString();
            let index = res.indexOf('.');
            if(index > 0)
                return res.substring(0, index);
            else return res;
        }
        if(n < 0)
        {
            let res = real.toString();
            let index = res.indexOf('.');
            if(index > 0)
            {
                let count = index + 1 - n;
                if(count > res.length)
                    count = res.length;
                return res.substring(0, count);
            }
            else return res;
    
        }		
    
    
        let sgn = real >= 0 ? 1 :  -1;
        let absreal = real >= 0 ? real :  -real;
        let power = Math.floor(Math.log10(absreal))-n + 1;
        let mult = 10.**(power);
        let res = 1. * sgn * mult * Math.round(absreal/mult);
    
        let resstring = res.toString();
        let end = resstring.indexOf('.');
        if(end <=0)
            end = resstring.length;
        else if(power < 0) end = end - power + 1;
        else end = resstring.length;
        return resstring.substring(0, end);
    }

    static dimension_prefix_format(real: number, dimension_formatter: (power: number) => string, n: number): string
    {
        if (real == 0) {
            return "0 ";
        }

        let real_power = Math.floor(Math.log10(real));
        let rest_power = real_power % 3;
        let power = real_power-rest_power;

        let mult = MathExt.round_by_digits_to_string(real / 10**power, n);
        return mult + ' ' + dimension_formatter(power);

    }

    static power_format(real: number, n: number)
    {
        if (real == 0){
            return { mult:"1", power: "0", power_n: 0, html:"0" };
        }
        let power = Math.floor(Math.log10(real));
        let mult = MathExt.round_by_digits_to_string(real / 10**power, n);
        let html = mult;
        if(power != 0)
            html += " * 10<sup>" + power.toString() + "</sup>";
        return { mult, power: power.toString(), power_n: power, html };
    }

    static seconds_to_string(s: number, show_ms: boolean = false)
    {
        let local = s;
        let h = Math.floor(local / 3600);
        local = local - 3600*h;
        let m = Math.floor(local / 60);
        local = local - 60*m;
        let sec = Math.floor(local);
        
        let res = h.toString() + ":" + m.toString() + ":" + sec.toString();
        if(show_ms && s.toString().indexOf('.') >= 2)
        {
            let rest = s.toString().substring(s.toString().indexOf('.')+1);
            res += "." + rest;
        }
        return res;
    }
}
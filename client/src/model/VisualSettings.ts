import MathExt from '../../../core/lib/MathExt';

enum InputModes {basic = 0, extended = 1}
class VisualSettings
{

    input_mode: InputModes = InputModes.basic;
    round_digits: number = 2;
    round(real: number){
        return '' + MathExt.round_by_digits_to_string(real, this.round_digits);
    };

    private p_is_debug: boolean = false;
    get is_debug(): boolean {return this.p_is_debug;}
    set is_debug(v: boolean) {
        this.p_is_debug = v;
        if(this.p_is_debug)
        {
            this.round_digits = 5;
        }
        else {
            this.round_digits = 2;
        }
    }
}
export {InputModes, VisualSettings}
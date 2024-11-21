import { Emitter, IEmitter } from "./../../lib/Events";
import { IPoint } from "../Geometry";
import { ObservationPointInput } from "../Observation";
import Target from "../Target";
import Variant from "../Variant";
import { Crater } from "./Crater";
import RadiationEffects from "./Radiation";
import Seismic from "./Seismic";
import ShockWaveEffects from "./ShockWave";
import AtmosphericDisturbances from './AtmosphericDisturbances';

interface IEffectAssesment{
    calc_variant(variant: Variant): void;
}
interface ITargetEffectAssesment {
    calc_variant_target(variant: Variant, target: Target): void;
}
interface IPointEffectAssesment{
    calc_point(op: IPoint): void;
}


class DelayedUpdater
{
    constructor(timeout: number)
    {
        setInterval(() => this.check_update(), timeout);

    }

    debug: boolean = true;
    log(...data: any[])
    {
        if(this.debug == true)
            console.log("DelayedUpdater ", ...data);
    }


    timeout: number = 1000;
    last_need_update = 0;
    is_updating = false;
    need_update()
    {
        this.log("need update");
        this.last_need_update  = new Date().getTime(); 
    }


    private readonly on_updating = new Emitter<DelayedUpdater>();
    get updating(): IEmitter<DelayedUpdater> {
        return this.on_updating;
    }

    public check_update(): boolean {
        if(this.is_updating) return false;
        let time = new Date().getTime();
        if(this.last_need_update != 0 && time - this.last_need_update >= this.timeout)
        {
            this.log("check update and perform");
            this.is_updating = true;
            this.on_updating.trigger(this, []);
            this.last_need_update = 0;
            this.is_updating = false;
            return true;
        }
        else return false;
    }
}

class Effects {

    debug: boolean = true;
    log(...data: any[])
    {
        if(this.debug == true)
            console.log("Effects ", ...data);
    }


    variant: Variant;
    variant_updater = new  DelayedUpdater(500);
    target: Target;
    target_updater = new  DelayedUpdater(500);
    observation_point_input: ObservationPointInput;
    observation_point_input_updater = new  DelayedUpdater(500);

    constructor(variant: Variant, target: Target, observation_point_input: ObservationPointInput)
    {
        this.variant = variant;
        this.variant.changed.on(s => { this.variant_updater.need_update(); this.update_fast(); });
        this.variant_updater.updating.on(() => this.variant_changed());
        this.target = target;
        this.target.changed.on(() => this.target_updater.need_update());
        this.target_updater.updating.on(() => this.variant_and_target_changed());


        this.observation_point_input = observation_point_input;
        this.observation_point_input.main_point.changed.on(() => this.observation_point_input_updater.need_update());
        this.observation_point_input_updater.updating.on(() => this.observation_point_changed());
        //  setInterval(() => this.update(), Effects.variant_update_timeout);
        // this.update();
        this.variant_changed();
        this.variant_and_target_changed();
        this.observation_point_changed();
    }

    private last_variant_change: number = -1;
    private last_point_change: number = -1;

    shock_wave: ShockWaveEffects = new ShockWaveEffects();
    irradiation: RadiationEffects = new RadiationEffects();
    crater: Crater = new Crater();
    seismic: Seismic = new Seismic();
    atmospheric_disturbances: AtmosphericDisturbances = new AtmosphericDisturbances();


    private readonly on_effects_updated = new Emitter<Effects>();
    get effects_updated(): IEmitter<Effects> {
        return this.on_effects_updated;
    }
    public fire_effects_updated(): void {
        this.on_effects_updated.trigger(this, []);
    }


    update_fast(){
        this.shock_wave.calc_heff_and_zero_point(this.variant);
        this.irradiation.calc_hrad_and_zero_point(this.variant);

    }

    variant_changed()
    {
        this.log('variant changed call effects for calc_variant');
        this.shock_wave.calc_variant(this.variant);
        this.irradiation.calc_variant(this.variant);

        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_variant_target(this.variant, this.target);

        this.observation_point_changed();
    }
    variant_and_target_changed()
    {        
        this.log('variant_and_target changed call effects for calc_variant_target');
        this.crater.calc_variant_target(this.variant, this.target);
    }
    observation_point_changed()
    {
        console.log("observation_point_changed");
        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_point(this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.seismic.calc_point(this.variant, this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.atmospheric_disturbances.calc_point(this.variant, this.observation_point_input.main_point);
        this.fire_effects_updated();
    }

   /*  update() {
        let time = new Date().getTime();
        if(this.last_variant_change != 0 && time - this.last_variant_change >= Effects.variant_update_timeout)
        {
            this.shock_wave.calc_variant(this.variant);
            this.irradiation.calc_variant(this.variant);
            this.crater.calc_variant_target(this.variant, )
            this.last_variant_change = 0;
            this.log('variant updated');
        }
        if(this.last_point_change != 0 && time - this.last_point_change >= Effects.point_update_timeout)
        {
            this.shock_wave.calc_effect(this.observation_point_input.main_point);
            this.irradiation.calc_effect(this.observation_point_input.main_point);

            console.log('updated point effects');
            this.last_point_change = 0;
        } 
    } */

}
export { Effects };
export type { IEffectAssesment, ITargetEffectAssesment, IPointEffectAssesment };

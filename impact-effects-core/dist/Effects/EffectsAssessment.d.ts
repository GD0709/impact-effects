import { IEmitter } from "./../lib/Events";
import { IPoint } from "../Geometry";
import { ObservationPointInput } from "../Observation";
import Target from "../Target";
import Variant from "../Variant";
import { Crater } from "./Crater";
import { CraterForTransients } from "./TransientCraterScaling";
import RadiationEffects from "./Radiation";
import Seismic from "./Seismic";
import ShockWaveEffects from "./ShockWave";
import AtmosphericDisturbances from './AtmosphericDisturbances';
interface IEffectAssesment {
    calc_variant(variant: Variant): void;
}
interface ITargetEffectAssesment {
    calc_variant_target(variant: Variant, target: Target): void;
}
interface IPointEffectAssesment {
    calc_point(op: IPoint): void;
}
declare class DelayedUpdater {
    constructor(timeout: number);
    debug: boolean;
    log(...data: any[]): void;
    timeout: number;
    last_need_update: number;
    is_updating: boolean;
    need_update(): void;
    private readonly on_updating;
    get updating(): IEmitter<DelayedUpdater>;
    check_update(): boolean;
}
declare class Effects {
    debug: boolean;
    log(...data: any[]): void;
    variant: Variant;
    variant_updater: DelayedUpdater;
    target: Target;
    target_updater: DelayedUpdater;
    observation_point_input: ObservationPointInput;
    observation_point_input_updater: DelayedUpdater;
    constructor(variant: Variant, target: Target, observation_point_input: ObservationPointInput);
    private last_variant_change;
    private last_point_change;
    shock_wave: ShockWaveEffects;
    irradiation: RadiationEffects;
    crater: Crater;
    craterForTransients: CraterForTransients;
    seismic: Seismic;
    atmospheric_disturbances: AtmosphericDisturbances;
    private readonly on_effects_updated;
    get effects_updated(): IEmitter<Effects>;
    fire_effects_updated(): void;
    update_fast(): void;
    variant_changed(): void;
    variant_and_target_changed(): void;
    observation_point_changed(): void;
}
export { Effects };
export type { IEffectAssesment, ITargetEffectAssesment, IPointEffectAssesment };

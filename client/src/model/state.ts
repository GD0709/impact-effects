import { GeoPoint, GeoVector, Point } from "../../../core/model/Geometry";
import Variant from "../../../core/model/Variant";
import {VisualSettings} from "./VisualSettings";
import Target from "../../../core/model/Target"
import { ObservationPointAlongAcross, ObservationPointInput } from "../../../core/model/Observation";
import { Effects } from "../../../core/model/Effects/EffectsAssessment";
import { GeoPointController } from "../../../core/model/GeoPointController";

export default class State
{
    constructor() {
      


    this.variant = new Variant("variant");
    this.observation_point = new Point("observation_point_abs", 0,50);
    this.observation_point_inputs = new ObservationPointInput(this.observation_point, this.variant);


    this.geo_points_controller = new GeoPointController(this.variant, this.entry_point_geo, this.observation_point);
    this.observation_point_geo = this.geo_points_controller.observation_point_geo;

    this.along_across = this.observation_point_inputs.along_across;
    
    this.effects = new Effects(this.variant, this.target, this.observation_point_inputs);


    this.effects.effects_updated.on((s, p) => {
        this.recalc_effects_geopoints();
    });

    this.recalc_effects_geopoints();

    this.variant.changed.on((s, p) => {
        this.recalc_effects_geopoints();
    });
    this.entry_point_geo.changed.on((s, p) => {
        this.recalc_effects_geopoints();
    });

    }

 
    recalc_effects_geopoints() {
        console.log("recalc_effects_geopoints ", this.effects.shock_wave.zero_point, this.effects.irradiation.zero_point);
        this.geo_points_controller.max_overpressure_geopoint_recalc(this.effects.shock_wave.zero_point);
        this.geo_points_controller.max_thermal_effect_geopoint_recalc(this.effects.irradiation.zero_point);
    }

    static state: State = new State();

    visual_settings: VisualSettings = new VisualSettings();
    
    entry_point_geo: GeoVector = new GeoVector("entry_point_geo", 54.445, 64.565, 103.3);
    target: Target = new Target();


    variant: Variant;

    observation_point: Point;
    observation_point_inputs: ObservationPointInput;


    geo_points_controller: GeoPointController;
    observation_point_geo: GeoPoint;

    along_across:ObservationPointAlongAcross;
    
    effects: Effects;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = void 0;
const Events_1 = require("./../lib/Events");
const Crater_1 = require("./Crater");
const TransientCraterScaling_1 = require("./TransientCraterScaling");
const Radiation_1 = __importDefault(require("./Radiation"));
const Seismic_1 = __importDefault(require("./Seismic"));
const ShockWave_1 = __importDefault(require("./ShockWave"));
const AtmosphericDisturbances_1 = __importDefault(require("./AtmosphericDisturbances"));
class DelayedUpdater {
    constructor(timeout) {
        this.debug = true;
        this.timeout = 1000;
        this.last_need_update = 0;
        this.is_updating = false;
        this.on_updating = new Events_1.Emitter();
        setInterval(() => this.check_update(), timeout);
    }
    log(...data) {
        if (this.debug == true)
            console.log("DelayedUpdater ", ...data);
    }
    need_update() {
        this.log("need update");
        this.last_need_update = new Date().getTime();
    }
    get updating() {
        return this.on_updating;
    }
    check_update() {
        if (this.is_updating)
            return false;
        let time = new Date().getTime();
        if (this.last_need_update != 0 && time - this.last_need_update >= this.timeout) {
            this.log("check update and perform");
            this.is_updating = true;
            this.on_updating.trigger(this, []);
            this.last_need_update = 0;
            this.is_updating = false;
            return true;
        }
        else
            return false;
    }
}
class Effects {
    log(...data) {
        if (this.debug == true)
            console.log("Effects ", ...data);
    }
    constructor(variant, target, observation_point_input) {
        this.debug = true;
        this.variant_updater = new DelayedUpdater(500);
        this.target_updater = new DelayedUpdater(500);
        this.observation_point_input_updater = new DelayedUpdater(500);
        this.last_variant_change = -1;
        this.last_point_change = -1;
        this.shock_wave = new ShockWave_1.default();
        this.irradiation = new Radiation_1.default();
        this.crater = new Crater_1.Crater();
        this.craterForTransients = new TransientCraterScaling_1.CraterForTransients();
        this.seismic = new Seismic_1.default();
        this.atmospheric_disturbances = new AtmosphericDisturbances_1.default();
        this.on_effects_updated = new Events_1.Emitter();
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
    get effects_updated() {
        return this.on_effects_updated;
    }
    fire_effects_updated() {
        this.on_effects_updated.trigger(this, []);
    }
    update_fast() {
        this.shock_wave.calc_heff_and_zero_point(this.variant);
        this.irradiation.calc_hrad_and_zero_point(this.variant);
    }
    variant_changed() {
        this.log('variant changed call effects for calc_variant');
        this.shock_wave.calc_variant(this.variant);
        this.irradiation.calc_variant(this.variant);
        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_variant_target(this.variant, this.target);
        this.craterForTransients.calc_variant_target(this.variant, this.target);
        this.observation_point_changed();
    }
    variant_and_target_changed() {
        this.log('variant_and_target changed call effects for calc_variant_target');
        this.crater.calc_variant_target(this.variant, this.target);
        this.craterForTransients.calc_variant_target(this.variant, this.target);
    }
    observation_point_changed() {
        console.log("observation_point_changed");
        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_point(this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.seismic.calc_point(this.variant, this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.atmospheric_disturbances.calc_point(this.variant, this.observation_point_input.main_point);
        this.fire_effects_updated();
    }
}
exports.Effects = Effects;

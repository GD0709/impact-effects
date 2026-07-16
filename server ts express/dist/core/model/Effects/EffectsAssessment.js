"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = void 0;
var Events_1 = require("./../../lib/Events");
var Crater_1 = require("./Crater");
var TransientCraterScaling_1 = require("./TransientCraterScaling");
var Radiation_1 = __importDefault(require("./Radiation"));
var Seismic_1 = __importDefault(require("./Seismic"));
var ShockWave_1 = __importDefault(require("./ShockWave"));
var AtmosphericDisturbances_1 = __importDefault(require("./AtmosphericDisturbances"));
var DelayedUpdater = /** @class */ (function () {
    function DelayedUpdater(timeout) {
        var _this = this;
        this.debug = true;
        this.timeout = 1000;
        this.last_need_update = 0;
        this.is_updating = false;
        this.on_updating = new Events_1.Emitter();
        setInterval(function () { return _this.check_update(); }, timeout);
    }
    DelayedUpdater.prototype.log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (this.debug == true)
            console.log.apply(console, __spreadArray(["DelayedUpdater "], data, false));
    };
    DelayedUpdater.prototype.need_update = function () {
        this.log("need update");
        this.last_need_update = new Date().getTime();
    };
    Object.defineProperty(DelayedUpdater.prototype, "updating", {
        get: function () {
            return this.on_updating;
        },
        enumerable: false,
        configurable: true
    });
    DelayedUpdater.prototype.check_update = function () {
        if (this.is_updating)
            return false;
        var time = new Date().getTime();
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
    };
    return DelayedUpdater;
}());
var Effects = /** @class */ (function () {
    function Effects(variant, target, observation_point_input) {
        var _this = this;
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
        this.variant.changed.on(function (s) { _this.variant_updater.need_update(); _this.update_fast(); });
        this.variant_updater.updating.on(function () { return _this.variant_changed(); });
        this.target = target;
        this.target.changed.on(function () { return _this.target_updater.need_update(); });
        this.target_updater.updating.on(function () { return _this.variant_and_target_changed(); });
        this.observation_point_input = observation_point_input;
        this.observation_point_input.main_point.changed.on(function () { return _this.observation_point_input_updater.need_update(); });
        this.observation_point_input_updater.updating.on(function () { return _this.observation_point_changed(); });
        //  setInterval(() => this.update(), Effects.variant_update_timeout);
        // this.update();
        this.variant_changed();
        this.variant_and_target_changed();
        this.observation_point_changed();
    }
    Effects.prototype.log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (this.debug == true)
            console.log.apply(console, __spreadArray(["Effects "], data, false));
    };
    Object.defineProperty(Effects.prototype, "effects_updated", {
        get: function () {
            return this.on_effects_updated;
        },
        enumerable: false,
        configurable: true
    });
    Effects.prototype.fire_effects_updated = function () {
        this.on_effects_updated.trigger(this, []);
    };
    Effects.prototype.update_fast = function () {
        this.shock_wave.calc_heff_and_zero_point(this.variant);
        this.irradiation.calc_hrad_and_zero_point(this.variant);
    };
    Effects.prototype.variant_changed = function () {
        this.log('variant changed call effects for calc_variant');
        this.shock_wave.calc_variant(this.variant);
        this.irradiation.calc_variant(this.variant);
        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_variant_target(this.variant, this.target);
        this.craterForTransients.calc_variant_target(this.variant, this.target);
        this.observation_point_changed();
    };
    Effects.prototype.variant_and_target_changed = function () {
        this.log('variant_and_target changed call effects for calc_variant_target');
        this.crater.calc_variant_target(this.variant, this.target);
        this.craterForTransients.calc_variant_target(this.variant, this.target);
    };
    Effects.prototype.observation_point_changed = function () {
        console.log("observation_point_changed");
        this.shock_wave.calc_point(this.observation_point_input.main_point);
        this.irradiation.calc_point(this.observation_point_input.main_point);
        this.crater.calc_point(this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.seismic.calc_point(this.variant, this.observation_point_input.main_point, this.shock_wave.zero_point);
        this.atmospheric_disturbances.calc_point(this.variant, this.observation_point_input.main_point);
        this.fire_effects_updated();
    };
    return Effects;
}());
exports.Effects = Effects;

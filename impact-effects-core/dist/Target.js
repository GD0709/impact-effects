"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./lib/Events");
class Target {
    constructor() {
        this.on_changed = new Events_1.Emitter();
        this._target_density = 2650;
    }
    get changed() {
        return this.on_changed;
    }
    fire_changed() {
        this.on_changed.trigger(this, []);
    }
    get target_density() { return this._target_density; }
    set target_density(value) { this._target_density = value; this.fire_changed(); }
}
exports.default = Target;

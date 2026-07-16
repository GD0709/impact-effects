"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events_1 = require("../lib/Events");
var Target = /** @class */ (function () {
    function Target() {
        this.on_changed = new Events_1.Emitter();
        this._target_density = 2650;
    }
    Object.defineProperty(Target.prototype, "changed", {
        get: function () {
            return this.on_changed;
        },
        enumerable: false,
        configurable: true
    });
    Target.prototype.fire_changed = function () {
        this.on_changed.trigger(this, []);
    };
    Object.defineProperty(Target.prototype, "target_density", {
        get: function () { return this._target_density; },
        set: function (value) { this._target_density = value; this.fire_changed(); },
        enumerable: false,
        configurable: true
    });
    return Target;
}());
exports.default = Target;

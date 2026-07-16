"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.ZeroPoints = exports.ObservationPointDistanceAngle = exports.ObservationPointAlongAcross = exports.ObservationPointInput = void 0;
var MathExt_1 = __importDefault(require("../lib/MathExt"));
var Radiation_1 = __importDefault(require("./Effects/Radiation"));
var ShockWave_1 = __importDefault(require("./Effects/ShockWave"));
var Geometry_1 = require("./Geometry");
var ZeroPoints;
(function (ZeroPoints) {
    ZeroPoints[ZeroPoints["entry_point_100km"] = 1] = "entry_point_100km";
    ZeroPoints[ZeroPoints["max_overpressure_point"] = 2] = "max_overpressure_point";
    ZeroPoints[ZeroPoints["surface_intersection"] = 3] = "surface_intersection";
    ZeroPoints[ZeroPoints["max_thermal_effect_point"] = 4] = "max_thermal_effect_point";
})(ZeroPoints || (exports.ZeroPoints = ZeroPoints = {}));
var ObservationPointInput = /** @class */ (function (_super) {
    __extends(ObservationPointInput, _super);
    function ObservationPointInput(main_point, variant) {
        var _this = _super.call(this, "observation_point_rel") || this;
        _this.debug = false;
        _this._relative_to = ZeroPoints.surface_intersection;
        // this is shift relative to zero_point and center 
        //shift_x: number = 0;
        _this.shift_y = 0;
        _this.along_across = new ObservationPointAlongAcross(_this);
        //distance_angle= {distance: 0, angle:0 };
        _this.distance_angle = new ObservationPointDistanceAngle(_this);
        _this.main_point = main_point;
        _this.main_point.changed.on(function (s, p) { return _this.main_point_changed(s, p); });
        _this.variant = variant;
        _this.update_shift([]);
        _this.variant.changed.on(function (s, p) { return _this.update_shift(p); });
        return _this;
    }
    ObservationPointInput.prototype.log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (this.debug == true)
            console.log.apply(console, __spreadArray(["ObservationPointInput:"], data, false));
    };
    ObservationPointInput.prototype.main_point_changed = function (s, passed) {
        if (!passed.includes(this.name)) {
            console.log('main_point_changed', s.x, s.y - this.shift_y, passed);
            this.set(s.x, s.y - this.shift_y, passed);
        }
    };
    ObservationPointInput.prototype.set_from_derivative = function (x, y, passed) {
        if (!passed.includes(this.name)) {
            console.log('ObservationPointInput', x, y, passed);
            this.set(x, y, passed);
            this.main_point.set(x, y + this.shift_y, passed);
            console.log('main point', this.main_point.to_string(), "this", this.to_string());
            //this.set(x, y, passed.concat(this.name));
        }
    };
    Object.defineProperty(ObservationPointInput.prototype, "relative_to", {
        get: function () { return this._relative_to; },
        set: function (relative_to) { if (this._relative_to != relative_to) {
            this._relative_to = relative_to;
            this.update_shift([]);
        } },
        enumerable: false,
        configurable: true
    });
    ObservationPointInput.prototype.update_shift = function (passed) {
        return __awaiter(this, void 0, void 0, function () {
            var shock, rad;
            return __generator(this, function (_a) {
                if (this.relative_to == ZeroPoints.surface_intersection) {
                    //this.shift_x = 0;
                    this.shift_y = 0;
                    this.log("relative to set: ".concat(this.relative_to, " surface_intersection and shift: ").concat(this.shift_y));
                }
                else if (this.relative_to == ZeroPoints.max_overpressure_point) {
                    shock = new ShockWave_1.default();
                    shock.calc_heff_and_zero_point(this.variant);
                    //this.shift_x = 0;
                    this.shift_y = shock.zero_point;
                    this.log("relative to set: ".concat(this.relative_to, " max_overpressure_point and shift: ").concat(this.shift_y));
                }
                else if (this.relative_to == ZeroPoints.max_thermal_effect_point) {
                    rad = new Radiation_1.default();
                    rad.calc_hrad_and_zero_point(this.variant);
                    //this.shift_x = 0;
                    this.shift_y = rad.zero_point;
                    this.log("relative to set: ".concat(this.relative_to, " max_thermal_effect_point and shift: ").concat(this.shift_y));
                }
                else if (this.relative_to == ZeroPoints.entry_point_100km) {
                    //this.shift_x = 0;
                    this.shift_y = 100. / Math.tan(MathExt_1.default.deg2rad(this.variant.angle));
                    this.log("relative to set: ".concat(this.relative_to, " entry_point_100km and shift: ").concat(this.shift_y));
                }
                this.set(this.main_point.x, this.main_point.y - this.shift_y, passed);
                return [2 /*return*/];
            });
        });
    };
    return ObservationPointInput;
}(Geometry_1.Point));
exports.ObservationPointInput = ObservationPointInput;
var ObservationPointAlongAcross = /** @class */ (function () {
    function ObservationPointAlongAcross(input) {
        this.name = "along_across";
        this.input = input;
    }
    Object.defineProperty(ObservationPointAlongAcross.prototype, "along", {
        get: function () { return -this.input.y; },
        set: function (val) { if (!isNaN(val)) {
            this.input.set_from_derivative(this.input.x, -val, [this.name]);
        } },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservationPointAlongAcross.prototype, "across", {
        get: function () { return this.input.x; },
        set: function (val) { if (!isNaN(val)) {
            this.input.set_from_derivative(val, this.input.y, [this.name]);
        } },
        enumerable: false,
        configurable: true
    });
    return ObservationPointAlongAcross;
}());
exports.ObservationPointAlongAcross = ObservationPointAlongAcross;
var ObservationPointDistanceAngle = /** @class */ (function () {
    function ObservationPointDistanceAngle(input) {
        this.name = "distance_angle";
        this.input = input;
    }
    Object.defineProperty(ObservationPointDistanceAngle.prototype, "distance", {
        get: function () { return Math.pow((Math.pow(this.input.x, 2) + Math.pow(this.input.y, 2)), 0.5); },
        set: function (val) {
            if (!isNaN(val)) {
                var angle = Math.atan2(this.input.x, -this.input.y);
                this.input.set_from_derivative(val * Math.sin(angle), -val * Math.cos(angle), [this.name]);
            }
        },
        enumerable: false,
        configurable: true
    });
    ObservationPointDistanceAngle.fix_quartile = function (angle_rad) {
        while (angle_rad < 0)
            angle_rad += 2 * Math.PI;
        while (angle_rad >= 2 * Math.PI)
            angle_rad -= 2 * Math.PI;
        return angle_rad;
    };
    ObservationPointDistanceAngle.calc_angle = function (point) {
        return MathExt_1.default.rad2deg(ObservationPointDistanceAngle.fix_quartile(Math.atan2(point.x, -point.y)));
    };
    Object.defineProperty(ObservationPointDistanceAngle.prototype, "angle", {
        get: function () { return ObservationPointDistanceAngle.calc_angle(this.input); },
        set: function (val) {
            if (!isNaN(val)) {
                var distance = this.distance;
                var a = MathExt_1.default.deg2rad(val);
                this.input.set_from_derivative(distance * Math.sin(a), -distance * Math.cos(a), [this.name]);
            }
        },
        enumerable: false,
        configurable: true
    });
    return ObservationPointDistanceAngle;
}());
exports.ObservationPointDistanceAngle = ObservationPointDistanceAngle;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointOfEffect = exports.Target = exports.Entry = exports.Variant = exports.In = exports.PointOfEffectValidate = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var PointOfEffectValidate = /** @class */ (function () {
    function PointOfEffectValidate() {
    }
    PointOfEffectValidate.prototype.validate = function (text, args) {
        return text.distance < 1;
    };
    PointOfEffectValidate.prototype.defaultMessage = function (args) {
        // here you can provide default error message if validation failed
        return 'Text ($value) is too short or too long!';
    };
    PointOfEffectValidate = __decorate([
        (0, class_validator_1.ValidatorConstraint)({ name: 'PointOfEffect validation constraint name', async: false })
    ], PointOfEffectValidate);
    return PointOfEffectValidate;
}());
exports.PointOfEffectValidate = PointOfEffectValidate;
var In = /** @class */ (function () {
    function In() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_validator_1.IsDefined)({
            message: 'impactor should not be null or undefined!!!'
        }),
        (0, class_transformer_1.Type)(function (type) { return Variant; }),
        __metadata("design:type", Variant)
    ], In.prototype, "impactor", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_validator_1.IsDefined)({
            message: 'impactor should not be null or undefined!!!'
        }),
        (0, class_transformer_1.Type)(function (type) { return Entry; }),
        __metadata("design:type", Entry)
    ], In.prototype, "entry", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function (type) { return Target; }),
        __metadata("design:type", Target)
    ], In.prototype, "target", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function (type) { return PointOfEffect; }),
        (0, class_validator_1.ArrayMinSize)(1),
        (0, class_validator_1.ArrayMaxSize)(10000),
        (0, class_validator_1.Validate)(PointOfEffectValidate, {
            message: 'Title is too short or long!',
            each: true
        }),
        __metadata("design:type", Array)
    ], In.prototype, "points", void 0);
    return In;
}());
exports.In = In;
var Variant = /** @class */ (function () {
    function Variant() {
    }
    __decorate([
        (0, class_validator_1.IsDefined)(),
        (0, class_validator_1.Min)(15),
        (0, class_validator_1.Max)(3000),
        __metadata("design:type", Number)
    ], Variant.prototype, "diameter", void 0);
    __decorate([
        (0, class_validator_1.IsDefined)(),
        (0, class_validator_1.Min)(500),
        (0, class_validator_1.Max)(4000),
        __metadata("design:type", Number)
    ], Variant.prototype, "density", void 0);
    return Variant;
}());
exports.Variant = Variant;
var Entry = /** @class */ (function () {
    function Entry() {
    }
    __decorate([
        (0, class_validator_1.IsDefined)(),
        (0, class_validator_1.Min)(15),
        (0, class_validator_1.Max)(90),
        __metadata("design:type", Number)
    ], Entry.prototype, "angle", void 0);
    __decorate([
        (0, class_validator_1.IsDefined)(),
        (0, class_validator_1.Min)(12),
        (0, class_validator_1.Max)(72),
        __metadata("design:type", Number)
    ], Entry.prototype, "velocity", void 0);
    return Entry;
}());
exports.Entry = Entry;
var Target = /** @class */ (function () {
    function Target() {
    }
    return Target;
}());
exports.Target = Target;
var PointOfEffect = /** @class */ (function () {
    function PointOfEffect() {
    }
    return PointOfEffect;
}());
exports.PointOfEffect = PointOfEffect;

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
exports.Info = exports.PointOfEffect = exports.Target = exports.Entry = exports.Variant = exports.In = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
// @ValidatorConstraint({ name: 'PointOfEffectValidation', async: false })
// export class PointOfEffectValidate implements ValidatorConstraintInterface {
//   validate(text: PointOfEffect, args: ValidationArguments) {
//     var distance_angle_pass = isFinite(text.distance) && isFinite(text.angle)
//     var distance_along_across = isFinite(text.along) && isFinite(text.across)
//     if (distance_angle_pass && !distance_along_across || 
//       !distance_angle_pass &&distance_along_across) {
//         return false;
//       }
//     return true; 
//   }
//   defaultMessage(args: ValidationArguments) {
//     // here you can provide default error message if validation failed
//     //return 'Text ($value) is too short or too long!';
//     return 'Points of effects must be specified by distance/angle or along/across';
//   }
// }
var In = /** @class */ (function () {
    function In() {
    }
    __decorate([
        (0, class_validator_1.IsDefined)({
            message: 'impactor should not be null or undefined!!!'
        }),
        (0, class_transformer_1.Type)(function (type) { return Variant; }),
        __metadata("design:type", Variant)
    ], In.prototype, "impactor", void 0);
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
var Info = /** @class */ (function () {
    function Info() {
    }
    __decorate([
        (0, class_validator_1.IsDefined)(),
        __metadata("design:type", String)
    ], Info.prototype, "country", void 0);
    __decorate([
        (0, class_validator_1.IsDefined)(),
        __metadata("design:type", String)
    ], Info.prototype, "city", void 0);
    return Info;
}());
exports.Info = Info;

import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsDefined, IsEnum, Length, Max, MaxLength, Min, MinLength, Validate, ValidateNested, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import {ZeroPoints} from "../../../core/model/Observation"

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


export class In {
  //@ValidateNested()
  @IsDefined({
      message: 'impactor should not be null or undefined!!!'
  })
  @Type(type => Variant)
  public impactor: Variant;


  // @ValidateNested()
  // @IsDefined({
  //     message: 'impactor should not be null or undefined!!!'
  // })
  // @Type(type => Entry)
  // entry: Entry;


  // @ValidateNested()
  // @Type(type => Target)
  // target: Target;

  // @ValidateNested()
  // @Type(type => PointOfEffect)
  // @ArrayMinSize(1)
  // @ArrayMaxSize(10000)
  // @Validate(PointOfEffectValidate, {
  //   each:true
  // })
  // points: PointOfEffect[];

  // @IsEnum(ZeroPoints)
  // @IsDefined({
  //     message: 'points_anchor should not be null or undefined!!!'
  // })
  // points_anchor: ZeroPoints;
}


export class Variant {
  @IsDefined()
  @Min(15)
  @Max(3000)
  public diameter: number;

  @IsDefined()
  @Min(500)
  @Max(4000)
  public density: number;
}

export class Entry {
  @IsDefined()
  @Min(15)
  @Max(90)
  public angle: number;

  @IsDefined()
  @Min(12)
  @Max(72)
  public velocity: number;
}

export class Target {
  target_density: number;
}

export class PointOfEffect {
  public distance: number;
  public angle: number;

  public along: number;
  public across: number;
}




export class Info {
  @IsDefined()
  country: string;

  @IsDefined()
  city: string;
}

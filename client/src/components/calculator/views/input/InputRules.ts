export default {
density: [
    (v:any) => v != '' || `Desity is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=500 || `Density must be more than 500 kg/m^3`,
    (v:any) => v<=4000 || `Density must be less than 4000 kg/m^3`
],
diameter: [
    (v:any) => v != '' || `Diameter is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=15 || `Diameter must be more than 15 m`,
    (v:any) => v<=3000 || `Diameter must be less than 3000 m`
],
entry_angle: [
    (v:any) => v != '' || `Entry angle is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=15 || `Entry angle must be more than 15°`,
    (v:any) => v<=90 || `Entry angle must be less than 90°`
],
velocity: [
    (v:any) => v != '' || `Velocity is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=12 || `Velocity must be more than 12 km/s`,
    (v:any) => v<=72 || `Velocity must be less than 72 km/s`
],
input_along_across: [
    (v:any) => v != '' || v ===0 || `Distance is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=-3000 || `Distance must be in range -3000 km to 3000 km`,
    (v:any) => v<=3000 || `Distance must be in range -3000 km to 3000 km`
],
input_distance: [
    (v:any) => v != '' || `Distance is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=0 || `Distance must be more than 0 km`,
    (v:any) => v<=4242 || `Distance must be less than 4242 km`
],
angle: [
    (v:any) => v != '' || `Angle is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=0 || `Angle must be more than 0°`,
    (v:any) => v<=360 || `Angle must be less than 360°`
],
azimuth: [
    (v:any) => v != '' || `Azimuth is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=0 || `Azimuth must be more than 0°`,
    (v:any) => v<=360 || `Azimuth must be less than 360°`
],

input_angle: [
    (v:any) => v != '' || `Entry angle is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=0 || `Entry angle must be more than 0°`,
    (v:any) => v<=360 || `Entry angle must be less than 360°`
],
coordinate: [
    (v:any) => v != '' || `Coordinate is required`,
    (v:any) => !isNaN(v) || `${v} is not a number`,
    (v:any) => v>=-180 || `Coordinate must be more than -180°`,
    (v:any) => v<=180 || `Coordinate must be less than 180°`
]
};
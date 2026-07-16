"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoPointController = void 0;
const Events_1 = require("./lib/Events");
const MathExt_1 = __importDefault(require("./lib/MathExt"));
const Geometry_1 = require("./Geometry");
const Observation_1 = require("./Observation");
class GeoPointController {
    get observation_point_changed() {
        return this.on_observation_point_changed;
    }
    fire_observation_point_changed(passed) {
        //passed.push(this.name);
        this.on_observation_point_changed.trigger(this.observation_point, passed);
    }
    get observation_geopoint_changed() {
        return this.on_observation_geopoint_changed;
    }
    fire_observation_geopoint_changed(passed) {
        //passed.push(this.name);
        this.on_observation_geopoint_changed.trigger(this.observation_point_geo, passed);
    }
    constructor(variant, entry_point_geo, observation_point) {
        this.name = "GeoPointController";
        //calc 3
        this.max_overpressure_point_geo = new Geometry_1.GeoPoint("max_overpressure_point_geo");
        this.max_thermal_effect_point_geo = new Geometry_1.GeoPoint("max_thermal_effect_point_geo");
        this.on_observation_point_changed = new Events_1.Emitter();
        this.on_observation_geopoint_changed = new Events_1.Emitter();
        this.variant = variant;
        this.observation_point = observation_point;
        this.entry_point_geo = entry_point_geo;
        this.entry_point = new Geometry_1.Point("entry");
        this.intersection_point_geo = new Geometry_1.GeoPoint("intersection_geo");
        this.observation_point_geo = new Geometry_1.GeoPoint("observation_geo");
        this.last_setted_observation_point_geo = new Geometry_1.GeoPoint("");
        this.last_setted_observation_point = new Geometry_1.Point("");
        this.variant.changed.on(s => this.entry_point_recalc());
        this.entry_point_geo.changed.on((_s, p) => this.intersection_point_geo_recalc(p));
        this.entry_point.changed.on((_s, p) => this.intersection_point_geo_recalc(p));
        this.entry_point_recalc();
        this.intersection_point_geo.changed.on((_s) => this.observation_point_geo_recalc());
        this.observation_point.changed.on((_s) => this.observation_point_geo_recalc());
        this.observation_point_geo.changed.on((_s, p) => this.observation_point_recalc(p));
        this.observation_point_geo_recalc();
    }
    async entry_point_recalc() {
        console.log('entry_point_recalc');
        this.entry_point.set(0, 100.0 / Math.tan(this.variant.angle_rad), ["unset"]);
    }
    async intersection_point_geo_recalc(passed) {
        console.log('intersection_point_geo_recalc');
        var res = Geometry_1.GeoMath.coords_by_distance_azimuth({
            latitude: this.entry_point_geo.latitude,
            longitude: this.entry_point_geo.longitude
        }, this.entry_point.y * 1000, (-180 + this.entry_point_geo.azimuth));
        this.intersection_point_geo.set(res.latitude, res.longitude, passed.concat(['intersection_point_geo_recalc']));
    }
    async observation_point_geo_recalc() {
        console.log('observation_point_geo_recalc');
        var distance = Math.sqrt(Math.pow(this.observation_point.x, 2) +
            Math.pow(this.observation_point.y, 2));
        var angleObs_deg = Observation_1.ObservationPointDistanceAngle.calc_angle(this.observation_point);
        let bearing_from_intersection_to_observastion = angleObs_deg + this.entry_point_geo.azimuth;
        var res = Geometry_1.GeoMath.coords_by_distance_azimuth({
            latitude: this.intersection_point_geo.latitude,
            longitude: this.intersection_point_geo.longitude
        }, distance * 1000., bearing_from_intersection_to_observastion);
        this.last_setted_observation_point_geo.set(res.latitude, res.longitude, []);
        this.observation_point_geo.set(res.latitude, res.longitude, []);
        var tmp = "data = <|List -> { <|Coords -> {" + this.entry_point_geo.latitude + ", " + this.entry_point_geo.longitude + "}, Name -> " + "\"entry_point_geo\"" + "|>,";
        tmp += "<|Coords -> {" + this.intersection_point_geo.latitude + ", " + this.intersection_point_geo.longitude + "}, Name -> " + "\"intersection_point_geo\"" + "|>,";
        tmp += "<|Coords -> {" + this.observation_point_geo.latitude + ", " + this.observation_point_geo.longitude + "}, Name -> " + "\"observation_point_geo\"" + "|>}, ";
        tmp += "Distance-> " + distance + ", Angle-> " + angleObs_deg + ", ";
        tmp += "BearingFromIntersectionToObservastion-> " + bearing_from_intersection_to_observastion;
        tmp += "|>;";
        console.log(tmp);
    }
    max_overpressure_geopoint_recalc(distance) {
        let res = {
            latitude: this.intersection_point_geo.latitude - distance / (this.entry_point.y) * (this.intersection_point_geo.latitude - this.entry_point_geo.latitude),
            longitude: this.intersection_point_geo.longitude - distance / (this.entry_point.y) * (this.intersection_point_geo.longitude - this.entry_point_geo.longitude)
        };
        // var res = GeoMath.coords_by_distance_azimuth({
        //     latitude: this.intersection_point_geo.latitude,
        //     longitude: this.intersection_point_geo.longitude
        // }, distance*1000., this.entry_point_geo.azimuth);
        this.max_overpressure_point_geo.set(res.latitude, res.longitude, []);
    }
    max_thermal_effect_geopoint_recalc(distance) {
        // var res = GeoMath.coords_by_distance_azimuth({
        //     latitude: this.intersection_point_geo.latitude,
        //     longitude: this.intersection_point_geo.longitude
        // }, distance*1000., this.entry_point_geo.azimuth);
        let res = {
            latitude: this.intersection_point_geo.latitude - distance / (this.entry_point.y) * (this.intersection_point_geo.latitude - this.entry_point_geo.latitude),
            longitude: this.intersection_point_geo.longitude - distance / (this.entry_point.y) * (this.intersection_point_geo.longitude - this.entry_point_geo.longitude)
        };
        this.max_thermal_effect_point_geo.set(res.latitude, res.longitude, []);
    }
    observation_point_recalc(passed) {
        if (passed.includes('observation_point_recalc')) {
            return;
        }
        if (Math.abs(this.last_setted_observation_point_geo.latitude - this.observation_point_geo.latitude) < 0.000001 &&
            Math.abs(this.last_setted_observation_point_geo.longitude - this.observation_point_geo.longitude) < 0.000001) {
            console.log("observation_point_recalc ignoring");
            return;
        }
        else {
            console.log("observation_point_recalc CALC ", Math.abs(this.last_setted_observation_point_geo.latitude - this.observation_point_geo.latitude), Math.abs(this.last_setted_observation_point_geo.longitude - this.observation_point_geo.longitude));
        }
        let distance = Geometry_1.GeoMath.calc_distance(this.intersection_point_geo, this.observation_point_geo);
        let initial_bearing_from_intersection_to_observation = Geometry_1.GeoMath.initial_bearing_to(this.intersection_point_geo, this.observation_point_geo);
        let observation_angle = initial_bearing_from_intersection_to_observation - this.entry_point_geo.azimuth;
        let xy_angle = 180 - observation_angle;
        let tmp = "data3 = <|Distance-> " + distance;
        tmp += ", InitialBearingFromIntersectionToObservation-> " + initial_bearing_from_intersection_to_observation;
        tmp += ", ObservationAngle-> " + observation_angle;
        let x = (1) * distance * Math.sin(MathExt_1.default.deg2rad(xy_angle));
        let y = distance * Math.cos(MathExt_1.default.deg2rad(xy_angle));
        tmp += ", x->" + x + ", y->" + y;
        tmp += ", List -> { <|Coords -> {" + this.entry_point_geo.latitude + ", " + this.entry_point_geo.longitude + "}, Name -> " + "\"entry_point_geo\"" + "|>,";
        tmp += "<|Coords -> {" + this.intersection_point_geo.latitude + ", " + this.intersection_point_geo.longitude + "}, Name -> " + "\"intersection_point_geo\"" + "|>,";
        tmp += "<|Coords -> {" + this.observation_point_geo.latitude + ", " + this.observation_point_geo.longitude + "}, Name -> " + "\"observation_point_geo\"" + "|>}";
        tmp += "|>";
        console.log(tmp);
        this.last_setted_observation_point_geo.set(x, y, passed);
        this.observation_point.set(x, y, passed.concat('observation_point_recalc'));
        // var distance = GeoMath.calc_distance(this.observation_point_geo, this.intersection_point_geo);
        // var angleObs_rad = GeoMath.angle_in_triangle(this.observation_point_geo, this.intersection_point_geo, this.entry_point_geo);
        // console.log(" observation_point_recalc:", this.observation_point_geo.to_string(), " and ", this.intersection_point_geo.to_string(), ":", MathExt.rad2deg(angleObs_rad));
        // let newX = -Math.sin(angleObs_rad) * distance;
        // let newY = Math.cos(angleObs_rad) * distance;
        // console.log("new x and y ", newX, " ", newY, " angle ", MathExt.rad2deg(angleObs_rad), " rad:", angleObs_rad);
        //     var azimuth_rad = GeoMath.azimuth_calc(this.observation_point_geo, this.intersection_point_geo);
        //     var azimuth_deg = MathExt.rad2deg(azimuth_rad);
        //    console.log("inter -> observ",MathExt.rad2deg(GeoMath.azimuth_calc(this.intersection_point_geo, this.observation_point_geo)));
        //    console.log("observ -> inter",MathExt.rad2deg(GeoMath.azimuth_calc(this.observation_point_geo, this.intersection_point_geo)));
        //     let angleObs_deg = 90-azimuth_deg +this.entry_point_geo.azimuth + 180;
        //    console.log(angleObs_deg);
    }
    static fix_quartile(angle_deg) {
        while (angle_deg < 0)
            angle_deg += 360;
        while (angle_deg >= 360)
            angle_deg -= 360;
        return angle_deg;
    }
}
exports.GeoPointController = GeoPointController;

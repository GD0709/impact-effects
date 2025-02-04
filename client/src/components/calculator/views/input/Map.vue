<template>
    <div class="map_wrapper map">

    
    <yandex-map
        v-model="map"
        :settings="{
            location:LOCATION,
            theme,
            showScaleInCopyrights: true,
            behaviors: BEHAVIOR,
        }"
  
      width="100%"
      height="100%"
      style="min-height:500px; min-width:300px;"
  >
  <yandex-map-default-scheme-layer  :settings="{ theme: 'dark' }"/>
  <yandex-map-default-features-layer />
  <yandex-map-controls :settings="{ position: 'right' }">
    <yandex-map-zoom-control />
  </yandex-map-controls>

  <!-- <yandex-map-marker
            v-for="(marker, index) in markers3"
            :key="index"
            :settings="marker.settings"

    >
      <div class="marker"><div class="icon" v-html="marker.icon"></div></div>
    </yandex-map-marker> -->

    <!-- <yandex-map-default-marker
            v-model="entry_point_marker"
            :settings="marker.settings"

    >
      <div class="marker"><div class="icon" v-html="marker.icon"></div></div>
    </yandex-map-default-marker> -->

    <yandex-map-feature
    :settings="{
      geometry: {
        type: 'LineString',
        coordinates: lineCoordinates,
      },
      style: {
        stroke: [{ color: '#cccccc', width: 3 }],
      },
    }"
  />


    <!-- <yandex-map-default-marker
    v-model="defaultMarker"
    :settings="{
      //Здесь вам НУЖНО брать координаты либо из функции onDragMove, либо из маркера, стриггерив реактивность
      //Яндекс при выполнении функции .update зачем-то подставляет оригинальные координаты, хотя они не менялись =(
      coordinates: defaultMarker ? defaultMarker.coordinates : LOCATION.center,
      title: `Долгота: ${defaultMarker?.coordinates[0].toFixed(2)}<br>Широта: ${defaultMarker?.coordinates[1].toFixed(2)}`,
      draggable: true,
      onDragMove,
      onDragEnd,
    }"
    
  /> -->

    <yandex-map-marker v-model="entry_point_model" :settings="entry_point_controller.settings" style="width:0px;height:0px;">
      <div class="marker"><div class="icon" v-html="entry_point_controller.icon"></div></div>
    </yandex-map-marker>

    <yandex-map-marker v-model="intersection_point_model" :settings="intersection_point_controller.settings" style="width:0px;height:0px;">
      <div class="marker"><div class="icon" v-html="intersection_point_controller.icon"></div></div>
    </yandex-map-marker>

    <yandex-map-marker v-model="observation_point_model" :settings="observation_point_controller.settings" style="width:0px;height:0px;">
      <div class="marker"><div class="icon" v-html="observation_point_controller.icon"></div></div>
    </yandex-map-marker>


    <yandex-map-marker v-model="max_overpressure_point_model" :settings="max_overpressure_point_controller.settings" style="width:0px;height:0px;">
      <div class="marker"><div class="icon" v-html="max_overpressure_point_controller.icon"></div></div>
    </yandex-map-marker>
    <yandex-map-marker v-model="max_thermal_effect_point_model" :settings="max_thermal_effect_point_controller.settings" style="width:0px;height:0px;">
      <div class="marker"><div class="icon" v-html="max_thermal_effect_point_controller.icon"></div></div>
    </yandex-map-marker>

    <yandex-map-listener
    :settings="{
      onActionEnd: map_drag_event,
    }"
  />

  </yandex-map>
  <div class="flex_col_center_center">
    <h3>{{$t('calculator.schema.legend')}}</h3>
    <div class="flex_col">
      <div class="flex_row_left_center">
        <div class="legend_marker"><div class="icon" v-html="entry_point_controller.icon"></div></div><div class="legend_marker_title">{{$t('calculator.inputs.zero point.entry point 100km')}}</div>
      </div>
      <div class="flex_row_left_center">
        <div class="legend_marker"><div class="icon" v-html="intersection_point_controller.icon"></div></div><div class="legend_marker_title">{{$t('calculator.inputs.zero point.surface intersection')}}</div>
      </div>

      <div class="flex_row_left_center">
        <div class="legend_marker"><div class="icon" v-html="max_overpressure_point_controller.icon"></div></div><div class="legend_marker_title">{{$t('calculator.inputs.zero point.max overpressure point')}}</div>
      </div>
      <div class="flex_row_left_center">
        <div class="legend_marker"><div class="icon" v-html="max_thermal_effect_point_controller.icon"></div></div><div class="legend_marker_title">{{$t('calculator.inputs.zero point.max thermal effect point')}}</div>
      </div>

      <div class="flex_row_left_center">
        <div class="legend_marker"><div class="icon" v-html="observation_point_controller.icon"></div></div><div class="legend_marker_title">{{$t('calculator.schema.Observation point')}}</div>
      </div>
    </div>
    <!-- <div>location: {{ LOCATION }}</div> -->
  </div>
</div>
</template>

<script setup lang="ts">
import State from './../../../../model/state';


import { YMapMarkerProps } from '@yandex/ymaps3-types/imperative/YMapMarker';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';


let state = ref(State.state)


interface Props {
    size?:number
}
const props = withDefaults(defineProps<Props>(), {
    size: 200
})





const theme = "dark"

// -- map
import { ShallowRef, shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';

import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
  YandexMapControlButton,
  YandexMapZoomControl,
  YandexMapFeature,
  YandexMapListener
} from 'vue-yandex-maps';
import type { YandexMapMarkerPosition } from 'vue-yandex-maps';
import { onMounted, onUnmounted, ref, Ref, triggerRef } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { IGeoPoint } from '../../../../../../core/model/Geometry';
import { LatLon } from 'geodesy/utm';

import type { BehaviorMapEventHandler, BehaviorType, DomEvent } from '@yandex/ymaps3-types';
const BEHAVIOR: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt'];


const map_drag_event = (object: Parameters<BehaviorMapEventHandler>[0]) => {
    console.log(`map_drag_event Object:`, object);
   //triggerRef(LOCATION);
  };





class MarkerModel {
    constructor(
        control: ShallowRef<any>,
        icon: string,
        title: string,
        geo_point: IGeoPoint,
        move_handler: null|((sender: MarkerModel, point:{latitude: number, longitude: number}) => void)
    ) {
        this.control = control;
        this.icon = icon;
        this.settings.coordinates[1] = geo_point.latitude;
        this.settings.coordinates[0] = geo_point.longitude;
        geo_point.changed.on((p, passed) => {
            console.log("map geopoint changed", p, passed);
           
            control.value?.update({
                coordinates: [p.longitude, p.latitude]
            })
           
        });
        this.title = title;
        this.geo_point = geo_point;
        this.outer_move_handler = move_handler;
        if (move_handler == null) {
            this.settings.draggable = false;
        }
    } 
    control: ShallowRef<any>;
    title?: string;
    icon?: string;
    geo_point: IGeoPoint;
    outer_move_handler: null | ((sender: MarkerModel, point:{latitude: number, longitude: number}) => void);


    move(lon: number, lat: number): void {
        if (this.outer_move_handler != null) {
            console.log("lat:", lat, " long:", lon);
            this.outer_move_handler(this, {latitude: lat, longitude: lon});
        }
    }
    settings: YMapMarkerProps = {
        coordinates: [55, 55],
        draggable: true,
        onDragEnd: (...args: any[]) => this.move(args[0][0], args[0][1])
    }
}

const entry_point_model = shallowRef<any | null>(null);
const entry_point_controller = new MarkerModel(entry_point_model, "&#xe902;", "Entry point", state.value.entry_point_geo, null)

const intersection_point_model = shallowRef<any | null>(null);
const intersection_point_controller = new MarkerModel(intersection_point_model, "&#8736;", "Intersection point", state.value.geo_points_controller.intersection_point_geo, null)

const observation_point_model = shallowRef<any | null>(null);
const observation_point_controller = new MarkerModel(observation_point_model, "?", "Observation point", state.value.observation_point_geo, (s, p)=> state.value.observation_point_geo.set(p.latitude, p.longitude, ['map']));


const max_overpressure_point_model = shallowRef<any | null>(null);
const max_overpressure_point_controller = new MarkerModel(max_overpressure_point_model, "&#xe904;", "Max overpressure point", state.value.geo_points_controller.max_overpressure_point_geo, null)

const max_thermal_effect_point_model = shallowRef<any | null>(null);
const max_thermal_effect_point_controller = new MarkerModel(max_thermal_effect_point_model, "&#xe9a9;", "Max thermal effect point", state.value.geo_points_controller.max_thermal_effect_point_geo, null)


const lineCoordinates = ref<LngLat[]>([
    [state.value.geo_points_controller.intersection_point_geo.longitude, state.value.geo_points_controller.intersection_point_geo.latitude],
    [state.value.entry_point_geo.longitude, state.value.entry_point_geo.latitude],
    // entry_point_model.value.settings.coordinates,
    // intersection_point_model.value.settings.coordinates
]);


// const markers3:MarkerModel[] = [
//     new MarkerModel("&#xe902;", "Entry point", state.value.entry_point_geo, null),
//     //new MarkerModel("&#8736;","Surface intersection point", state.value.geo_points_controller.intersection_point_geo),
//     // new MarkerModel("&#xe904;", "Effective thermal point source"),
//     // new MarkerModel("&#xe9a9;",  "Effective overpressure point source"),
//     new MarkerModel("?", "Observation point", state.value.observation_point_geo, (s, p)=> state.value.observation_point_geo.set(p.latitude, p.longitude, [])),
// ]



//Можно использовать для различных преобразований
const map = shallowRef<null | YMap>(null);

const handleClick = (event: MouseEvent) => console.log(event);
    
onMounted(() => {
    console.log('map onMounted register callback');
    state.value.geo_points_controller.observation_point.changed.on((s, p)=> {
        triggerRef(state);
        if (!p.includes("map")){
          test_set_center();
        }
    });
    state.value.entry_point_geo.changed.on((s, p)=> {
        lineCoordinates.value[1] = [s.longitude, s.latitude];
        test_set_center();
    });
    state.value.geo_points_controller.intersection_point_geo.changed.on((s, p)=> {
        lineCoordinates.value[0] = [s.longitude, s.latitude];
        test_set_center();
    });
    setTimeout(test_set_center, 1000);
})



const defaultMarker = shallowRef<YMapDefaultMarker | null>(null);

const onDragMove = (...args: any[]) => {
    triggerRef(defaultMarker);
    console.log(args);
};

const onDragEnd = (...arhs: any[]) => {
    //triggerRef(defaultMarker);
    console.log("on drag end,",  arhs);
    //triggerRef(state);
    // entry_point_marker.value?.update({
    //     coordinates: [55, 60]
    // })
    // console.log("on drag end updated,",  entry_point_marker.value);

}




// entry point
//const entry_point_marker = shallowRef<any | null>(null);

const entry_point_marker_onDragEnd = (...args: any[]) => {
    console.log('entry_point_marker_onDragEnd', args);
    //triggerRef(entry_point_marker);
    console.log(args);
};
const entry_point_settings: YMapMarkerProps = {
    coordinates: [55, 60],
    draggable: true,
    onDragEnd: (...args: any[]) => entry_point_marker_onDragEnd(args),
}




const test_set_center = () => {


  let arr = [
    state.value.entry_point_geo,
    state.value.geo_points_controller.intersection_point_geo,
    state.value.observation_point_geo
  ]

  let settings_bounds =  [
    [
      Math.min(...arr.map(s => s.longitude)),
      Math.min(...arr.map(s => s.latitude))
    ], [
      Math.max(...arr.map(s => s.longitude)),
      Math.max(...arr.map(s => s.latitude))
    ]];

  let extlong = 0.1* Math.abs(settings_bounds[1][0] - settings_bounds[0][0])
  let ext_lat = 0.1* Math.abs(settings_bounds[1][1] - settings_bounds[0][1])


  map.value?.setLocation({
    // center: [56,60],
    // zoom: 5
    bounds:[
      [settings_bounds[0][0] - extlong,settings_bounds[0][1]-ext_lat],
      [settings_bounds[1][0]+extlong,settings_bounds[1][1]+ext_lat]
    ]
  
  })
  console.log("clicked set center button", [
      [settings_bounds[0][0] - extlong,settings_bounds[0][1]-ext_lat],
      [settings_bounds[1][0]+extlong,settings_bounds[1][1]+ext_lat]
    ]);
}

const calc_center_for_map = (): {latitude:number, longitude: number} => {
  let arr = [
    state.value.entry_point_geo,
    state.value.geo_points_controller.intersection_point_geo,
    state.value.observation_point_geo
  ]

  let settings_bounds =  [
    [
      Math.min(...arr.map(s => s.longitude)),
      Math.min(...arr.map(s => s.latitude))
    ], [
      Math.max(...arr.map(s => s.longitude)),
      Math.max(...arr.map(s => s.latitude))
    ]];
  return {
    latitude: (settings_bounds[1][1] + settings_bounds[0][1])/2,
    longitude: (settings_bounds[1][0] + settings_bounds[0][0])/2,
  }
}

const calc_center_and_convert_to_LngLat = ():LngLat => {
  let res = calc_center_for_map();
  return [res.longitude, res.latitude];
}

const LOCATION: YMapLocationRequest = {
  center: calc_center_and_convert_to_LngLat(), // starting position [lng, lat]
  zoom: 6, // starting zoom
};

</script>


<style scoped lang="scss">
.map_wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    height: 100%;
}

.marker {
    margin-top: -25px;
    margin-left: -25px;
    position: relative;
    width: 50px;
    height: 50px;
    background: rgba(80, 80, 80, 1);
    border-radius: 50%;
    border: 1px solid rgb(220, 220, 220);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    text-align: center;
    font-weight: bold;
    line-height: 20px;
    font-size: 24px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .icon{
        color:rgb(220, 220, 220);
        display: flex;
    
        font-family: 'asteroidhazard' !important;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        font-size: 36px;
    }
    &:hover{               
        border: 2px solid rgb(255, 255, 255); 
        background: rgba(128, 128, 128, 1);
        color:rgb(255, 255, 255);
        .icon{
            color:rgb(255, 255, 255);
        }
    }
}

.legend_marker {
    width: 34px;
    height: 34px;
    background: rgba(80, 80, 80, 1);
    border-radius: 50%;
    border: 1px solid rgb(220, 220, 220);
    text-align: center;
    font-weight: bold;
    line-height: 20px;
    font-size: 14px;

    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .icon{
        color:rgb(220, 220, 220);
        display: flex;
    
        font-family: 'asteroidhazard' !important;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        font-size: 22px;
    }
}
.legend_marker_title{
  margin-left: 10px;
}

  .marker_figure{
      
      text.icon {
          font-family: 'asteroidhazard' !important;
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          font-size: 24px;
      }
  }
</style>
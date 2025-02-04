<template>
<div class="input_summary_wrapper">
        <div class="input_summary_center">
                    <h2>{{$t('calculator.input_summary.title')}}</h2>

      
        <v-card
        elevation="2"
        shaped
        >
        <v-row style="margin:20px; flex-grow:0">
         <v-col cols="12" md="4">
                <v-card-title>{{$t("calculator.headers.Projectile parameters")}}</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.diameter.label')}}: </span>
                    <span class="input_parameter_value">{{state.variant.diameter}} {{$t('calculator.dimensions.m')}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.density.label')}}: </span>
                    <span class="input_parameter_value">{{state.variant.density}} <span v-html="$t('calculator.dimensions.kg/m3')"></span></span>
                </div>
                <div  v-if="state.visual_settings.is_debug">
                    <span class="input_parameter_name">{{$t('calculator.input_summary.energy')}}: </span>
                    <span class="input_parameter_value">{{state.variant.kenergy}} {{$t('calculator.dimensions.J')}}</span>
                </div>
                <div  v-if="state.visual_settings.input_mode == InputModes.extended">
                    <span class="input_parameter_name">{{$t('calculator.input_summary.energy')}}: </span>
                    <span class="input_parameter_value">
                        {{$format.dimension_prefix_format(state.variant.kenergy)}}{{$t('calculator.dimensions.J')}}
                       (<span v-html="$format.power_format(state.variant.kenergy, null).html"/> {{$t('calculator.dimensions.J')}})
                    </span>
                </div>
                <div  v-if="state.visual_settings.is_debug">
                    <span class="input_parameter_name">energy_tnt: </span>
                    <span class="input_parameter_value">{{state.variant.kenergy_kttnt}} ktTNT</span>
                </div>
                <div class="flex_row_left_top">
                    <div class="input_parameter_name">{{$t('calculator.input_summary.energy_tnt')}}:&nbsp;</div>
                    <div class="input_parameter_value">
                        {{$format.dimension_prefix_format(1000.*state.variant.kenergy_kttnt)}}{{$t('calculator.dimensions.t tnt')}}
                        <span  v-if="state.visual_settings.input_mode == InputModes.extended"><br/>
                        <span v-html="$format.power_format(1000.*state.variant.kenergy_kttnt, null).html"/> {{$t('calculator.dimensions.t tnt')}}
                        </span>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="4">
                <v-card-title>{{$t("calculator.headers.Entry parameters")}}</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.velocity.label')}}: </span>
                    <span class="input_parameter_value">{{state.variant.velocity}} {{$t('calculator.dimensions.km/s')}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.entry angle.label')}}: </span>
                    <span class="input_parameter_value">{{state.variant.angle}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                <div v-if="state.visual_settings.input_mode == InputModes.extended">
                    <span class="input_parameter_name">{{$t('calculator.inputs.entry vector.latitude')}}: </span>
                    <span class="input_parameter_value">{{state.entry_point_geo.latitude}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                <div v-if="state.visual_settings.input_mode == InputModes.extended">
                    <span class="input_parameter_name">{{$t('calculator.inputs.entry vector.longitude')}}: </span>
                    <span class="input_parameter_value">{{state.entry_point_geo.longitude}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                <div v-if="state.visual_settings.input_mode == InputModes.extended">
                    <span class="input_parameter_name">{{$t('calculator.inputs.entry vector.azimuth')}}: </span>
                    <span class="input_parameter_value">{{state.entry_point_geo.azimuth}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                <div  v-if="state.visual_settings.is_debug">
                    <span class="input_parameter_name">entry point: </span>
                    <span class="input_parameter_value">{{state.geo_points_controller.entry_point.x}}, {{state.geo_points_controller.entry_point.y}}</span>
                </div>
                <div  v-if="state.visual_settings.is_debug">
                    <span class="input_parameter_name">Intersection point geo: </span>
                    <span class="input_parameter_value">{{state.geo_points_controller.intersection_point_geo.latitude}}{{$t('calculator.dimensions.degree')}}, {{state.geo_points_controller.intersection_point_geo.longitude}}{{$t('calculator.dimensions.degree')}}</span>
                </div>


                <v-card-title>{{$t("calculator.headers.Target parameters")}}</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.target type.label')}}: </span>
                    <span class="input_parameter_value">
                        {{ $t('calculator.inputs.target type.' + {1600: 'sand', 2650: 'rock'}[state.target.target_density]) }} 
                        <span v-if="state.visual_settings.input_mode == InputModes.extended">(ρ = {{state.target.target_density}} <span v-html="$t('calculator.dimensions.kg/m3')"></span>)</span>
                    </span>
                </div>
            </v-col>
            <v-col cols="12"  md="4">
                <v-card-title>{{$t("calculator.headers.Observation point")}}</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.zero point.label')}}: </span>
                    <span class="input_parameter_value">{{ 
                    $t('calculator.inputs.zero point.' + 
                    ['entry point 100km', 'max overpressure point', 'surface intersection', 'max thermal effect point']
                        [state.observation_point_inputs.relative_to-1])}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.observation point.distance angle.distance')}}: </span>
                    <span class="input_parameter_value">{{state.observation_point_inputs.distance_angle.distance.toFixed(0)}} {{$t('calculator.dimensions.km')}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.observation point.distance angle.angle')}}: </span>
                    <span class="input_parameter_value">{{state.observation_point_inputs.distance_angle.angle.toFixed(0)}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.observation point.along across.along')}}: </span>
                    <span class="input_parameter_value">{{state.observation_point_inputs.along_across.along.toFixed(0)}} {{$t('calculator.dimensions.km')}}</span>
                </div>
                <div>
                    <span class="input_parameter_name">{{$t('calculator.inputs.observation point.along across.across')}}: </span>
                    <span class="input_parameter_value">{{state.observation_point_inputs.along_across.across.toFixed(0)}} {{$t('calculator.dimensions.km')}}</span>
                </div>

                <div  v-if="state.visual_settings.input_mode == InputModes.extended">
                    <span class="input_parameter_name">{{$t('calculator.inputs.observation point.latitude longitude.coordinates')}}: </span>
                    <span class="input_parameter_value">{{state.observation_point_geo.latitude.toFixed(4)}}{{$t('calculator.dimensions.degree')}}</span>,
                    <span class="input_parameter_value">{{state.observation_point_geo.longitude.toFixed(4)}}{{$t('calculator.dimensions.degree')}}</span>
                </div>
                


                <div  v-if="state.visual_settings.is_debug">
                    <div>
                        <span class="input_parameter_name">main point: </span>
                        <span class="input_parameter_value">x: {{state.observation_point_inputs.main_point.x}}, y: {{state.observation_point_inputs.main_point.y}}</span>
                    </div>
                    <div>
                        <span class="input_parameter_name">along_across: </span>
                        <span class="input_parameter_value">along: {{state.observation_point_inputs.along_across.along}}, across: {{state.observation_point_inputs.along_across.across}}</span>
                    </div>
                    <div>
                        <span class="input_parameter_name">distance_angle: </span>
                        <span class="input_parameter_value">distance: {{state.observation_point_inputs.distance_angle.distance}}, angle: {{state.observation_point_inputs.distance_angle.angle}}</span>
                    </div>
                </div>
            </v-col>
        </v-row>
        </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import State from './../../../model/state';
import { InputModes } from '../../../model/VisualSettings';
import MathExt from '../../../../../core/lib/MathExt';

import {ref} from 'vue'

let state = ref(State.state)



</script>

<style scoped lang="scss">
    .input_parameter_name {
        font-style: normal;
        font-size: 12pt;

    }
    .input_parameter_value {
        font-style: italic;
        font-size: 12pt;
    }
    .input_summary_wrapper{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        .input_summary_center{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            flex-grow: 1;
        }
    }
</style>
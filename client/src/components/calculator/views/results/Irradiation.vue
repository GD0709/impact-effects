<template>
    <Expansion icon="ah-fire" :title="$t('calculator.results.irradiation.Irradiation')">
            <template v-slot:closed>
                {{$t('calculator.results.irradiation.Thermal exposure')}}:
                {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_exposure)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>

            </template>
            <template v-slot:content>
                <div class="results_description" v-html="$t('calculator.results.irradiation.description')"></div>
                <div class="result_effect" v-if="state.variant.diameter < 150">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Maximal thermal exposure')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.max_irradiation_energy)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>
                </div>
                <div class="result_effect" v-if="state.variant.diameter < 150">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Maximal irradiation flux')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.max_irradiation_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation altitude')}}:</span>
                    {{$format.round(irradiation.hrad, null)}}  {{$t('calculator.dimensions.km')}}
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation pulse duration')}}:</span>
                    {{$format.round(irradiation.trad, null)}}  {{$t('calculator.dimensions.s')}}
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation efficiency')}}:</span>
                    {{$format.round(irradiation.eta, null)}}%
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Distance to the center')}}:</span>
                    {{$format.round(irradiation.zero_point, null)}} {{$t('calculator.dimensions.km')}}
                </div>


                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal exposure in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_exposure)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>
                </div>
                <div class="result_effect" v-if="state.variant.diameter < 150">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal flux in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div>    
            
            </template>
        </Expansion>
</template>

<script setup lang="ts">
import State from './../../../../model/state';
import Expansion from './Expansion.vue';

import {Ref, ref, onMounted, triggerRef} from 'vue'

let state = ref(State.state)
let irradiation = ref(State.state.effects.irradiation)

onMounted(() => {
    state.value.effects.effects_updated.on((effects, passed)=> {
        triggerRef(irradiation)
    })
})
</script>


<style scoped lang="scss">
</style>
<template>
    <Expansion icon="ah-agw" :title="$t('calculator.results.atmospheric_disturbances.Atmospheric disturbances')">
            <template v-slot:closed>
                {{$t('calculator.results.atmospheric_disturbances.Peak amplitude of relative density oscillations at an altitude of 300 km')}}:
                {{$format.round(atmospheric_disturbances.peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km, null)}}
            
            </template>
            <template v-slot:content>

                <div class="results_description" v-html="$t('calculator.results.atmospheric_disturbances.description')"></div>
                
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.atmospheric_disturbances.Peak amplitude of relative temperature oscillations at an altitude of 100 km')}}:&nbsp;</span>
                    <span v-html="$format.round(atmospheric_disturbances.peak_amplitude_of_relative_temperature_oscillations_at_an_altitude_of_100_km, null)"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.atmospheric_disturbances.Peak amplitude of relative density oscillations at an altitude of 300 km')}}:&nbsp;</span>
                    <span v-html="$format.round(atmospheric_disturbances.peak_amplitude_of_relative_density_oscillations_at_an_altitude_of_300_km, null)"/>
                </div>    

                




            </template>
        </Expansion>
</template>

<script setup lang="ts">
import { triggerRef } from 'vue';
import State from './../../../../model/state';
import Expansion from './Expansion.vue';

import {ref, onMounted} from 'vue'

let state = ref(State.state)
let atmospheric_disturbances = ref(State.state.effects.atmospheric_disturbances)

onMounted(() => {
    state.value.effects.effects_updated.on((effects, passed)=> {
        triggerRef(atmospheric_disturbances)
    })
})
</script>


<style scoped lang="scss">
</style>
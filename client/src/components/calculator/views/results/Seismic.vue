<template>
    <Expansion icon="ah-seismic" :title="$t('calculator.results.seismic.Seismic effect')">
            <template v-slot:closed>
                {{$t('calculator.results.seismic.Magnitude')}}:
                {{$format.dimension_prefix_format(seismic.richter_scale_magnitude)}}
            </template>
            <template v-slot:content>
                <div class="results_description" v-html="$t('calculator.results.seismic.description')"></div>
                
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.seismic.Richter scale magnitude of the impact event')}}:&nbsp;</span>
                    <span v-html="$format.round(seismic.richter_scale_magnitude, -1)"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.seismic.Mercally scale intensity')}}:&nbsp;</span>
                    <span v-html="Seismic.Ieff_to_string(seismic.mercally_scale_intensity)"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.seismic.The peak ground velocity')}}:</span>
                    {{$format.round(seismic.PGV, null)}} <span v-html="$t('calculator.dimensions.cm/s')"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.seismic.The peak ground acceleration')}}:</span>
                    {{$format.round(seismic.PGA, null)}} <span v-html="$t('calculator.dimensions.cm/s2')"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.seismic.Time of arrival to the observation point')}}:</span>
                    {{$format.seconds_to_string(seismic.arrival_time, false)}}
                </div>    




            </template>
        </Expansion>
</template>

<script setup lang="ts">
import { triggerRef } from 'vue';
import State from './../../../../model/state';
import Seismic from './../../../../../../core/model/Effects/Seismic';
import Expansion from './Expansion.vue';

import {ref, onMounted} from 'vue'

let state = ref(State.state)
let seismic = ref(State.state.effects.seismic)

onMounted(() => {
    state.value.effects.effects_updated.on((effects, passed)=> {
        triggerRef(seismic)
    })
})
</script>


<style scoped lang="scss">
</style>
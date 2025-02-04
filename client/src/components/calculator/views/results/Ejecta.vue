<template>
    <Expansion icon="ah-ejecta" :title="$t('calculator.results.ejecta.Ejecta')">
            <template v-slot:closed>
                <span v-if="state.variant.diameter < crater.diameter_min">{{$t('calculator.results.ejecta.no ejecta')}}</span>
                <span v-if="state.variant.diameter >= crater.diameter_min">{{$t('calculator.results.ejecta.Ejecta forming event')}}</span>
            </template>
            <template v-slot:content>
                <div v-if="state.variant.diameter < crater.diameter_min">
                {{$t('calculator.results.ejecta.no ejecta')}}
            </div>
            <div v-if="state.variant.diameter >= crater.diameter_min">
                <div class="results_description" v-html="$t('calculator.results.ejecta.description')"></div>
                
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.ejecta.Thickness of ejecta blanket')}}:&nbsp;</span>
                    <span v-html="$format.power_format(crater.ejecta.ejecta_thickness, null).html"/><span v-html="$t('calculator.dimensions.m')"/>
                </div>
                <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.ejecta.Fraction of melt in ejecta')}}:</span>
                    {{$format.round(crater.ejecta.melted_ejecta_thickness*100, -1)}}%
                </div>
            
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
let crater = ref(State.state.effects.crater)

onMounted(() => {
    state.value.effects.effects_updated.on((effects, passed)=> {
        triggerRef(crater)
    })
})
</script>


<style scoped lang="scss">
</style>
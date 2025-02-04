<template>
    <Expansion icon="ah-crater" :title="$t('calculator.results.crater.Crater')">
            <template v-slot:closed>
                <span v-if="state.variant.diameter < crater.diameter_min">{{$t('calculator.results.crater.no crater')}}</span>
                <span v-if="state.variant.diameter >= crater.diameter_min">{{$t('calculator.results.crater.Crater forming event')}}</span>
            </template>
            <template v-slot:content>
                <div v-if="state.variant.diameter < crater.diameter_min">
                    {{$t('calculator.results.crater.no crater')}}
                </div>
                <div v-if="state.variant.diameter >= crater.diameter_min" class="flex_col">
                    <h3>{{$t('calculator.results.crater.transient.Transient crater parameters')}}</h3>
                    <div class="results_description" v-html="$t('calculator.results.crater.transient.description')"></div>
                    
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.transient.Transient crater size')}}:</span>
                        {{$format.dimension_prefix_format(crater.transient_size)}}<span v-html="$t('calculator.dimensions.m')"/>
                    </div>
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.transient.Transient crater depth')}}:</span>
                        {{$format.dimension_prefix_format(crater.transient_depth)}}<span v-html="$t('calculator.dimensions.m')"/>
                    </div>

                    <h3>{{$t('calculator.results.crater.final.Final crater parameters')}}</h3>
                    <div class="results_description" v-html="$t('calculator.results.crater.final.description')"></div>
                    
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.final.Crater type')}}:</span>
                        {{$t('calculator.results.crater.final.' + 
                    ['simple', 'complex']
                        [crater.crater_type -1])}}
                    </div>

                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.final.Final crater diameter')}}:</span>
                        {{$format.dimension_prefix_format(crater.final_size)}}<span v-html="$t('calculator.dimensions.m')"/>
                    </div>
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.final.Depth of a final crater')}}:</span>
                        {{$format.dimension_prefix_format(crater.final_depth)}}<span v-html="$t('calculator.dimensions.m')"/>
                    </div>
                </div>

                <div v-if="state.variant.diameter >= crater.diameter_min && crater.crater_type == 1">
                    <h3>{{$t('calculator.results.crater.melt.Melt target material in the crater counting')}}</h3>
                    <div class="results_description" v-html="$t('calculator.results.crater.melt.description')"></div>
                    
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.melt.Thickness of a breccia lens')}}:</span>
                        {{$format.dimension_prefix_format(crater.thickness_of_a_breccia_lens)}}<span v-html="$t('calculator.dimensions.m')"/>
                    </div>
                    <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.melt.Melt volume')}}:</span>
                        {{$format.dimension_prefix_format(crater.melt_volume / 10**9)}}<span v-html="$t('calculator.dimensions.km3')"/>
                    </div>
                        <div class="result_effect">
                        <span class="results_effects_name">{{$t('calculator.results.crater.melt.Melt thickness')}}:</span>
                        {{$format.dimension_prefix_format(crater.melt_thickness)}}<span v-html="$t('calculator.dimensions.m')"/>
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
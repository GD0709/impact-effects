<template>
    <Expansion icon="ah-fire" :title="$t('calculator.results.irradiation.Irradiation')">
            <template v-slot:closed>
                {{$t('calculator.results.irradiation.Thermal exposure')}}:
                {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_exposure)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>

            </template>
            <template v-slot:content>
                <div class="results_description" v-html="$t('calculator.results.irradiation.description')"></div>

                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Maximal thermal exposure.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Maximal thermal exposure.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Maximal thermal exposure')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.max_irradiation_energy)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>
                </div>

                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Maximal irradiation flux.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Maximal irradiation flux.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Maximal irradiation flux')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.max_irradiation_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div>

                <!-- <div class="result_effect" v-if="state.variant.diameter < 150">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Maximal irradiation flux')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.max_irradiation_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div> -->


                <!-- <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation altitude')}}:</span>
                    {{$format.round(irradiation.hrad, null)}}  {{$t('calculator.dimensions.km')}}
                </div> -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Radiation altitude.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Radiation altitude.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation altitude')}}:</span>
                    {{$format.round(irradiation.hrad, null)}}<span v-html="$t('calculator.dimensions.km')"/>
                </div>


                <!-- <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation pulse duration')}}:</span>
                    {{$format.round(irradiation.trad, null)}}  {{$t('calculator.dimensions.s')}}
                </div> -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Radiation pulse duration.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Radiation pulse duration.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation pulse duration')}}:</span>
                    {{$format.round(irradiation.trad, null)}}<span v-html="$t('calculator.dimensions.s')"/>
                </div>





                <!-- <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation efficiency')}}:</span>
                    {{$format.round(irradiation.eta, null)}}%
                </div> -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Radiation efficiency.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Radiation efficiency.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Radiation efficiency')}}:</span>
                    {{$format.round(irradiation.eta, null)}}%
                </div>




                <!-- <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Distance to the center')}}:</span>
                    {{$format.round(irradiation.zero_point, null)}} {{$t('calculator.dimensions.km')}}
                </div> -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Distance to the center.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Distance to the center.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Distance to the center')}}:</span>
                    {{$format.round(irradiation.zero_point, null)}}<span v-html="$t('calculator.dimensions.km')"/>
                </div>





                <!-- <div class="result_effect">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal exposure in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_exposure)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>
                </div> -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Thermal exposure in the point of observation.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Thermal exposure in the point of observation.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal exposure in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_exposure)}}<span v-html="$t('calculator.dimensions.J/cm2')"/>
                </div>


                <!-- <div class="result_effect" v-if="state.variant.diameter < 150">
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal flux in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div>     -->
                <div class="result_effect"  v-if="state.variant.diameter < 150">
                    <help :help_title="$t('calculator.results.irradiation.info.Thermal flux in the point of observation.header')">
                        <div>{{ $t('calculator.results.irradiation.info.Thermal flux in the point of observation.body') }}</div>
                        <!-- <Publication :publication="publications[24]" :large="true" :links="true"
                            style="margin-top: 16px;"/> -->
                    </help>
                    <span class="results_effects_name">{{$t('calculator.results.irradiation.Thermal flux in the point of observation')}}:</span>
                    {{$format.dimension_prefix_format(irradiation.point_assesment.thermal_flux)}}<span v-html="$t('calculator.dimensions.W/cm2')"/>
                </div>
            
            </template>
        </Expansion>
</template>

<script setup lang="ts">
import State from './../../../../model/state';
import Expansion from './Expansion.vue';
import {publications} from '@/model/articles'
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
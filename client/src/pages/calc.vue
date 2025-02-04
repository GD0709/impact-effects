<template>
    <div style="" class="calculator">
         <v-container>
            <div class="tab_input_mode_switcher_placer">
                <div class="tab_input_mode_switcher">
                    <v-tabs
                        v-model="state.visual_settings.input_mode"
                        background-color="transparent"
                        color="primary"
                        grow
                        >
                        <v-tab>
                            {{$t('calculator.headers.basic')}}
                        </v-tab>
                        <v-tab>
                            {{$t('calculator.headers.extended')}}
                        </v-tab>

                    </v-tabs>
                </div>

            </div>
 
            <div v-show="state.visual_settings.input_mode == InputModes.basic">        <BasicInput /></div>
            <div v-show="state.visual_settings.input_mode == InputModes.extended">        <ExtendedInput /></div>
            <InputSummary/>
            <Results/>
        </v-container>
    </div>

</template>


<script lang="ts" setup>
import {ref} from 'vue';
import BasicInput from "../components/calculator/views/input/BasicInput.vue";
import ExtendedInput from "../components/calculator/views/input/ExtendedInput.vue";
import InputSummary from '../components/calculator/views/InputSummary.vue';
import Results from '../components/calculator/views/results/Results.vue';
import State from '../model/state';
import { InputModes } from '../model/VisualSettings';


const state = ref(State.state)
</script>
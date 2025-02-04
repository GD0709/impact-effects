<template>

    <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">
        <h3>{{ $t("calculator.headers.Projectile parameters")}}</h3>
        <FieldInput
            id="variant.diameter"
            :accuracy="0"
            :log_slider="true"
            :min="15"
            :max="3000"
            :rules="input_rules.diameter"
            :label="$t('calculator.inputs.diameter.label')"
            :help_title="$t('calculator.inputs.diameter.label')"
            :help_text="$t('calculator.inputs.diameter.help')"
            :dimension="$t('calculator.dimensions.m')"
            prefix="D ="
            v-model:value="state.variant.diameter"
            />
        <FieldInput
            id="variant.density"
            :accuracy="0"
            :min="500"
            :max="4000"
            :rules="input_rules.density"
            :label="$t('calculator.inputs.density.label')"
            :help_title="$t('calculator.inputs.density.label')"
            :help_text="$t('calculator.inputs.density.help')"
            :dimension="$t('calculator.dimensions.kg/m3')"
            prefix="ρ ="
            v-model:value="state.variant.density">
            <template v-slot:slider_hint>
                <div style="display: flex; flex-grow: 1; flex-direction: row; justify-content: space-around;">
                    <v-btn variant="text" size="x-small" class="text-none" :class="{ 'text-primary': (state.variant.density<=1300) }"
                    v-on:click="state.variant.density=1000">comet</v-btn>
                    <v-btn variant="text" size="x-small" class="text-none" :class="{ 'text-primary': (2000<=state.variant.density) }"
                    v-on:click="state.variant.density=3320">asteroid</v-btn>
                </div>
            </template>
        </FieldInput>
        <!-- <div>
            {{ state.variant.diameter }}
            {{ state.variant.density }}
        </div> -->
    </v-col>

</template>

<script lang="ts" setup>

import FieldInput from "../../input/FieldInput.vue"
import input_rules from "./InputRules"
import State from './../../../../model/state';

import {ref} from 'vue'

let state = ref(State.state)
</script>
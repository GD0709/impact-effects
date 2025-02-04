<template>

     <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">
        <h3>{{ $t("calculator.headers.Entry parameters")}}</h3>
        <FieldInput
            id="variant.velocity"
            :accuracy="0"
            :min="12"
            :max="72"
            :rules="input_rules.velocity"
            :label="$t('calculator.inputs.velocity.label')"
            :help_title="$t('calculator.inputs.velocity.label')"
            :help_text="$t('calculator.inputs.velocity.help')"
            :dimension="$t('calculator.dimensions.km/s')"
            prefix="V ="
            v-model:value="state.variant.velocity"
            />
        <FieldInput
            id="variant.angle"
            :accuracy="0"
            :min="15"
            :max="90"
            :rules="input_rules.entry_angle"
            :label="$t('calculator.inputs.entry angle.label')"
            :help_title="$t('calculator.inputs.entry angle.label')"
            :help_text="$t('calculator.inputs.entry angle.help')"
            :dimension="$t('calculator.dimensions.degree')"
            prefix="α ="
            v-model:value="state.variant.angle">
        </FieldInput>
        <!-- <div>
            {{ state.variant.velocity }}
            {{ state.variant.angle }}
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
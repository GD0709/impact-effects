<template>
    <v-row no-gutters>
        <ProjectileInput/>
        <Entry/>
    </v-row >

    <v-row>
            <h3>{{$t("calculator.headers.Observation point")}}</h3>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">

                <FieldInput
                    :log_slider="true"
                    v-model:value="state.observation_point_inputs.distance_angle.distance"
                    id="basic.op.distance"
                    :accuracy="0"
                    :min="0"
                    :max="4242"
                    :rules="input_rules.input_distance"
                    :label="$t('calculator.inputs.observation point.distance angle.distance by zeropoint.entry point 100km.distance')"
                    :help_title="$t('calculator.inputs.observation point.distance angle.distance by zeropoint.entry point 100km.help title')"
                    :help_text="$t('calculator.inputs.observation point.distance angle.distance by zeropoint.entry point 100km.help')"
                    :dimension="$t('calculator.dimensions.km')"
                    prefix="L ="
                />

            </v-col>
            <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">

                <FieldInput
                    id="basic.op.angle"
                    :accuracy="0"
                    :log_slider="false"
                    v-model:value="state.observation_point_inputs.distance_angle.angle"
                    :min="0"
                    :max="360"
                    :rules="input_rules.input_along_across"
                    :label="$t('calculator.inputs.observation point.distance angle.angle')"
                    :help_title="$t('calculator.inputs.observation point.distance angle.angle help title')"
                    :help_text="$t('calculator.inputs.observation point.distance angle.angle help')"
                    :dimension="$t('calculator.dimensions.degree')"
                    prefix="𝜓 ="
                />

            </v-col>
        </v-row>
</template>

<script lang="ts" setup>
import FieldInput from "../../input/FieldInput.vue"
import ProjectileInput from './Projectile.vue'
import Entry from './Entry.vue'
import State from "./../../../../model/state"
import {ref} from "vue"
import input_rules from "./InputRules"

const state = ref(State.state)
</script>
<template>
    <v-row no-gutters>
        <ProjectileInput/>
        <Entry/>
    </v-row >

    <v-row no-gutters >
        <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">
            <h3>{{$t("calculator.headers.Target parameters")}}</h3>
                
                    <div >
                        <label class="radio_label theme--light" style="">{{$t('calculator.inputs.target type.label')}} 
                            <help :help_title="$t('calculator.inputs.target type.label')">
                                <span v-html="$t('calculator.inputs.target type.help')"/>
                            </help>
                        </label>

                        <v-radio-group class="radio_with_label"
                            v-model="state.target.target_density"
                            row
                            >
                            <v-radio
                                color="primary"
                                density="compact"
                                :label="$t('calculator.inputs.target type.rock')"
                                :value="2650"
                            ></v-radio>
                            <v-radio
                                color="primary"
                                density="compact"
                                :label="$t('calculator.inputs.target type.sand')"
                                :value="1600"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <div >
                        <label class="radio_label theme--light" style="">{{$t('calculator.inputs.zero point.label')}}
                            <help :help_title="$t('calculator.inputs.zero point.label')">
                                <span v-html="$t('calculator.inputs.zero point.help')"/>
                            </help>
                        </label>
                        <v-radio-group class="radio_with_label"
                            v-model="state.observation_point_inputs.relative_to"
                            col
                            >
                            <v-radio
                                :label="$t('calculator.inputs.zero point.surface intersection')"
                                :value="3"
                                color="primary"
                                density="compact"
                            ></v-radio>
                            <v-radio
                                :label="$t('calculator.inputs.zero point.max overpressure point')"
                                :value="2"
                                color="primary"
                                density="compact"
                            ></v-radio>
                            <v-radio
                                :label="$t('calculator.inputs.zero point.max thermal effect point')"
                                :value="4"
                                color="primary"
                                density="compact"
                            ></v-radio>
                            <v-radio
                                :label="$t('calculator.inputs.zero point.entry point 100km')"
                                :value="1"
                                color="primary"
                                density="compact"
                            ></v-radio>
                        </v-radio-group>
                    </div>
        </v-col>
        <v-col cols="12" md="6" no-gutters class="pl-md-3">
            <schema/>
        </v-col>
    </v-row>
    <v-row no-gutters >
            <v-col cols="12" md="6" no-gutters class="pr-md-3 no-gutters">
                <h3>{{$t("calculator.headers.Entry vector")}}</h3>
        
                <!-- <div class="flex_row">
                    <div class="flex_row">
                        <v-text-field
                            variant="underlined"
                            v-model="state.entry_point_geo.latitude" 
                            required      
                            :label="$t('calculator.inputs.entry vector.latitude')+'(' + $t('calculator.dimensions.degree') + ')'"          
                            :rules="input_rules.coordinate"
                        ></v-text-field>
            

                        <v-text-field
                            v-model="state.entry_point_geo.longitude"
                            :rules="input_rules.coordinate"
                            variant="underlined"
                            :label="$t('calculator.inputs.entry vector.longitude')+'(' + $t('calculator.dimensions.degree') + ')'"
                            required
                        ></v-text-field>
                    </div>
                    <help :help_title="$t('calculator.inputs.entry vector.help title')">
                        <span v-html="$t('calculator.inputs.entry vector.help')"/>
                    </help>
                </div> -->
                <div class="flex_row">
                    <div class="flex_row">
                        <NumberInput style="width:50%"
                            id="extended.entry.latitude"
                            v-model:value="state.entry_point_geo.latitude"
                            :label="$t('calculator.inputs.entry vector.latitude')"  
                            :dimension="$t('calculator.dimensions.degree')"        
                            :rules="input_rules.coordinate"
                            :accuracy="4"
                        />
                      
                        <NumberInput  style="width:50%"
                            id="extended.entry.longitude"
                            v-model:value="state.entry_point_geo.longitude"
                            :label="$t('calculator.inputs.entry vector.longitude')" 
                            :dimension="$t('calculator.dimensions.degree')"
                            :rules="input_rules.coordinate"
                            :accuracy="4"
                        />
                    </div>
                    <help :help_title="$t('calculator.inputs.entry vector.help title')">
                        <span v-html="$t('calculator.inputs.entry vector.help')"/>
                    </help>
                </div>
                <!-- <v-row no-gutters class="align-center">
                   
                    
                    
                </v-row> -->

                <field-input
                    v-model:value="state.entry_point_geo.azimuth"
                    id="extended.entry_point.azimuth"
                    :accuracy="0"
                    :min="0"
                    :max="360"
                    :rules="input_rules.azimuth"
                    :label="$t('calculator.inputs.entry vector.azimuth')"
                    :help_title="$t('calculator.inputs.entry vector.azimuth')"
                    :help_text="$t('calculator.inputs.entry vector.azimuth help')"
                    :dimension="$t('calculator.dimensions.degree')"
                    />
                
                <v-col no-gutters class="no-gutters">
                    <h3>{{$t("calculator.headers.Observation point")}}</h3>
            
                        <v-tabs
                            v-model="onservation_input_variant"                        
                            background-color="transparent"
                        color="primary"
                        grow
                            >
                                <v-tab value="one">{{$t('calculator.inputs.observation point.along across.label')}}</v-tab>
                                <v-tab value="two">{{$t('calculator.inputs.observation point.distance angle.label')}}</v-tab>
                                <v-tab value="three">{{$t('calculator.inputs.observation point.latitude longitude.label')}}</v-tab>
                            </v-tabs>

                            <v-card-text>
                            <v-window v-model="onservation_input_variant">
                                <v-window-item value="one">
                                    <div style="margin-top: 12px;">
                                        <FieldInput
                                            id="extended.observation.along"
                                            :log_slider="false"
                                            v-model:value="state.observation_point_inputs.along_across.along"
                                            :min="-3000"
                                            :max="3000"
                                            :accuracy="0"
                                            :rules="input_rules.input_along_across"
                                            :label="$t('calculator.inputs.observation point.along across.along')"
                                            :help_title="$t('calculator.inputs.observation point.along across.along help title')"
                                            :help_text="$t('calculator.inputs.observation point.along across.along help')"
                                            :dimension="$t('calculator.dimensions.km')"
                                            prefix="Ly ="
                                        />
                                        <FieldInput
                                        id="extended.observation.across"
                                            :log_slider="false"
                                            v-model:value="state.observation_point_inputs.along_across.across"
                                            :min="-3000"
                                            :max="3000"
                                            :accuracy="0"
                                            :rules="input_rules.input_along_across"
                                            :label="$t('calculator.inputs.observation point.along across.across')"
                                            :help_title="$t('calculator.inputs.observation point.along across.across help title')"
                                            :help_text="$t('calculator.inputs.observation point.along across.across help')"
                                            :dimension="$t('calculator.dimensions.km')"
                                            prefix="Lx ="
                                        />
                                    </div>
                                </v-window-item>

                                <v-window-item value="two">
                                    <div style="margin-top: 12px;">
                                        <field-input
                                        id="extended.observation.distance"
                                            :log_slider="false"
                                            v-model:value="state.observation_point_inputs.distance_angle.distance"
                                            :min="0"
                                            :max="4242"
                                            :accuracy="0"
                                            :rules="input_rules.input_distance"
                                            :label="$t('calculator.inputs.observation point.distance angle.distance')"
                                            :help_title="$t('calculator.inputs.observation point.distance angle.distance help title')"
                                            :help_text="$t('calculator.inputs.observation point.distance angle.distance help')"
                                            :dimension="$t('calculator.dimensions.km')"
                                            prefix="L ="
                                        />
                                        <field-input
                                        id="extended.observation.angle"
                                            :log_slider="false"
                                            v-model:value="state.observation_point_inputs.distance_angle.angle"
                                            :min="0"
                                            :max="360"
                                            :accuracy="0"
                                            :rules="input_rules.angle"
                                            :label="$t('calculator.inputs.observation point.distance angle.angle')"
                                            :help_title="$t('calculator.inputs.observation point.distance angle.angle help title')"
                                            :help_text="$t('calculator.inputs.observation point.distance angle.angle help')"
                                            :dimension="$t('calculator.dimensions.degree')"
                                            prefix="𝜓 ="
                                        />
                                    </div>
                                </v-window-item>

                                <v-window-item value="three">
                                    <v-row no-gutters class="align-center" style="margin-top: 12px;">
                                        <NumberInput  
                                            id="extended.observation.latitude"
                                            v-model:value="state.observation_point_geo.latitude"
                                            :label="$t('calculator.inputs.entry vector.latitude')" 
                                            :dimension="$t('calculator.dimensions.degree')"
                                            :rules="input_rules.coordinate"
                                            :accuracy="4"
                                        />
                                        <NumberInput  
                                            id="extended.observation.longitude"
                                            v-model:value="state.observation_point_geo.longitude"
                                            :label="$t('calculator.inputs.entry vector.longitude')" 
                                            :dimension="$t('calculator.dimensions.degree')"
                                            :rules="input_rules.coordinate"
                                            :accuracy="4"
                                        />
                                <help :help_title="$t('calculator.inputs.observation point.latitude longitude.help title')">
                                    <span v-html="$t('calculator.inputs.observation point.latitude longitude.help')"/>
                                </help>
                            </v-row>

                                </v-window-item>
                            </v-window>
                        </v-card-text>
            


                    <!-- <v-tabs
                        v-model="onservation_input_variant"
                        background-color="transparent"
                        color="primary"
                        grow
                        >
                        <v-tab>
                            {{$t('calculator.inputs.observation point.along across.label')}}
                        </v-tab>
                        <v-tab>
                            {{$t('calculator.inputs.observation point.distance angle.label')}}
                        </v-tab>
                        <v-tab>
                            {{$t('calculator.inputs.observation point.latitude longitude.label')}}
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="onservation_input_variant">
                        <v-tab-item :v-model="0">
                            along and across
                        </v-tab-item>
                        <v-tab-item :v-model="1">
                            second
                        </v-tab-item>
                        <v-tab-item :v-model="2">
                            third
                        </v-tab-item>
                    </v-tabs-items> -->

                    <!-- <v-tabs
                        background-color="transparent"
                        grow
                        >
                        <v-tab>
                            {{$t('calculator.inputs.observation point.along across.label')}}
                        </v-tab>
                        <v-tab>
                            {{$t('calculator.inputs.observation point.distance angle.label')}}
                        </v-tab>
                        <v-tab>
                            {{$t('calculator.inputs.observation point.latitude longitude.label')}}
                        </v-tab>

                        <v-tab-item>
                            
                            <div style="margin-top: 12px;">

                                <field-input
                                    id="extended.observation.along"
                                    :log_slider="false"
                                    v-model:value="state.observation_point_inputs.along_across.along"
                                    :min="-3000"
                                    :max="3000"
                                    :accuracy="0"
                                    :rules="input_rules.input_along_across"
                                    :label="$t('calculator.inputs.observation point.along across.along')"
                                    :help_title="$t('calculator.inputs.observation point.along across.along help title')"
                                    :help_text="$t('calculator.inputs.observation point.along across.along help')"
                                    :dimension="$t('calculator.dimensions.km')"
                                    prefix="Ly ="
                                />
                                <field-input
                                id="extended.observation.across"
                                    :log_slider="false"
                                    v-model:value:value="state.observation_point_inputs.along_across.across"
                                    :min="-3000"
                                    :max="3000"
                                    :accuracy="0"
                                    :rules="input_rules.input_along_across"
                                    :label="$t('calculator.inputs.observation point.along across.across')"
                                    :help_title="$t('calculator.inputs.observation point.along across.across help title')"
                                    :help_text="$t('calculator.inputs.observation point.along across.across help')"
                                    :dimension="$t('calculator.dimensions.km')"
                                    prefix="Lx ="
                                />
                            </div>
                            
                        </v-tab-item> -->
                        <!-- <v-tab-item>
                            <div style="margin-top: 12px;">
                                <field-input
                                id="OP.distance"
                                    :log_slider="false"
                                    v-model="state.observation_point_inputs.distance_angle.distance"
                                    :min="0"
                                    :max="4242"
                                    :rules="input_rules.input_distance"
                                    :label="$t('calculator.inputs.observation point.distance angle.distance')"
                                    :help_title="$t('calculator.inputs.observation point.distance angle.distance help title')"
                                    :help_text="$t('calculator.inputs.observation point.distance angle.distance help')"
                                    :dimension="$t('calculator.dimensions.km')"
                                    prefix="L ="
                                />
                                <field-input
                                id="OP.angle"
                                    :log_slider="false"
                                    v-model="state.observation_point_inputs.distance_angle.angle"
                                    :min="0"
                                    :max="360"
                                    :rules="input_rules.input_along_across"
                                    :label="$t('calculator.inputs.observation point.distance angle.angle')"
                                    :help_title="$t('calculator.inputs.observation point.distance angle.angle help title')"
                                    :help_text="$t('calculator.inputs.observation point.distance angle.angle help')"
                                    :dimension="$t('calculator.dimensions.degree')"
                                    prefix="𝜓 ="
                                />
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            
                            <v-row no-gutters class="align-center" style="margin-top: 12px;">
                                <v-text-field
                                    v-model="observation_latitude"
                                    :rules="input_rules.coordinate"
                                    :label="$t('calculator.inputs.observation point.latitude longitude.latitude')+'(' + $t('calculator.dimensions.degree') + ')'"
                                    required
                                >
                                </v-text-field>
                    

                                <v-text-field
                                    v-model="observation_longitude"
                                    :rules="input_rules.coordinate"
                                    :label="$t('calculator.inputs.observation point.latitude longitude.longitude')+'(' + $t('calculator.dimensions.degree') + ')'"
                                    required
                                >
                                </v-text-field>
                                <help :help_title="$t('calculator.inputs.observation point.latitude longitude.help title')">
                                    <span v-html="$t('calculator.inputs.observation point.latitude longitude.help')"/>
                                </help>
                            </v-row>
                            <v-row no-gutters class="align-center" v-if="state.visual_settings.is_debug">
                                {{state.observation_point_geo.latitude}}, {{state.observation_point_geo.longitude}}
                            </v-row>

                        </v-tab-item> -->

                    <!-- </v-tabs> -->

                            
                </v-col>
            </v-col>
            <v-col cols="12" md="6" no-gutters class="pl-md-3">
                <Map/>
            </v-col>
        </v-row>
</template>

<script lang="ts" setup>
import FieldInput from "../../input/FieldInput.vue"
import ProjectileInput from './Projectile.vue'
import Entry from './Entry.vue'
import State from "./../../../../model/state"
import {ref, onMounted} from "vue"
import input_rules from "./InputRules"
import NumberInput from "../../input/NumberInput.vue"
import Schema from "../Schema.vue"
import Map from "./Map.vue"
import { triggerRef } from "vue"
const state = ref(State.state)

const onservation_input_variant = ref('along-across')


onMounted(() => {
    state.value.observation_point.changed.on((s, p) => {
        triggerRef(state);
    });
});



const items = ref([
          'Appetizers', 'Entrees', 'Deserts', 'Cocktails',
        ])
</script>


<style scoped lang="scss">
    .radio_with_label{
        margin-top: 0px;
    }
    .radio_label{
            font-size: 12px;
            height: 20px;
            line-height: 20px;
    }
</style>
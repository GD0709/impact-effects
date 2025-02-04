<template>
    <v-expansion-panel  class="result">
        <v-expansion-panel-title >
            <template v-slot:default="{ expanded }">
          <v-row no-gutters  class="header_row"> 
            <span class="icon alert_level_0" :class="icon"/>
            <v-row no-gutters class="header_text_row">
                <v-col cols="12" md="4" class="header_caption" >
                    <span>{{title}}</span>
                </v-col>
                <v-col cols="12" md="8">
                <v-fade-transition leave-absolute>
                    <span v-if="expanded" key="0"> <slot name="opened"/></span>
                    <span v-else key="1"> <slot name="closed"/> </span>
                </v-fade-transition>
                </v-col>
            </v-row>
          </v-row>
        </template>


            <!-- <div class="level_line_header"></div> -->
            <!-- <v-row no-gutters class="header_row">
                
                <span class="icon alert_level_0" :class="icon"/>
                
                <v-row no-gutters class="header_text_row">
                    <v-col cols="12" md="4" class="header_caption" >
                        {{title}}
                    </v-col>
                    <v-col
                        cols="12" md="8"
                        class="text--secondary"
                    >
                        <v-fade-transition leave-absolute>
                            <span
                                v-if="expanded"
                                key="0"
                            >
                                <slot name="opened"/>
                            </span>
                            <span
                                v-else
                                key="1"
                            >
                                <slot name="closed"/>
                            </span>
                        </v-fade-transition>
                    </v-col>
                    {{ expanded }}
                </v-row>
        
            </v-row>-->
        </v-expansion-panel-title>
        <v-expansion-panel-text>
             <slot name="content"/>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<script setup lang="ts">

import {ref} from 'vue'

interface Props {
    icon: string
    title: string

}
const props = withDefaults(defineProps<Props>(), {
    icon: "ah-meteoroid",
    title: ""
})

let expanded: number = 0
const dialog = ref(false)
</script>


<style scoped lang="scss">
</style>
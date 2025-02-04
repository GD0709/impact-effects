<template>
    <div @click="dsclick"><slot/></div>
</template>

<script lang="ts" setup>
import State from '../model/state';
import {ref} from "vue"

const state = ref(State.state)

    const timeout: number = 1000;
    let last_click: number = 0;
    let count: number = 0;

    function dsclick() {
        let now = Date.now();
        if(now - last_click > timeout)
        {
            count = 0;
        }
        
        last_click = now;
        count++;
        if(count >= 5){
            state.value.visual_settings.is_debug = !state.value.visual_settings.is_debug;
            console.log("change debug");
        }
        
    }


</script>

<style scoped lang="scss">

</style>
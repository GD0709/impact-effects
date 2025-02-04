<template>
    <div class="flex_row_center_center">
        <!-- <div class="calculator_input input_text italic_prefix">
            <div style="position:relative">
                <div style="position: absolute;font-size: 12px;white-space: nowrap;" :class="{ 'text-primary': text_is_focused }">
                    <span v-html="label"></span> (<span v-html="dimension"></span>)
                </div>

            </div>
            <v-text-field
                variant="underlined"
                :placeholder="placeholder"
                v-model="text_value" 
                @blur="text_is_focused = false"
                @focus="text_is_focused = true"
                required                
                :rules="rules"
                :prefix="prefix"
                @update:model-value="text_modelValue"
            >
            </v-text-field>
            
        </div> -->
        <!--

                ref="numberinput"

        -->
        <NumberInput
            :id="id"
            :prefix="prefix"
            :rules="rules"
            :label="label"
            :dimension="dimension"
            :placeholder="placeholder"
            :accuracy="accuracy"
            v-model:value="text_value"
            @value_updated="numberinput_changed"
            class="input_text"
            />

        <div class="slider_wrapper">
            <v-slider
            color="primary"
                v-model="slider_value"
                :min="log_slider ? 0 : min"
                :max="log_slider ? 1 : max"
                :step="log_slider ? 0.01 : accuracy"
                @update:model-value="slider_modelValue"
                >                        
            </v-slider>
            <div class="inside">
                <div class="inside_col">{{min}}&nbsp;<span v-html="dimension"></span></div>
                <div class="intermediate">
                    <!-- <slot name="slider_hint"></slot> -->
                </div>
                <div class="inside_col">{{max}}&nbsp;<span v-html="dimension"></span></div>
            </div>
        </div>

        <help :help_title="help_title" :help_text="help_text">
            <!-- <template>
                <slot name="help"/>
            </template> -->
        </help>

       
    </div>
     <!-- debug section -->
     <br/>
        <div v-if="is_debug">
            <div>is_debug: {{ is_debug }}</div>
            <div>text_value: {{ text_value }}</div>
            <div>slider_value: {{ slider_value }}</div>
        </div>
  </template>
  
  <script setup lang="ts">
  import { assertCatchClause } from '@babel/types';
import { ref, watch } from 'vue'
  import { computed } from 'vue';
  import NumberInput from "./NumberInput.vue"


  interface Props {
    id:string
        help_text?: string
        help_title?: string
        prefix?:string
        rules?:Array<((v: any) => string | true)>
 
        label?:string
        dimension?:string
        placeholder?:string


            // slider
        min?: number
        max?: number
        log_slider?: boolean
        accuracy?: number
}

const props = withDefaults(defineProps<Props>(), {
    help_text: "",
    help_title:  "",
    prefix: "",
    rules: () => new Array<(v: any) => string | true>(),

    label: "",
    dimension: "",
    placeholder: "",




        // slider
    min: 0,
    max: 100,
    log_slider: false,
    accuracy: 2,
})

    const numberinput = ref<InstanceType<typeof NumberInput> | null>(null)
    const log_base: number = 0.02;
    

    const is_debug = ref(false)
    function log(...args: any[]): void {
        if (is_debug.value || true) {
            console.log("FieldInput ", props.id, " ", args);
        }
    }

    const emit = defineEmits<{
        value_updated: [value: number]
    }>()
   
    const model_value = defineModel<number>('value', {type: Number})


    let setting_value: number = NaN;   
    
    let text_value = ref(19)
    let slider_value = ref(19)
   

    // text input

    function numberinput_changed(value: number): void {
        log("numberinput_changed:", value);
        if(!isNaN(value)) {
            setting_value = value;
            value_set_slider(value);
            emit('value_updated', value)
            model_value.value = value;
        }
    }
    // function text_modelValue(value: string):void {
    //     log(" text:", value, " text_value:", text_value.value)
        
    //     let parsed = parseFloat(value);
    //     if(!isNaN(parsed)) {
    //         value_set_slider(parsed);
    //         setting_value = parsed;
    //         emit('value_updated', parsed)
    //         model_value.value = parsed;
    //     }
    // }
    function slider_modelValue(value: number): void {
       log(" slider:", value, " slider_value:", slider_value.value)


        let converted = value;
        if (props.log_slider) {
            converted = props.min + (props.max-props.min)*(Math.exp(value * (Math.log(log_base+1) - Math.log(log_base)) + Math.log(log_base)) - log_base);
        }
        converted = +converted.toFixed(props.accuracy);
        value_set_text(converted);
        setting_value = converted;
        emit('value_updated', converted)
        model_value.value = converted;
    }




    function value_set_slider(value: number) {
        log(props.id, " value_set_slider:", value, " slider_value:", slider_value.value);

        let converted = value;
        if (props.log_slider) {
            converted = (Math.log(log_base + (value-props.min)/(props.max-props.min)) - Math.log(log_base))/(Math.log(log_base+1)-Math.log(log_base))
        }
        slider_value.value = converted;
    }

    function value_set_text(value: number) {
        log(" value_set_text:", value, " text_value:", text_value.value);
        //numberinput.value?.set_value(value);
        text_value.value = value;
    }

    const set_value = (value: number) => {
        log("call set_value value:", value);
        
        value_set_text(value);
        value_set_slider(value);
        
    }

    defineExpose({
        set_value
    })

    // watch works directly on a ref
    watch(model_value, (newValue, oldValue) => {
        console.log("watch works");
        log(props.id, " watch on model_value new_value:", newValue, " old_value:", oldValue, " setting_value:", setting_value);

        if (typeof newValue === 'number' && (isNaN(setting_value) || setting_value != newValue)) {
            let converted = newValue;//Math.round(newValue / props.accuracy)* props.accuracy;
            set_value(newValue);
            //value_set_slider(converted);
            //value_set_text(converted);
        }
    },{ immediate: true })

    //slider
    // let log_base: number = 0.02;
    // let hidden_local_value: number = 0;
    // let local_value: number = 0;
    // const slider_value = computed<number>({
    //     get() {
    //         return props.log_slider ? 
    //     (Math.log(log_base + (hidden_local_value-props.min)/(props.max-props.min)) - Math.log(log_base))/(Math.log(log_base+1)-Math.log(log_base))
    //     : hidden_local_value;
    //     },
    //     set(value) {
    //         if(props.log_slider)
    //     {
    //         //this.local_value = Math.round(Math.pow(this.log_base, val));
    //         let res = props.min + (props.max-props.min)*(Math.exp(value * (Math.log(log_base+1) - Math.log(log_base)) + Math.log(log_base)) - log_base);
    //         local_value = Math.round(res * 10)/10;
    //     } 
    //     else 
    //         local_value = Math.round(value * 10)/10;
    //     }
    // });


  </script>


  <style scoped lang="scss">
  .input_text{
      width: 100px;
      flex-grow: 0;
  }
  .v-text-field__prefix{
      font-style: italic;
  }
  .slider_wrapper{
        flex-grow: 1;
      margin-left: 12px;
      margin-top: 12px;
      position: relative;
      min-width: 100px;
  }
  .inside{
      position: absolute;
      top: 26px;
      width: 100%;
      display: flex;
      font-size: 10px;
      .intermediate{
          display: flex;
          flex-grow: 1;
          flex-direction: row;
      }
      .inside_col{
          display: flex;
          flex-grow: 0;
          flex-direction: row;
      }
  }
</style>
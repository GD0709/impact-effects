
interface Format {
    dimension_prefix_format: (real: number) => string;
    power_format: (real: number, n: number|null) => {
        mult: string;
        power: string;
        power_n: number;
        html: string;
    };
    round: (real: number, n: number|null) => string;
    round_decimal_digits_to_string: (real: number, after_dot_length: number) => string;
    seconds_to_string: (s: number, show_ms: boolean) => string;
  }

interface FormatOptions {
    localize: (key: string) => string
}



import MathExt from '../../../core/lib/MathExt';
import type { App, Plugin } from 'vue';
import State from './../model/state';
// import { Composer, useI18n } from "vue-i18n";
// const localize = useI18n();

// Used to create a new ColoredText. "options" will be whatever you add later to "app.use(ColoredTextPlugin, options);"
const createFormat = (options: FormatOptions): Format => {
    console.log("register format plugin ", options);
    return {
        dimension_prefix_format: function(real: number) 
        { 
        //console.log("Dimensions", state.state.visual_settings.round_digits);
            return MathExt.dimension_prefix_format(real, (p) => options.localize("calculator.dimensions.prefix." + p), State.state.visual_settings.round_digits);
        },
        power_format: function(real: number, n:number|null) 
        { 
            return MathExt.power_format(real, n == null ? State.state.visual_settings.round_digits: n);
        },
        round: function(real: number, n: number|null) 
        { 
            return MathExt.round_by_digits_to_string(real, n == null ? State.state.visual_settings.round_digits: n);
        },
        round_decimal_digits_to_string: function(real: number, after_dot_length: number): string {
            return MathExt.round_decimal_digits_to_string(real, after_dot_length)
        },
        seconds_to_string: function(s: number, show_ms: boolean = false): string {
            return MathExt.seconds_to_string(s, show_ms)
        }
    }
}

// The Install function used by Vue to register the plugin
export const FormatPlugin: Plugin = {
    install(app: App, options: FormatOptions) {
        // makes ColoredText available in your Vue.js app as either "$this.coloredText" (in your Source) or "{{ $coloredText }}" in your templates
        app.config.globalProperties.$format = createFormat(options)
    }
}

declare module "@vue/runtime-core" {
    //Bind to `this` keyword
    interface ComponentCustomProperties {
      $format: Format;
    }
  }
/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import i18n from './i18n'
import { FormatPlugin } from './round_format'
import { useI18n } from 'vue-i18n'
import { createYmaps } from 'vue-yandex-maps';
import yandexmaps from './yandexmaps'
// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(FormatPlugin, { localize: (key:string) => useI18n().t(key)})
    .use(createYmaps({
      apikey: yandexmaps.apikey,
    }))
}

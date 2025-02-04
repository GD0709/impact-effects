import { createI18n } from 'vue-i18n'
import en from './../locales/en.json'
import ru from './../locales/ru.json'

type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'ru'>({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    'en': en,
    'ru': ru
  },
})
export default i18n
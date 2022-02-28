import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import en from './en'
import zh from './zh'

i18n.translations = {
  en,
  'en-US': en,
  'en-GB': en,
  zh,
  'zh-Hans': zh,
  'zh-Hans-CN': zh,
  'zh-Hans-US': zh,
}
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale
i18n.fallbacks = true

export default i18n.t

import type { UserModule } from '~/types'
import { createI18n } from 'vue-i18n'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../../locales/*.y(a)?ml', { eager: true }),
  )
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(14, yaml ? -5 : -4), value.default]
    }),
)

export const install: UserModule = ({ app, isClient }) => {
  let lang = 'en'
  if (isClient) {
    const defaultLang = localStorage.getItem('my-day-lang') || navigator.language
    defaultLang && ['en', 'zh-CN'].includes(defaultLang) && (lang = defaultLang)
  }
  if (isClient)
    document.documentElement.lang = lang
  const i18n = createI18n({
    legacy: false,
    locale: lang,
    messages,
  })

  app.use(i18n)
}

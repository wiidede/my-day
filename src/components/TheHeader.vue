<script setup lang="ts">
const { t, availableLocales, locale } = useI18n()
const route = useRoute()
const router = useRouter()

let navLang
if (typeof navigator !== 'undefined')
  navLang = navigator.language

const defaultLang = navLang && availableLocales.includes(navLang) ? navLang : locale.value
const lang = useStorage('my-day-lang', defaultLang)
locale.value = lang.value
if (typeof document !== 'undefined')
  document.documentElement.lang = lang.value

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  const reg = new RegExp(`/(${locale.value})/?$`)
  if (route.fullPath.match(reg))
    router.push(route.fullPath.replace(reg, `/${newLocale}`))
  lang.value = locale.value = newLocale
  if (typeof document !== 'undefined')
    document.documentElement.lang = lang.value
}
</script>

<template>
  <nav text-xl py-4 flex items-center justify-center>
    <RouterLink class="icon-btn mx-2" to="/" :title="t('button.home')">
      <div i-carbon-campsite />
    </RouterLink>

    <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-moon dark:carbon-sun" />
    </button>

    <TheTheme />

    <button class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </button>

    <RouterLink class="icon-btn mx-2" :to="`/help/${locale}`" :title="t('button.help')">
      <div i-carbon-dicom-overlay />
    </RouterLink>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/wiidede/my-day" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>

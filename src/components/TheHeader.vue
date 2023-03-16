<script setup lang="ts">
import { isClient } from '@vueuse/core'

const { t, availableLocales, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const lang = useStorage('my-day-lang', locale.value)
locale.value = lang.value

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  const reg = new RegExp(`/(${locale.value})/?$`)
  if (route.fullPath.match(reg))
    router.push(route.fullPath.replace(reg, `/${newLocale}`))
  lang.value = locale.value = newLocale
  if (isClient)
    document.documentElement.lang = newLocale
}

const themes = ['', 'uno', 'neumorphism']
const theme = useStorage('my-day-theme', themes[0])
watch(theme, (value) => {
  if (isClient)
    document.documentElement.setAttribute('theme', value)
}, { immediate: true })
const toggleThemes = () => {
  const newTheme = themes[(themes.indexOf(theme.value) + 1) % themes.length]
  theme.value = newTheme
}
</script>

<template>
  <nav text-xl py-4 flex items-center justify-center>
    <RouterLink class="icon-btn mx-2 my-c-primary" to="/" :title="t('button.home')">
      <div i-the-my-day />
    </RouterLink>

    <RouterLink class="icon-btn mx-2" :to="`/help/${locale}`" :title="t('button.help')">
      <div i-carbon-help />
    </RouterLink>

    <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-moon dark:carbon-sun" />
    </button>

    <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_theme')" @click="toggleThemes()">
      <div i-carbon-rain-drop />
    </button>

    <TheTheme />

    <button class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </button>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/wiidede/my-day" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>

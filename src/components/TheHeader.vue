<script setup lang="ts">
import { isClient } from '@vueuse/core'

const { t, availableLocales, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const lang = useStorage('my-day-lang', locale.value)
locale.value = lang.value

function toggleLocales() {
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
function toggleThemes() {
  const newTheme = themes[(themes.indexOf(theme.value) + 1) % themes.length]
  theme.value = newTheme
}
</script>

<template>
  <nav text-xl py-4 flex gap-4 flex-wrap items-center justify-center>
    <RouterLink class="my-icon-btn my-c-primary" to="/" :title="t('button.home')">
      <div i-the-my-day />
    </RouterLink>

    <RouterLink class="my-icon-btn" :to="`/help/${locale}`" :title="t('button.help')">
      <div i-carbon-help />
    </RouterLink>

    <button class="my-icon-btn !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-moon dark:carbon-sun" />
    </button>

    <button class="my-icon-btn !outline-none" :title="t('button.toggle_theme')" @click="toggleThemes()">
      <div i-carbon-rain-drop />
    </button>

    <TheTheme />

    <button class="my-icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </button>

    <a class="my-icon-btn" rel="noreferrer" href="https://github.com/wiidede/my-day" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>

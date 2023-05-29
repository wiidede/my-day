<script lang="ts" setup>
const mainRef = ref<HTMLElement>()

const { isFullscreen, toggle } = useFullscreen(mainRef)

provide('mainFullscreen', {
  isFullscreen,
  toggle,
})
</script>

<template>
  <div class="w-100vw flex-col" :class="isFullscreen ? 'block' : 'flex h-100vh'">
    <header class="px-4 text-center">
      <TheHeader />
    </header>
    <main
      ref="mainRef"
      :style="{ background: 'var(--my-c-white)' }"
      class="flex-auto min-h0 py-4 text-center text-gray-700 dark:text-gray-200"
      :class="{ 'overflow-auto': isFullscreen }"
    >
      <RouterView />
    </main>
  </div>
</template>

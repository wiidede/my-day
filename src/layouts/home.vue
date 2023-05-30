<script lang="ts" setup>
const showHeader = ref(true)
const toggleShowHeader = useToggle(showHeader)

provide(showHeaderKey, toggleShowHeader)
</script>

<template>
  <header v-show="showHeader" class="px-4 text-center">
    <TheHeader />
  </header>
  <main class="py-4 text-center text-gray-700 dark:text-gray-200">
    <RouterView />
  </main>
</template>

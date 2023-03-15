<script lang="ts" setup>
defineProps<{
  left: number
  right: number
}>()
</script>

<template>
  <div
    ref="progressRef"
    class="the-range-progress absolute h-full bg-white"
    :style="{ left: `${left}%`, right: `${100 - right}%` }"
  />
</template>

<style lang="scss" scoped>
</style>

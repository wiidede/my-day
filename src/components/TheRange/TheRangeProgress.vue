<script lang="ts" setup>
defineProps<{
  left: number
  right: number
}>()
</script>

<template>
  <div
    class="the-range-progress absolute h-full bg-white"
    :style="{ left: `${left}%`, right: `${100 - right}%` }"
  />
</template>

<style lang="scss" scoped>
.the-range-progress {
  transition: left 100ms linear, right 100ms linear;
}
</style>

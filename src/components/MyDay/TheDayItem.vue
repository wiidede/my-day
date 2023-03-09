<script lang="ts" setup>
defineProps<{
  time?: string
  content?: string
  progress?: number
}>()
</script>

<template>
  <div
    class="p2 flex"
    :style="{
      '--progress-value': `${progress || 0}%`,
      '--progress-ripple-scale': `${Math.max(5, (progress || 0) / 2)}`,
      '--progress-ripple-duration': `${Math.max(2.5, (progress || 0) / 10)}s`,
      '--progress-ripple-delay': `${Math.max(1.25, (progress || 0) / 20)}s`,
    }"
    :class="{
      'the-progress py4 text-xl my-bg-primary/15 my-shadow': progress !== undefined,
    }"
  >
    <div v-if="progress !== undefined" class="the-progress-thumb" />
    <div class="flex-1 text-center">
      <slot name="time">
        {{ time }}
      </slot>
    </div>
    <div class="flex-3">
      <slot name="content">
        {{ content }}
        <span v-if="progress !== undefined">({{ progress.toFixed(2) }}%)</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>

</style>

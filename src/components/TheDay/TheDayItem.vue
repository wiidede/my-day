<script lang="ts" setup>
defineProps<{
  time?: string
  content?: string
  progress?: number
}>()
</script>

<template>
  <div
    class="px4 py2 flex flex-col items-start md:flex-row md:px2"
    :style="{
      '--progress-value': `${progress || 0}%`,
      '--progress-ripple-scale': `${Math.round(Math.max(5, (progress || 0) / 2) / 5) * 5}`,
      '--progress-ripple-duration': `${Math.round(Math.max(2, (progress || 0) / 5) / 2) * 2}s`,
      '--progress-ripple-delay': `${Math.round(Math.max(2, (progress || 0) / 5) / 2)}s`,
    }"
    :class="{
      'the-progress !py4 text-xl my-bg-primary/15 my-shadow': progress !== undefined,
    }"
  >
    <div v-if="progress !== undefined" class="the-progress-thumb" />
    <div class="md:flex-1 text-center">
      <slot name="time">
        {{ time }}
      </slot>
    </div>
    <div class="md:flex-3">
      <slot name="content">
        {{ content }}
        <span v-if="progress !== undefined">({{ progress.toFixed(2) }}%)</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>

</style>

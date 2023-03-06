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
    }"
    :class="{
      'the-progress py4 text-xl my-bg-primary/15': progress !== undefined,
    }"
  >
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

<style lang="scss" scoped>

</style>

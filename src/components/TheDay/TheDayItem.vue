<script lang="ts" setup>
const props = defineProps<{
  progress?: number
  edit?: boolean
  range: [number, number]
  formatter: (value: number) => string
}>()

const emits = defineEmits<{
  (event: 'delete'): void
}>()

const { content, time } = defineModel<{
  content: string
  time: number | [number, number]
}>()

const showProgress = computed(() => props.progress !== undefined && !props.edit)
</script>

<template>
  <div
    class="px4 py2 flex flex-col items-start"
    :style="{
      '--progress-value': `${progress || 0}%`,
      '--progress-ripple-scale': `${Math.round(Math.max(5, (progress || 0) / 2) / 5) * 5}`,
      '--progress-ripple-duration': `${Math.round(Math.max(2, (progress || 0) / 5) / 2) * 2}s`,
      '--progress-ripple-delay': `${Math.round(Math.max(2, (progress || 0) / 5) / 2)}s`,
    }"
    :class="{
      'the-progress !py4 text-xl my-bg-primary/15 my-shadow': showProgress,
      'md:flex-row md:px2': !edit,
    }"
  >
    <div v-if="showProgress" class="the-progress-thumb" />
    <template v-if="edit">
      <div class="text-center">
        {{ Array.isArray(time) ? `${formatter(time[0])} - ${formatter(time[1])}` : formatter(time) }}
        <div v-if="Array.isArray(time)" i-carbon-delete class="inline-block" @click="emits('delete')" />
      </div>
      <TheRange v-model="time" class="the-time-range" :min="range[0]" :max="range[1]" :step="10" />
      <TheInput v-model="content" class="w-full" />
    </template>
    <template v-else>
      <div class="text-center md:flex-1">
        {{ Array.isArray(time) ? `${formatter(time[0])} - ${formatter(time[1])}` : formatter(time) }}
      </div>
      <div class="md:flex-3">
        <span>{{ content }}</span>
        <span v-if="showProgress">({{ progress!.toFixed(2) }}%)</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.the-time-range {
  width: 100%;
  --rainbow-gradient: linear-gradient(to right,
      hsl(0 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(60 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(120 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(180 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(240 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(300 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(360 var(--my-c-primary-saturation) var(--my-c-primary-lightness)));
  --at-apply: shadow;
  background: var(--rainbow-gradient);
  border-radius: 2px;
  height: 0.75rem;

  :deep(.the-range-thumb) {
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 0.25rem;
    background-color: var(--my-c-primary);
    box-shadow: 0 0.5px 2px 0 var(--my-c-primary), inset 0 0 0.5px 0.5px rgba(var(--my-c-black-rgb), 0.4);
    border: 0;
    transform: translateX(-50%) scale(2);
  }
}
</style>

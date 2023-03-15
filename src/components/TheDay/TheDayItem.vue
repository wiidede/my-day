<script lang="ts" setup>
const props = defineProps<{
  left: number
  right?: number
  content: string
  progress?: number
  edit?: boolean
  range: [number, number]
  formatter: (value: number) => string
}>()

const emits = defineEmits<{
  (event: 'update:left', value: typeof props.left): void
  (event: 'update:right', value: typeof props.right): void
  (event: 'update:content', value: typeof props.content): void
  (event: 'delete'): void
}>()

const time = computed({
  get: () => props.right === undefined ? props.left : [props.left, props.right] as [number, number],
  set: (value) => {
    if (Array.isArray(value)) {
      emits('update:left', value[0])
      emits('update:right', value[1])
    }
    else {
      emits('update:left', value)
    }
  },
})

const contentModel = computed({
  get: () => props.content,
  set: (value) => {
    emits('update:content', value)
  },
})

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
      'mb2': edit,
    }"
  >
    <div v-if="showProgress" class="the-progress-thumb" />
    <template v-if="edit">
      <div class="flex items-start w-full flex-col md:flex-row md:items-center mb1">
        <div class="md:flex-3">
          {{ Array.isArray(time) ? `${formatter(time[0])} - ${formatter(time[1])}` : formatter(time) }}
        </div>
        <div class="md:flex-7 w-full flex items-center justify-center">
          <TheRange v-model="time" class="the-time-range m1" :min="range[0]" :max="range[1]" :step="10" />
        </div>
      </div>
      <div class="flex items-center w-full gap-4">
        <TheInput v-model="contentModel" class="flex-auto min-w-0" />
        <div v-show="edit && Array.isArray(time)" class="icon-btn" @click="emits('delete')">
          <div i-carbon-delete />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center md:flex-1">
        {{ Array.isArray(time) ? `${formatter(time[0])} - ${formatter(time[1])}` : formatter(time) }}
      </div>
      <div class="md:flex-3">
        <span>{{ contentModel }}</span>
        <span v-if="showProgress">({{ progress!.toFixed(2) }}%)</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.the-time-range {
  width: 100%;
  --at-apply: shadow;
  background: hsl(var(--my-c-primary-hsl) / 50%);
  border-radius: 4px;
  height: 0.4rem;

  :deep(.the-range-thumb) {
    height: 0.75rem;
    width: 0.75rem;
    background-color: var(--my-c-white);
    border: 1px solid var(--my-c-primary);
  }

  :deep(.the-range-progress) {
    background-color: var(--my-c-primary);
  }
}
</style>

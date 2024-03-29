<script lang="ts" setup>
const props = defineProps<{
  left: number
  right?: number
  content: string
  progress?: number
  edit?: boolean
  pure?: boolean
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

const { t } = useI18n()

const showProgress = computed(() => props.progress !== undefined && !props.edit && !props.pure)
</script>

<template>
  <div
    class="flex flex-col items-start px4 py2"
    :style="{
      '--progress-value': `${progress || 0}%`,
      '--progress-ripple-scale': `${Math.round(Math.max(5, (progress || 0) / 2) / 5) * 5}`,
      '--progress-ripple-duration': `${Math.round(Math.max(2, (progress || 0) / 5) / 2) * 2}s`,
      '--progress-ripple-delay': `${Math.round(Math.max(2, (progress || 0) / 5) / 2)}s`,
    }"
    :class="{
      'the-progress !py4 text-xl my-bg-primary/15': showProgress,
      'md:flex-row md:px2': !edit,
      'mb2': edit,
    }"
  >
    <div v-if="showProgress" class="the-progress-thumb" />
    <template v-if="edit">
      <div class="mb1 w-full flex flex-col items-start md:flex-row md:items-center">
        <div class="md:flex-3">
          {{ Array.isArray(time) ? `${formatter(time[0])} - ${formatter(time[1])}` : formatter(time) }}
        </div>
        <div v-if="!pure" class="w-full flex items-center justify-center md:flex-7">
          <TheRange
            v-model="time"
            class="the-time-range m1 w-full"
            :min="range[0]" :max="range[1]" :step="10"
            range-highlight smooth
          />
        </div>
      </div>
      <div class="w-full flex items-center gap4">
        <TheInput v-if="!pure" v-model="contentModel" class="min-w0 flex-auto" />
        <span v-else class="min-w0 flex-auto px4 py2">{{ contentModel }}</span>
        <div v-show="edit && Array.isArray(time)" class="my-icon-btn" @click="emits('delete')">
          <div i-carbon-delete :title="t('button.delete_plan')" />
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

<style scoped>
.the-time-range {
  --c-fill: hsl(var(--my-c-primary-hsl)/50%);
  box-shadow: var(--my-track-box-shadow);
}
.the-time-range :deep(.the-range-progress) {
  box-shadow: var(--my-thumb-box-shadow);
}
</style>

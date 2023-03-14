<script lang="ts" setup>
const props = defineProps<{
  start: number
  end: number
  content: string
  progress?: number
  edit?: boolean
  range: [number, number]
  formatter: (value: number) => string
}>()

const emit = defineEmits<{
  (event: 'update:start', value: typeof props.start): void
  (event: 'update:end', value: typeof props.end): void
  (event: 'update:content', value: typeof props.content): void
  (event: 'delete'): void
}>()

const timeModel = computed({
  get: () => [props.start, props.end] as [number, number],
  set: (value) => {
    emit('update:start', value?.[0])
    emit('update:end', value?.[1])
  },
})
const contentModel = computed({
  get: () => props.content,
  set: (value) => {
    emit('update:content', value)
  },
})
</script>

<template>
  <!-- @ts-ignore -->
  <TheDayItem
    v-model:time="timeModel"
    v-model:content="contentModel"
    :progress="progress"
    :edit="edit"
    :range="range"
    :formatter="formatter"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped>

</style>

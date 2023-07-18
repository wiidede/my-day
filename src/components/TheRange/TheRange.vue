<script lang="ts" setup>
import { getPercentage as getPercentageRaw, getValue as getValueRaw, theRangeTrackRefKey } from './TheRange'

const props = withDefaults(defineProps<{
  modelValue?: number | [number, number]
  min?: number
  max?: number
  step?: number
}>(), {
  min: 10,
  max: 20,
  step: 2,
})

const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: typeof props.modelValue): void
}>()

const model = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emits('update:modelValue', value)
  },
})

const trackRef = ref<HTMLElement>()

const points = computed(() => Math.floor((props.max - props.min) / props.step) + 1)

const getPercentage = computed(() => (value: number) => getPercentageRaw(value, props.min, props.max, props.step))
const getValue = computed(() => (percentage: number) => getValueRaw(percentage, props.min, props.max, props.step))

const position = computed(() => {
  return Array.isArray(model.value)
    ? model.value.map(getPercentage.value)
    : getPercentage.value(model.value || 0)
})

const reversing = ref(false)
const positionThumb = computed(() => {
  return Array.isArray(model.value)
    ? reversing.value
      ? model.value.map(getPercentage.value).reverse()
      : model.value.map(getPercentage.value)
    : []
})

let current: 'left' | 'right' = 'left'
function setCurrent(val: typeof current) {
  current = val
}
function onUpdateRange(percentage: number) {
  if (!Array.isArray(model.value))
    return
  percentage = getValue.value(percentage)
  let left = model.value[0]
  let right = model.value[1]

  const oldReversing = reversing.value
  if (reversing.value) {
    if (current === 'right' && percentage > right)
      reversing.value = false
    if (current === 'left' && percentage < left)
      reversing.value = false
  }
  else {
    if (current === 'right' && percentage < left)
      reversing.value = true
    if (current === 'left' && percentage > right)
      reversing.value = true
  }
  if (reversing.value !== oldReversing)
    [left, right] = [right, left]

  let result: [number, number]
  if ((current === 'left' && !reversing.value) || (current === 'right' && reversing.value))
    result = [percentage, right]
  else
    result = [left, percentage]
  if (result[0] === result[1])
    return
  model.value = result
}

function onUpdateSingle(percentage: number) {
  model.value = getValue.value(percentage)
}

provide(theRangeTrackRefKey, trackRef)
</script>

<template>
  <div ref="trackRef" class="the-range-track relative w40 h4 bg-gray select-none m-auto">
    <template v-if="model !== undefined && Array.isArray(model) && Array.isArray(position)">
      <TheRangeProgress :left="position[0]" :right="position[1]" />
      <div v-if="points < 12" class="the-range-points absolute h-full rd-full left--0.5 right--0.5 rd-0.5 flex justify-between items-center overflow-hidden">
        <div v-for="index in points" :key="index" class="w1 h1 rd-0.5 op50" style="background: var(--my-c-white);" />
      </div>
      <TheRangeThumb :position="positionThumb[0]" @update="onUpdateRange" @pointerdown="setCurrent('left')" />
      <TheRangeThumb :position="positionThumb[1]" @update="onUpdateRange" @pointerdown="setCurrent('right')" />
    </template>
    <template v-if="model !== undefined && typeof model === 'number' && typeof position === 'number'">
      <TheRangeThumb :position="position" @update="onUpdateSingle" />
    </template>
  </div>
</template>

<style scoped>

</style>

<script lang="ts" setup>
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

const getValue = (percentage: number) => {
  const min = props.min
  const max = props.max
  const step = props.step
  if (min === undefined || max === undefined || step === undefined)
    return 0
  if (percentage < 0)
    return min
  if (percentage > 100)
    return max
  const value = min + (max - min) * percentage / 100
  return Math.round(value / step) * step
}
const getPercentage = (value: number) => {
  const min = props.min
  const max = props.max
  const step = props.step / (max - min)
  if (min === undefined || max === undefined || step === undefined)
    return 0
  if (value < min)
    return 0
  if (value > max)
    return 100
  const percentage = (value - min) / (max - min) * 100
  return Math.round(percentage / step) * step
}
const position = computed(() => {
  return Array.isArray(model.value)
    ? model.value.map(getPercentage)
    : getPercentage(model.value || 0)
})

let lastType: 'left' | 'right' = 'left'
const onUpdateRange = (percentage: number) => {
  if (!Array.isArray(position.value))
    return
  let left = position.value[0]
  let right = position.value[1]
  if (lastType === 'left') {
    if (percentage > right) {
      left = right
      right = percentage
      lastType = 'right'
    }
    else {
      left = percentage
    }
  }
  else if (lastType === 'right') {
    if (percentage < left) {
      right = left
      left = percentage
      lastType = 'left'
    }
    else {
      right = percentage
    }
  }
  model.value = [getValue(left), getValue(right)]
}

const onUpdateSingle = (percentage: number) => {
  model.value = getValue(percentage)
}
</script>

<template>
  <div ref="trackRef" class="the-range-track relative w40 h4 bg-gray select-none m-auto">
    <template v-if="model !== undefined && Array.isArray(model) && Array.isArray(position)">
      <TheRangeProgress :left="position[0]" :right="position[1]" />
      <TheRangeThumb :position="position[0]" @update="onUpdateRange" @pointerdown="() => { lastType = 'left' }" />
      <TheRangeThumb :position="position[1]" @update="onUpdateRange" @pointerdown="() => { lastType = 'right' }" />
    </template>
    <template v-if="model !== undefined && typeof model === 'number' && typeof position === 'number'">
      <TheRangeThumb :position="position" @update="onUpdateSingle" />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>

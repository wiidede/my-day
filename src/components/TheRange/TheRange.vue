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

const left = ref(Array.isArray(model.value) ? getPercentage(model.value[0]) : getPercentage(model.value || 0))
const right = ref(Array.isArray(model.value) ? getPercentage(model.value[1]) : 0)

let lastType: 'left' | 'right' = 'left'
const setLastType = (type: 'left' | 'right') => {
  lastType = type
}
const onUpdateRange = (percentage: number) => {
  if (lastType === 'left') {
    if (percentage > right.value) {
      left.value = right.value
      right.value = percentage
      lastType = 'right'
    }
    else {
      left.value = percentage
    }
  }
  else if (lastType === 'right') {
    if (percentage < left.value) {
      right.value = left.value
      left.value = percentage
      lastType = 'left'
    }
    else {
      right.value = percentage
    }
  }
  model.value = [getValue(left.value), getValue(right.value)]
}

const onUpdateSingle = (percentage: number) => {
  left.value = percentage
  model.value = getValue(percentage)
}
</script>

<template>
  <div ref="trackRef" class="the-range-track relative w40 h4 bg-gray select-none m-auto">
    <template v-if="model && Array.isArray(model) && Array.isArray(position)">
      <TheRangeProgress :value="left" />
      <TheRangeThumb :position="position[0]" :percentage="left" @update="onUpdateRange($event)" @pointerdown="setLastType('left')" />
      <TheRangeThumb :position="position[1]" :percentage="right" @update="onUpdateRange($event)" @pointerdown="setLastType('right')" />
    </template>
    <template v-if="model && typeof model === 'number' && typeof position === 'number'">
      <TheRangeThumb :position="position" :percentage="left" @update="onUpdateSingle" />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>

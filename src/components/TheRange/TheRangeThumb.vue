<script lang="ts" setup>
defineProps<{
  position: number
}>()

const emits = defineEmits<{
  (e: 'update', modelValue: number): void
}>()

const clientX = ref(0)

const thumbRef = ref<HTMLDivElement>()

watch(clientX, (value) => {
  if (!thumbRef.value)
    return
  const trackEl = thumbRef.value.parentElement
  if (!trackEl)
    return
  const trackRect = trackEl.getBoundingClientRect()
  const offset = value - trackRect.left
  const percent = offset / trackRect.width * 100
  if (percent < 0)
    emits('update', 0)
  else if (percent > 100)
    emits('update', 100)
  else if (!isNaN(percent))
    emits('update', percent)
})

const onPointerMove = (e: PointerEvent) => {
  clientX.value = e.clientX
}

const onPointerUp = (e: PointerEvent) => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

const onPointerDown = (e: PointerEvent) => {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div
    ref="thumbRef"
    class="the-range-thumb absolute w4 h4 aspect-square bg-white rd-50%"
    :style="{ left: `${position}%` }"
    @pointerdown="onPointerDown"
  />
</template>

<style lang="scss" scoped>
.the-range-thumb {
  transform: translateX(-50%);
}
</style>

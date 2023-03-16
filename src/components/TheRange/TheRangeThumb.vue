<script lang="ts" setup>
defineProps<{
  position: number
}>()

const emits = defineEmits<{
  (e: 'update', percent: number): void
}>()

const thumbRef = ref<HTMLDivElement>()

const onPointerMove = (e: PointerEvent) => {
  if (!thumbRef.value)
    return
  const trackEl = thumbRef.value.parentElement
  if (!trackEl)
    return
  const trackRect = trackEl.getBoundingClientRect()
  const offset = e.clientX - trackRect.left
  const percent = offset / trackRect.width * 100
  if (percent < 0)
    emits('update', 0)
  else if (percent > 100)
    emits('update', 100)
  else if (!isNaN(percent))
    emits('update', percent)
}

const onPointerUp = (e: PointerEvent) => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

const onPointerDown = (e: PointerEvent) => {
  e.preventDefault()
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
    @mousedown.prevent="void 0"
    @touchstart.prevent="void 0"
  />
</template>

<style lang="scss" scoped>
.the-range-thumb {
  transform: translate(-50%, -25%) scale(1.5);
  transform-origin: center;
  border: 1px solid gray;
}
</style>

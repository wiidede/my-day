<script lang="ts" setup>
import { theRangeTrackRefKey } from './TheRange'
import { throttle } from '~/utils/utils'

defineProps<{
  position: number
}>()

const emits = defineEmits<{
  (e: 'update', percent: number): void
}>()

const thumbRef = ref<HTMLElement>()
const trackRef = inject(theRangeTrackRefKey)

function onPointerMove(e: PointerEvent) {
  if (!thumbRef.value || !trackRef?.value)
    return
  const trackRect = trackRef.value.getBoundingClientRect()
  const offset = e.clientX - trackRect.left
  const percent = offset / trackRect.width * 100
  if (percent < 0)
    emits('update', 0)
  else if (percent > 100)
    emits('update', 100)
  else if (!isNaN(percent))
    emits('update', percent)
}

const onPointerMoveThrottle = throttle(onPointerMove, 100)

function onPointerUp() {
  window.removeEventListener('pointermove', onPointerMoveThrottle)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

function onPointerDown(e: PointerEvent) {
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
    @mousedown.prevent="() => {}"
    @touchstart.prevent="() => {}"
  />
</template>

<style lang="scss" scoped>
.the-range-thumb {
  transform: translate(-50%, -25%) scale(1.5);
  transform-origin: center;
  border: 1px solid gray;
  transition: left 100ms linear;
}
</style>

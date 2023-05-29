import { isClient } from '@vueuse/core'

const isSleeping = ref(false)
export function useTheNow() {
  const nowDate = isClient
    ? useNow({ interval: 1000 })
    : ref(new Date(0))

  return {
    nowDate,
    isSleeping,
  }
}

export function useTheDayWidth() {
  const { width: w } = useWindowSize()

  const padding = computed(() => (isLargeScreen.value ? 50 : 0))
  const width = computed(() => Math.min(w.value, 768) - 48 - padding.value * 2)

  return {
    width,
    padding,
  }
}

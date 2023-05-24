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
  const { width: W } = useWindowSize()

  const width = computed(() => Math.min(W.value, 768) - 32 - 48 - 100)

  return {
    width,
  }
}

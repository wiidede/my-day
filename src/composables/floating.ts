import { autoUpdate, flip, offset, shift, useFloating as useFloatingUI } from '@floating-ui/vue'
import type { Ref } from 'vue'

type HTMLRef = Ref<HTMLElement | undefined>

const cache = reactive<Record<string, HTMLRef>>({
  referenceRef: ref(),
  floatingRef: ref(),
})
const referenceRef = computed(() => unref(cache.referenceRef))
const floatingRef = computed(() => unref(cache.floatingRef))
const floating = ref(false)
const content = ref('')
const className = ref('')
const { x, y, strategy, update } = useFloatingUI(referenceRef, floatingRef, {
  placement: 'top',
  middleware: [offset(10), flip(), shift()],
  whileElementsMounted: autoUpdate,
})

watch(floating, (value) => {
  if (value) {
    update()
  }
  else {
    content.value = ''
    className.value = ''
  }
})

export const useFloatingRef = (floatingRefer: HTMLRef) => {
  cache.floatingRef = floatingRefer
  return { x, y, strategy, floating, content, className }
}

export const useFloating = (reference: HTMLRef) => {
  cache.referenceRef = reference
  return { floating, floatingRef, content, className }
}

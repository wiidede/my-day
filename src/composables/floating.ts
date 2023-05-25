import { autoUpdate, flip, offset, shift, useFloating as useFloatingUI } from '@floating-ui/vue'
import { promiseTimeout } from '@vueuse/core'
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

onClickOutside(floatingRef, () => {
  endFloating()
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

let timeout: number | undefined
let callback: (() => void) | undefined
function startFloating(time?: number) {
  return new Promise<void>((resolve) => {
    (async () => {
      await endFloating()
      floating.value = true
      if (time !== undefined) {
        timeout = window.setTimeout(() => {
          endFloating()
        }, time)
        callback = resolve
      }
    })()
  })
}

async function endFloating() {
  clearTimeout(timeout)
  floating.value = false
  if (callback) {
    callback()
    callback = undefined
    await promiseTimeout(0)
  }
}

export function useFloatingRef(floatingRefer: HTMLRef) {
  cache.floatingRef = floatingRefer
  return { x, y, strategy, floating, content, className }
}

export function useFloating(reference: HTMLRef) {
  cache.referenceRef = reference
  return { startFloating, endFloating, floatingRef, content, className }
}

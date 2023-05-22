import type { Ref } from 'vue'

export function useUrlStore<T>() {
  const route = useRoute()
  const hash = computed(
    () => route.hash,
  )

  const hashStore = computed<T | undefined>({
    get: () => {
      return hash.value ? JSON.parse(atou(hash.value.slice(1))) : undefined
    },
    set: debounce((value: T | undefined) => {
      location.hash = value ? utoa(JSON.stringify(value)) : ''
    }, 250, true),
  })

  const data = ref<T | undefined>(hashStore.value) as Ref<T | undefined>

  watch(hashStore, value => data.value = value)
  watch(data, value => hashStore.value = value, { deep: true })

  return {
    data,
  }
}

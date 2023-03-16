export const useUrlStore = <T>() => {
  const route = useRoute()
  const hash = computed(
    () => route.hash,
  )

  const data = computed<T | undefined>({
    get: () => hash.value ? JSON.parse(atou(hash.value.slice(1))) : undefined,
    set: debounce((value: T | undefined) => location.hash = value ? utoa(JSON.stringify(value)) : '', 250, true),
  })

  return {
    data,
  }
}

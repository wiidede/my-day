export const useUrlStore = <T>() => {
  const hash = location.hash

  const data = computed<T | undefined>({
    get: () => hash ? JSON.parse(atou(hash.slice(1))) : undefined,
    set: debounce((value: T | undefined) => location.hash = value ? utoa(JSON.stringify(value)) : '', 250),
  })

  return {
    data,
  }
}

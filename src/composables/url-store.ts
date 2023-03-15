export const useUrlStore = <T>() => {
  let hash: string | undefined
  if (typeof location !== 'undefined')
    hash = location.hash

  const data = computed<T | undefined>({
    get: () => hash ? JSON.parse(atou(hash.slice(1))) : undefined,
    set: debounce((value: T | undefined) => location.hash = value ? utoa(JSON.stringify(value)) : '', 250),
  })

  return {
    data,
  }
}

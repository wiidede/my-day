import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export function debounce(fn: (...args: any[]) => any, n = 100, leading = false) {
  let handle: number | undefined
  return (...args: any[]) => {
    clearTimeout(handle)
    if (leading && !handle)
      return fn(...args)
    handle = window.setTimeout(() => {
      handle = undefined
      return fn(...args)
    }, n)
  }
}

export function throttle(fn: (...args: any[]) => any, n = 100) {
  let handle: number | undefined
  return (...arg: any[]) => {
    if (handle)
      return
    handle = window.setTimeout(() => {
      handle = undefined
      return fn(...arg)
    }, n)
  }
}

export function utoa(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function atou(base64: string): string {
  const binary = atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}

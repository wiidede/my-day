import { describe, expect, it } from 'vitest'
import { promiseTimeout } from '@vueuse/core'
import { debounce } from '../utils'

describe('debounce util', () => {
  it('debounce', async () => {
    let count = 0
    const fn = debounce(() => count++, 10)
    fn()
    fn()
    fn()
    expect(count).toEqual(0)
    await promiseTimeout(10)
    expect(count).toEqual(1)
    fn()
    expect(count).toEqual(1)
    await promiseTimeout(5)
    expect(count).toEqual(1)
    fn()
    await promiseTimeout(5)
    expect(count).toEqual(1)
    fn()
    expect(count).toEqual(1)
    fn()
    await promiseTimeout(10)
    expect(count).toEqual(2)
  })
})

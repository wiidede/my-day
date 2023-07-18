import { describe, expect, it } from 'vitest'
import { promiseTimeout } from '@vueuse/core'
import { throttle } from '../utils'

describe('throttle util', () => {
  it('throttle', async () => {
    let count = 0
    const fn = throttle(() => count++, 100)
    fn()
    fn()
    fn()
    expect(count).toEqual(0)
    await promiseTimeout(200)
    expect(count).toEqual(1)
    fn()
    expect(count).toEqual(1)
    await promiseTimeout(50)
    fn()
    expect(count).toEqual(1)
    await promiseTimeout(50)
    fn()
    expect(count).toEqual(2)
    await promiseTimeout(50)
    fn()
    expect(count).toEqual(2)
    await promiseTimeout(50)
    fn()
    expect(count).toEqual(3)
  })
})

import { describe, expect, it } from 'vitest'
import { promiseTimeout } from '@vueuse/core'
import { atou, debounce, throttle, utoa } from './utils'

describe('utils', () => {
  it('debounce', async () => {
    let count = 0
    const fn = debounce(() => count++, 100)
    fn()
    fn()
    fn()
    expect(count).toEqual(0)
    await promiseTimeout(200)
    expect(count).toEqual(1)
    fn()
    expect(count).toEqual(1)
    await promiseTimeout(50)
    expect(count).toEqual(1)
    fn()
    await promiseTimeout(50)
    expect(count).toEqual(1)
    fn()
    expect(count).toEqual(1)
    fn()
    await promiseTimeout(200)
    expect(count).toEqual(2)
  })

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

  it('utoa', () => {
    const data = 'Hello World'
    expect(utoa(data)).toMatchInlineSnapshot('"eNrzSM3JyVcIzy/KSQEAGAsEHQ=="')
  })

  it('atou', () => {
    expect(atou('eNrzSM3JyVcIzy/KSQEAGAsEHQ==')).toMatchInlineSnapshot('"Hello World"')
  })
})

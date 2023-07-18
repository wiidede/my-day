import { describe, expect, it } from 'vitest'
import { getPercentage, getValue } from './TheRange'

describe('the range utils', () => {
  it('getPercentage', () => {
    expect(getPercentage(-1, 0, 100, 1)).toEqual(0)
    expect(getPercentage(0, 0, 100, 1)).toEqual(0)
    expect(getPercentage(50, 0, 100, 1)).toEqual(50)
    expect(getPercentage(50.0001, 0, 100, 1)).toEqual(50)
    expect(getPercentage(100, 0, 100, 1)).toEqual(100)
    expect(getPercentage(101, 0, 100, 1)).toEqual(100)
    expect(getPercentage(1, 1, 0, 1)).toEqual(Number.NaN)
    expect(getPercentage(1, 1, 1, 1)).toEqual(Number.NaN)
    expect(getPercentage(Number.NaN, 0, 100, 1)).toEqual(Number.NaN)
    expect(getPercentage(Number.NaN, Number.NaN, Number.NaN, Number.NaN)).toEqual(Number.NaN)
  })

  it('getValue', () => {
    expect(getValue(-1, 0, 100, 1)).toEqual(0)
    expect(getValue(0, 0, 100, 1)).toEqual(0)
    expect(getValue(50, 0, 100, 1)).toEqual(50)
    expect(getValue(50.0001, 0, 100, 1)).toEqual(50)
    expect(getValue(100, 0, 100, 1)).toEqual(100)
    expect(getValue(101, 0, 100, 1)).toEqual(100)
    expect(getValue(1, 1, 0, 1)).toEqual(Number.NaN)
    expect(getValue(1, 1, 1, 1)).toEqual(Number.NaN)
    expect(getValue(Number.NaN, 0, 100, 1)).toEqual(Number.NaN)
    expect(getValue(Number.NaN, Number.NaN, Number.NaN, Number.NaN)).toEqual(Number.NaN)
  })
})

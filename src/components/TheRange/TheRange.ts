import type { InjectionKey, Ref } from 'vue'

export const theRangeTrackRefKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('theRangeTrackRefKey')

export function getValue(percentage: number, min: number, max: number, step: number) {
  if (min === undefined || max === undefined || step === undefined)
    return Number.NaN
  if (max <= min)
    return Number.NaN
  if (percentage < 0)
    return min
  if (percentage > 100)
    return max
  const value = min + (max - min) * percentage / 100
  return Math.round(value / step) * step
}

export function getPercentage(value: number, min: number, max: number, step: number) {
  if (min === undefined || max === undefined || step === undefined)
    return Number.NaN
  if (max <= min)
    return Number.NaN
  if (value < min)
    return 0
  if (value > max)
    return 100
  const percentage = (value - min) / (max - min) * 100
  const stepPer = step / (max - min)
  return Math.round(percentage / stepPer) * stepPer
}

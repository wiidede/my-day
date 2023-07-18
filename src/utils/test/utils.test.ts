import { describe, expect, it } from 'vitest'
import { atou, utoa } from '../utils'

describe('compress util', () => {
  it('utoa', () => {
    const data = 'Hello World'
    expect(utoa(data)).toMatchInlineSnapshot('"eNrzSM3JyVcIzy/KSQEAGAsEHQ=="')
  })

  it('atou', () => {
    expect(atou('eNrzSM3JyVcIzy/KSQEAGAsEHQ==')).toMatchInlineSnapshot('"Hello World"')
  })
})

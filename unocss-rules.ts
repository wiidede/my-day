import type { DynamicMatcher, Rule } from 'unocss'

const resolveMyColor: DynamicMatcher = ([, colorType, type, l, op]) => {
  const colorTypeKey = {
    c: 'color',
    bg: 'background-color',
  }[colorType as 'c' | 'bg']

  let lightness = `var(--my-c-${type}-lightness)`
  if (l) {
    if (Number(l) < -20)
      l = '-20'
    if (Number(l) > 20)
      l = '20'
    lightness = `calc(${lightness} + ${l}%)`
  }

  if (!op || Number(op) < 0 || Number(op) > 100)
    op = '100'

  return {
    [colorTypeKey]: `hsl(var(--my-c-${type}-hue) var(--my-c-${type}-saturation) ${lightness} / ${op}%)`,
  }
}

const rules: Rule<any>[] = [
  // theme rules
  [/^my-(c|bg)-(primary|success|warning)(?:%(-?\d+))?(?:\/(\d+))?$/, resolveMyColor],
  // utility rules
  [/^flex-(\d+)$/, ([, d]) => ({ flex: `${Number(d)}` })],
  ['my-shadow', { 'box-shadow': 'var(--my-box-shadow)' }],
  ['my-round', { 'border-radius': 'var(--my-rounded)' }],
]

export default rules

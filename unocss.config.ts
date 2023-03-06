import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block my-bg-primary/70 text-white cursor-pointer hover:my-bg-primary/80 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:my-c-primary/60'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Mulish',
        serif: 'Bitter',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
  rules: [
    // theme rules
    [/^my-c-primary(\/(\d+))?$/, ([, , op]) => ({ color: `hsl(var(--my-c-primary-hsl)${op ? ` / ${op}%` : ''})` })],
    [/^my-bg-primary(\/(\d+))?$/, ([, , op]) => ({ background: `hsl(var(--my-c-primary-hsl)${op ? ` / ${op}%` : ''})` })],
    // utility rules
    [/^flex-(\d+)$/, ([, d]) => ({ flex: `${Number(d)}` })],
  ],
})

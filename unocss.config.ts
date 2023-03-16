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
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import rules from './unocss-rules'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 my-round inline-block my-bg-primary/70 text-white cursor-pointer hover:my-bg-primary/80 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:my-c-primary%10'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        the: FileSystemIconLoader(
          './assets/icons',
        ),
      },
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
  rules,
  variants: [
    (matcher) => {
      if (!matcher.startsWith('uno:'))
        return matcher
      return {
        matcher: matcher.slice(12),
        selector: s => `[theme="uno"] ${s}`,
      }
    },
    (matcher) => {
      if (!matcher.startsWith('neumorphism:'))
        return matcher
      return {
        matcher: matcher.slice(12),
        selector: s => `[theme="neumorphism"] ${s}`,
      }
    },
  ],
})

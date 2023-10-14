import type { ViteSSGContext } from 'vite-ssg'

declare module 'vue' {
  export interface GlobalComponents {
    TheRange: typeof import('vue-range-multi')['Range']
  }
}

export type UserModule = (ctx: ViteSSGContext) => void

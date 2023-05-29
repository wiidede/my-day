import { isClient } from '@vueuse/core'

const userAgent = isClient ? navigator.userAgent : ''

export const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome')

export const isLargeScreen = useMediaQuery('(min-width: 768px)')

const userAgent = navigator.userAgent

export const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad')

import _dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

_dayjs.extend(duration)

export const dayjs = _dayjs

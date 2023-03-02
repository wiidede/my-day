<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const { modelValue } = defineModel<{
  modelValue: IMyDay
}>()

const dayjs = useDayjs()

const nowDate = useNow({
  interval: 250,
})

const {
  wakeTime,
  wakeLabel,
  sleepTime,
  sleepLabel,
  plans,
} = toRefs(modelValue.value)

const now = computed(() => {
  const nowValue = nowDate.value.getHours() * 60
  + nowDate.value.getMinutes()
  + (nowDate.value.getSeconds() / 60)
  + (nowDate.value.getMilliseconds() / 1000 / 60)
  - wakeTime.value
  return nowValue > wakeTime.value ? nowValue : nowValue + 24 * 60
},

)

const formatTime = (time: number, startTime: number) => {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
</script>

<template>
  <div class="p4 shadow">
    <div>
      {{ formatTime(wakeTime, 0) }} {{ wakeLabel }}
    </div>
    <div
      v-for="plan in plans"
      :key="JSON.stringify(plan)"
      class="p2 shadow-inset"
      :style="{
        '--progress-value': `${((now - plan.start) / (plan.end - plan.start) * 100).toFixed(3)}%`,
      }"
      :class="{
        'shadow the-progress py4 text-xl': now >= plan.start && now < plan.end,
      }"
    >
      {{ formatTime(plan.start, wakeTime) }} - {{ formatTime(plan.end, wakeTime) }} {{ plan.name }}
      <span v-if="now >= plan.start && now < plan.end">{{ `(${((now - plan.start) / (plan.end - plan.start) * 100).toFixed(3)}%)` }}</span>
    </div>
    <div>
      {{ formatTime(sleepTime, wakeTime) }} {{ sleepLabel }}
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

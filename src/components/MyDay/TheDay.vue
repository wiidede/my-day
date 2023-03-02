<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const { modelValue } = defineModel<{
  modelValue: IMyDay
}>()

const dayjs = useDayjs()

const {
  wakeTime,
  wakeLabel,
  sleepTime,
  sleepLabel,
  plans,
} = toRefs(modelValue.value)

const formatTime = (time: number, startTime: number) => {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
</script>

<template>
  <div class="p4 shadow">
    <div>
      {{ formatTime(wakeTime, 0) }} {{ wakeLabel }}
    </div>
    <div v-for="plan in plans" :key="JSON.stringify(plan)">
      {{ formatTime(plan.start, wakeTime) }} - {{ formatTime(plan.end, wakeTime) }} {{ plan.name }}
    </div>
    <div>
      {{ formatTime(sleepTime, wakeTime) }} {{ sleepLabel }}
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

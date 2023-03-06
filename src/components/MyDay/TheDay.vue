<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const { modelValue } = defineModel<{
  modelValue: IMyDay
}>()

const dayjs = useDayjs()

const nowDate = useNow({
  interval: 1000,
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
  return nowValue > 0 ? nowValue : nowValue + 24 * 60
},

)

const formatTime = (time: number, startTime: number) => {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
</script>

<template>
  <div class="py4 text-left rd-2 dark:bg-#282C34 z-inset-box-shadow">
    <TheDayItem :time="formatTime(wakeTime, 0)" :content="wakeLabel" />
    <TheDayItem
      v-for="plan in plans"
      :key="JSON.stringify(plan)"
      :time="`${formatTime(plan.start, wakeTime)} - ${formatTime(plan.end, wakeTime)}`"
      :content="plan.name"
      :progress="now >= plan.start && now < plan.end ? (now - plan.start) / (plan.end - plan.start) * 100 : undefined"
    />
    <TheDayItem :time="formatTime(sleepTime, wakeTime)" :content="sleepLabel" />
  </div>
</template>

<style lang="scss" scoped>

</style>

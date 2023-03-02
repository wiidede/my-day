<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const now = useNow()
const nowFormatted = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss', {
  locales: 'en-US',
})

const getDefaultMyDay: () => IMyDay = () => ({
  key: (new Date()).valueOf(),
  wakeTime: 8 * 60,
  wakeLabel: '起床啦',
  sleepTime: 16 * 60,
  sleepLabel: '睡觉啦',
  plans: [
    { name: '学习', start: 30, end: 60 },
    { name: '吃饭', start: 60, end: 90 },
    { name: '睡觉', start: 90, end: 120 },
  ],
})

const myDayList = useStorage('my-day-list', [getDefaultMyDay()])
</script>

<template>
  <p class="text-4xl">
    {{ nowFormatted }}
  </p>
  <TheDay v-for="(myDay, index) in myDayList" :key="myDay.key" v-model="myDayList[index]" />
</template>

<style lang="scss" scoped>

</style>

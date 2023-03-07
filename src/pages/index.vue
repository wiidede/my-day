<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const now = useNow({
  interval: 1000,
})
const nowFormatted = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss', {
  locales: 'en-US',
})

const getDefaultMyDay: () => IMyDay = () => ({
  key: (new Date()).valueOf(),
  wakeTime: 7 * 60,
  wakeLabel: 'wake up',
  sleepTime: 16 * 60,
  sleepLabel: 'sleep',
  plans: [
    { name: 'learning', start: 30, end: 60 },
    { name: 'eating', start: 60, end: 90 },
    { name: 'daze', start: 90, end: 120 },
    { name: 'what\'s the meaning of life', start: 150, end: 15 * 60 },
  ],
})

const myDayList = useStorage('my-day-list', [getDefaultMyDay()])
</script>

<template>
  <div class="max-w-180 m-auto">
    <p class="text-4xl mb4">
      {{ nowFormatted }}
    </p>
    <TheDay v-for="(myDay, index) in myDayList" :key="myDay.key" v-model="myDayList[index]" />
  </div>
</template>

<style scoped>

</style>

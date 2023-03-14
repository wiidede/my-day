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

const edit = ref(false)
const toggleEdit = useToggle(edit)
</script>

<template>
  <div class="max-w-65ch m-auto">
    <div class="mb4 flex items-baseline justify-between px1">
      <div class="w5" />
      <div class="text-4xl ">
        {{ nowFormatted }}
      </div>
      <div class="cursor-pointer" @click="toggleEdit()">
        <div :class="edit ? 'i-carbon-checkmark' : 'i-carbon-edit'" class="icon-btn" />
      </div>
    </div>
    <TheDay
      v-for="(myDay, index) in myDayList"
      :key="myDay.key"
      v-model="myDayList[index]"
      :edit="edit"
    />
  </div>
</template>

<style scoped>

</style>

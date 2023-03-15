<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'
const { t } = useI18n()

const now = useNow({
  interval: 1000,
})
const nowFormatted = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss', {
  locales: 'en-US',
})

const defaultMyDay = ref<IMyDay>({
  wakeTime: 7 * 60,
  wakeLabel: t('my_day.wake'),
  sleepTime: 16 * 60,
  sleepLabel: t('my_day.sleep'),
  plans: [
    { name: t('my_day.plan_1'), start: 30, end: 60 },
    { name: t('my_day.plan_2'), start: 60, end: 90 },
    { name: t('my_day.plan_3'), start: 90, end: 120 },
    { name: t('my_day.plan_4'), start: 120, end: 15 * 60 },
  ],
})

const myDay = useUrlStore<IMyDay>().data
const myDayModel = ref<IMyDay>(myDay.value || defaultMyDay.value)
watch(myDayModel, (value) => {
  myDay.value = value
}, {
  deep: true,
})

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
      v-model="myDayModel"
      :edit="edit"
    />
  </div>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

defineProps<{
  edit?: boolean
}>()

const { modelValue } = defineModel<{
  modelValue: IMyDay
}>()

const dayjs = useDayjs()

const nowDate = useNow({
  interval: 1000,
})

const now = computed(() => {
  const nowValue = nowDate.value.getHours() * 60
  + nowDate.value.getMinutes()
  + (nowDate.value.getSeconds() / 60)
  + (nowDate.value.getMilliseconds() / 1000 / 60)
  - modelValue.value.wakeTime
  return nowValue > 0 ? nowValue : nowValue + 24 * 60
})

const handleAddPlan = (index: number, start: number, end: number) => {
  modelValue.value.plans.splice(index, 0, {
    name: '',
    start,
    end,
  })
}
const handleDeletePlan = (index: number) => {
  modelValue.value.plans.splice(index, 1)
}

const formatTime = (time: number, startTime: number) => {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
const useFormatTime = (startTime: number) => {
  return (time: number) => formatTime(time, startTime)
}
</script>

<template>
  <div class="py4 text-left rd-2 z-inset-box-shadow" :style="{ backgroundColor: 'var(--my-box-bg)' }">
    <TheDayItem
      v-model:time="modelValue.wakeTime"
      v-model:content="modelValue.wakeLabel"
      :range="[0, 24 * 60]"
      :formatter="useFormatTime(0)"
      :edit="edit"
    />
    <div
      v-if="edit && (modelValue.plans.length === 0 || (modelValue.plans[0].start > 0))"
      @click="handleAddPlan(0, 0, modelValue.plans[0].start)"
    >
      <div i-carbon-add />
    </div>
    <template
      v-for="(plan, index) in modelValue.plans"
      :key="index"
    >
      <TheDayItemStartEnd
        v-model:content="plan.name"
        v-model:start="plan.start"
        v-model:end="plan.end"
        :range="[modelValue.plans[index - 1]?.end || 0, modelValue.plans[index + 1]?.start || modelValue.sleepTime]"
        :progress="now >= plan.start && now < plan.end ? (now - plan.start) / (plan.end - plan.start) * 100 : undefined"
        :formatter="useFormatTime(modelValue.wakeTime)"
        :edit="edit"
        @delete="handleDeletePlan(index)"
      />
      <div
        v-if="edit && (modelValue.plans[index + 1]?.start || modelValue.sleepTime) - plan.end > 0"
        @click="handleAddPlan(index + 1, plan.end, modelValue.plans[index + 1]?.start || modelValue.sleepTime)"
      >
        <div i-carbon-add />
      </div>
    </template>

    <TheDayItem
      v-model:time="modelValue.sleepTime"
      v-model:content="modelValue.sleepLabel"
      :range="[modelValue.plans[modelValue.plans.length - 1]?.end || modelValue.wakeTime, 24 * 60]"
      :formatter="useFormatTime(modelValue.wakeTime)"
      :edit="edit"
    />
  </div>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const props = defineProps<{
  edit?: boolean
  modelValue: IMyDay
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: typeof props.modelValue): void
  (event: 'delete'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value)
  },
})

const dayjs = useDayjs()

const nowDate = useNow({
  interval: 1000,
})

const now = computed(() => {
  const nowValue = nowDate.value.getHours() * 60
  + nowDate.value.getMinutes()
  + (nowDate.value.getSeconds() / 60)
  + (nowDate.value.getMilliseconds() / 1000 / 60)
  - model.value.wakeTime
  return nowValue > 0 ? nowValue : nowValue + 24 * 60
})

const handleAddPlan = (index: number, start: number, end: number) => {
  model.value.plans.splice(index, 0, {
    name: '',
    start,
    end,
  })
}
const handleDeletePlan = (index: number) => {
  model.value.plans.splice(index, 1)
}

const formatTime = (time: number, startTime: number) => {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
const useFormatTime = (startTime: number) => {
  return (time: number) => formatTime(time, startTime)
}
</script>

<template>
  <div
    class="py4 text-left rd-2 z-inset-box-shadow"
    :class="{ 'text-center': edit }"
    :style="{ backgroundColor: 'var(--my-box-bg)' }"
  >
    <TheDayItem
      v-model:left="model.wakeTime"
      v-model:content="model.wakeLabel"
      :range="[0, 24 * 60]"
      :formatter="useFormatTime(0)"
      :edit="edit"
    />
    <div
      v-if="edit && (model.plans.length === 0 || (model.plans[0].start > 0))"
      class="w-full flex justify-center"
    >
      <div
        i-carbon-add-alt
        class="icon-btn m2"
        @click="handleAddPlan(0, 0, model.plans[0]?.start || model.sleepTime)"
      />
    </div>
    <template
      v-for="(plan, index) in model.plans"
      :key="index"
    >
      <TheDayItem
        v-model:content="plan.name"
        v-model:left="plan.start"
        v-model:right="plan.end"
        :range="[model.plans[index - 1]?.end || 0, model.plans[index + 1]?.start || model.sleepTime]"
        :progress="now >= plan.start && now < plan.end ? (now - plan.start) / (plan.end - plan.start) * 100 : undefined"
        :formatter="useFormatTime(model.wakeTime)"
        :edit="edit"
        @delete="handleDeletePlan(index)"
      />
      <div
        v-if="edit && (model.plans[index + 1]?.start || model.sleepTime) - plan.end > 0"
        class="w-full flex justify-center"
      >
        <div
          i-carbon-add-alt
          class="icon-btn m2"
          @click="handleAddPlan(index + 1, plan.end, model.plans[index + 1]?.start || model.sleepTime)"
        />
      </div>
    </template>

    <TheDayItem
      v-model:left="model.sleepTime"
      v-model:content="model.sleepLabel"
      :range="[model.plans[model.plans.length - 1]?.end || model.wakeTime, 24 * 60]"
      :formatter="useFormatTime(model.wakeTime)"
      :edit="edit"
    />
  </div>
</template>

<style scoped>

</style>

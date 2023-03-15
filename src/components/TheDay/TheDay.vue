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

const { t } = useI18n()

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

const sleep = computed(() => now.value > model.value.sleepTime)
const moons = new Array(Math.floor(Math.random() * 15 + 10)).fill(0).map(() => ({
  left: Math.random() * 90 + 5,
  top: Math.random() * 90 + 5,
  rotate: Math.random() * 60 - 45,
  delay: Math.random() * 3,
}))
</script>

<template>
  <div v-if="sleep" class="z--1 fixed top-0 right-0 bottom-0 left-0">
    <div
      v-for="(moon, index) in moons"
      :key="index"
      i-the-my-day
      class="absolute text-10 text-#B7DCFF transition  breeze-animation"
      :style="{
        'left': `${moon.left}%`,
        'top': `${moon.top}%`,
        'transform': `rotate(${moon.rotate}deg)`,
        '--animation-delay': `${moon.delay}s`,
      }"
    />
  </div>
  <div v-if="sleep" class="text-xl my2">
    {{ t('my_day.sleep_time') }}
  </div>
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
.breeze-animation {
  animation: breeze 3s ease-in-out infinite var(--animation-delay, 0);
}
@keyframes breeze {
  to {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  from {
    opacity: 1;
  }
}
</style>

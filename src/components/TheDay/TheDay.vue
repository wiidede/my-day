<script lang="ts" setup>
import type { IMyDay } from '~/types/my-day'

const props = defineProps<{
  edit?: boolean
  pure?: boolean
  current?: boolean
}>()

const modelValue = defineModel<IMyDay>({ required: true })

const { t } = useI18n()

const { nowDate, isSleeping } = useTheNow()
const { width } = useTheDayWidth()

const now = computed(() => {
  const nowValue = nowDate.value.getHours() * 60
  + nowDate.value.getMinutes()
  + (nowDate.value.getSeconds() / 60)
  + (nowDate.value.getMilliseconds() / 1000 / 60)
  - modelValue.value.wakeTime
  return nowValue > 0 ? nowValue : nowValue + 24 * 60
})

const sleep = computed(() => now.value > modelValue.value.sleepTime)
watchEffect(() => {
  if (props.current)
    isSleeping.value = sleep.value
})

function handleAddPlan(index: number, start: number, end: number) {
  modelValue.value.plans.splice(index, 0, {
    name: '',
    start,
    end,
  })
}
function handleDeletePlan(index: number) {
  modelValue.value.plans.splice(index, 1)
}

function formatTime(time: number, startTime: number) {
  return dayjs.duration(time + startTime, 'minutes').format('HH:mm')
}
function useFormatTime(startTime: number) {
  return (time: number) => formatTime(time, startTime)
}
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 py1 neumorphism:pb8"
    :style="{ width: `${width}px` }"
  >
    <TheInput v-if="edit" v-model="modelValue.name" class="flex-auto min-w0 flex-0" />
    <h1 v-else v-show="!pure" class="neumorphism:min-h-6">
      {{ modelValue.name }}
    </h1>
    <div v-if="edit" v-show="!pure" class="shrink-0 flex justify-center gap-4 w-full">
      <slot name="actions" />
    </div>
    <div
      class="py4 neumorphism:py8 text-left my-round z-inset-box-shadow transition-padding w-full"
      :class="{ 'text-center': edit }"
      :style="{
        backgroundColor: 'var(--my-box-bg)',
        backdropFilter: 'var(--my-box-backdrop-filter)',
      }"
    >
      <TheDayItem
        v-model:left="modelValue.wakeTime"
        v-model:content="modelValue.wakeLabel"
        :range="[0, 24 * 60]"
        :formatter="useFormatTime(0)"
        :edit="edit"
        :pure="pure"
      />
      <div
        v-if="edit && (modelValue.plans.length === 0 || (modelValue.plans[0].start > 0))"
        class="w-full flex justify-center"
      >
        <div
          :title="t('button.add_plan')"
          class="my-icon-btn m2"
          @click="handleAddPlan(0, 0, modelValue.plans[0]?.start || modelValue.sleepTime)"
        >
          <div i-carbon-add-alt />
        </div>
      </div>
      <template
        v-for="(plan, index) in modelValue.plans"
        :key="index"
      >
        <TheDayItem
          v-model:content="plan.name"
          v-model:left="plan.start"
          v-model:right="plan.end"
          :range="[modelValue.plans[index - 1]?.end || 0, modelValue.plans[index + 1]?.start || modelValue.sleepTime]"
          :progress="now >= plan.start && now < plan.end ? (now - plan.start) / (plan.end - plan.start) * 100 : undefined"
          :formatter="useFormatTime(modelValue.wakeTime)"
          :edit="edit"
          :pure="pure"
          @delete="handleDeletePlan(index)"
        />
        <div
          v-if="edit && (modelValue.plans[index + 1]?.start || modelValue.sleepTime) - plan.end > 0"
          class="w-full flex justify-center"
        >
          <div
            :title="t('button.add_plan')"
            class="my-icon-btn m2"
            @click="handleAddPlan(index + 1, plan.end, modelValue.plans[index + 1]?.start || modelValue.sleepTime)"
          >
            <div i-carbon-add-alt />
          </div>
        </div>
      </template>
      <TheDayItem
        v-model:left="modelValue.sleepTime"
        v-model:content="modelValue.sleepLabel"
        :range="[modelValue.plans[modelValue.plans.length - 1]?.end || modelValue.wakeTime, 24 * 60]"
        :formatter="useFormatTime(modelValue.wakeTime)"
        :edit="edit"
        :pure="pure"
      />
    </div>
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

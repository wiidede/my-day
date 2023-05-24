<script lang="ts" setup>
import { isClient, promiseTimeout } from '@vueuse/core'
import type { IMyDay } from '~/types/my-day'

const { t, locale } = useI18n()

const { nowDate, isSleeping } = useTheNow()
const nowFormattedTime = useDateFormat(nowDate, () => t('my_day.time_formatter'), { locales: 'en' })
const nowFormattedDate = useDateFormat(nowDate, () => t('my_day.date_formatter'), { locales: 'en' })

const getDefaultMyDay: () => IMyDay = () => ({
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

const storeMyDay = useStorage<IMyDay[]>('my-day-list', [])
const storeMyDayLength = computed(() => storeMyDay.value.length)
const urlMyDay = useUrlStore<IMyDay[]>().data
const initializing = computed(() => (!storeMyDay.value || !storeMyDay.value.length))
const viewing = computed(() => !!urlMyDay.value)

const shareRef = ref<HTMLElement>()
const { floating, floatingRef } = useFloating(shareRef)
async function handleShare(copyOnly = false) {
  if (!copyOnly)
    urlMyDay.value = storeMyDay.value
  await promiseTimeout(10)
  await navigator.clipboard.writeText(location.href)
  // content.value = t('my_day.share_info')
  // className.value = 'my-c-success/67'
  floating.value = true
  await promiseTimeout(3000)
  floating.value = false
}

const edit = ref(false)
const toggleEdit = useToggle(edit)
function handleEdit() {
  if (initializing.value)
    storeMyDay.value = [getDefaultMyDay()]
  toggleEdit()
}

const pure = ref(false)
const togglePure = useToggle(pure)

function handleSave() {
  // eslint-disable-next-line no-alert
  if (window.confirm(t('my_day.alert_save_share'))) {
    storeMyDay.value = urlMyDay.value
    urlMyDay.value = undefined
  }
}

const { width } = useTheDayWidth()
const currentIndex = useStorage('my-day-index', 0)
const currentX = computed(() => -(currentIndex.value + (edit.value ? 1 : 0)) * (width.value + 24))

function handleAdd(index: number) {
  storeMyDay.value.splice(index, 0, getDefaultMyDay())
  currentIndex.value = index
}

const moons = new Array(Math.floor(Math.random() * 15 + 10)).fill(0).map(() => ({
  left: Math.random() * 90,
  top: Math.random() * 90,
  rotate: Math.random() * 60 - 45,
  delay: Math.random() * 3,
}))
</script>

<template>
  <div class="m-auto" :style="{ maxWidth: `${width}px` }">
    <div class="mb4 flex items-center md:items-baseline justify-between px1">
      <div class="w5" />
      <div class="flex items-baseline gap2 flex-col md:flex-row" :class="{ 'flex-col-reverse md:flex-row-reverse': locale === 'zh-CN' }">
        <span class="text-4xl">{{ nowFormattedTime }}</span>
        <span class="text-2xl">{{ nowFormattedDate }}</span>
      </div>
      <div class="flex gap2">
        <div
          v-if="!edit"
          class="my-icon-btn"
          :title="pure ? t('button.close_pure') : t('button.open_pure')"
          @click="togglePure()"
        >
          <div :class="pure ? 'i-carbon-fade' : 'i-carbon-circle-dash'" />
        </div>
        <div
          v-if="viewing"
          class="my-icon-btn"
          :title="t('button.exit_preview')"
          @click="urlMyDay = undefined"
        >
          <div i-carbon-exit />
        </div>
        <div
          v-if="!initializing"
          ref="shareRef"
          :title="t('button.share_preview')"
          class="my-icon-btn"
          @click="handleShare(viewing)"
        >
          <div i-carbon-share />
        </div>
        <div
          v-if="viewing && !edit"
          :title="t('button.save_preview')"
          class="my-icon-btn"
          @click="handleSave()"
        >
          <div i-carbon-save />
        </div>
        <Teleport v-if="floatingRef" :to="floatingRef">
          <div class="flex gap2 items-center my-c-success/67">
            <div i-carbon-checkmark-outline class="flex-shrink-0" />
            <div>{{ t('my_day.share_info') }}</div>
          </div>
        </Teleport>
        <div
          v-if="!pure"
          :title="edit ? t('button.complete') : t('button.edit')"
          class="my-icon-btn"
          @click="handleEdit()"
        >
          <div :class="edit ? 'i-carbon-checkmark' : 'i-carbon-edit'" />
        </div>
      </div>
    </div>
    <div v-if="viewing" class="text-4 my4 flex items-center justify-center gap-2 op-50">
      <div i-carbon-view />
      {{ t('my_day.viewing') }}
    </div>
    <div v-if="isClient && isSleeping" class="z--1 fixed top-0 right-0 bottom-0 left-0">
      <div
        v-for="(moon, index) in moons"
        :key="index"
        i-the-my-day
        class="absolute text-16 text-#B7DCFF transition  breeze-animation"
        :style="{
          'left': `${moon.left}%`,
          'top': `${moon.top}%`,
          'transform': `rotate(${moon.rotate}deg)`,
          '--animation-delay': `${moon.delay}s`,
        }"
      />
    </div>
    <div v-if="isSleeping" class="text-xl my2 my-c-primary">
      {{ t('my_day.sleep_time') }}
    </div>
    <div class="neumorphism:h2 transition-height" />
    <template v-if="viewing">
      <TheDay
        v-for="(day, index) in urlMyDay"
        :key="index"
        :model-value="day"
        :edit="edit"
        :pure="pure"
      />
    </template>
    <TheDay v-else-if="initializing" :model-value="getDefaultMyDay()" :pure="pure" />
    <template v-else>
      <div
        :style="{
          maskImage: 'linear-gradient(to right, transparent 0, white 10%, white 90%, transparent 100%)',
          width: `${width + 100 + 48}px`,
          transform: `translateX(${0 - 50 - 24}px)`,
        }"
        class="neumorphism:py9 transition-padding overflow-hidden"
      >
        <div
          :style="{
            width: `${(storeMyDayLength + 2) * (width + 24) - 24}px`,
            transform: `translateX(${currentX + 50 + 24}px)`,
          }"
          class="flex gap-24px transition-transform transition-duration-300"
        >
          <div
            v-if="edit"
            :title="t('button.add_plan')"
            :style="{ width: `${width}px` }"
            class="flex flex-col justify-center items-end py4 my-round z-inset-box-shadow neumorphism:py8 transition-padding cursor-pointer"
            @click="handleAdd(0)"
          >
            <div i-carbon-add-alt class="mx4" />
          </div>
          <TheDay
            v-for="(day, index) in storeMyDay"
            :key="index"
            :model-value="day"
            :edit="edit"
            :pure="pure || index !== currentIndex"
            :current="index === currentIndex"
          />
          <div
            v-if="edit"
            :title="t('button.add_plan')"
            :style="{ width: `${width}px` }"
            class="flex flex-col justify-center items-start py4 my-round z-inset-box-shadow neumorphism:py8 transition-padding cursor-pointer"
            @click="handleAdd(storeMyDayLength)"
          >
            <div i-carbon-add-alt class="mx4" />
          </div>
        </div>
      </div>
      <div class="flex justify-center gap-4">
        <div
          v-for="index in storeMyDayLength"
          :key="index"
          class="rd-full w-4 h-4 cursor-pointer bg-gray"
          :class="{ 'my-bg-primary': index - 1 === currentIndex }"
          @click="currentIndex = index - 1"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import { isClient, promiseTimeout } from '@vueuse/core'
import type { IMyDay } from '~/types/my-day'
const { t, locale } = useI18n()

const now = isClient
  ? useNow({ interval: 1000 })
  : ref(new Date(0))
const nowFormattedTime = useDateFormat(now, () => t('my_day.time_formatter'), { locales: 'en' })
const nowFormattedDate = useDateFormat(now, () => t('my_day.date_formatter'), { locales: 'en' })

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
const urlMyDay = useUrlStore<IMyDay[]>().data
const initializing = computed(() => (!storeMyDay.value || !storeMyDay.value.length))
const viewing = computed(() => !!urlMyDay.value)

const shareRef = ref<HTMLElement>()
const { floating, floatingRef } = useFloating(shareRef)
const handleShare = async (copyOnly = false) => {
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
const handleEdit = () => {
  if (initializing.value)
    storeMyDay.value = [getDefaultMyDay()]
  toggleEdit()
}
</script>

<template>
  <div class="max-w-65ch m-auto">
    <div class="mb4 flex items-center md:items-baseline justify-between px1">
      <div class="w5" />
      <div class="flex items-baseline gap2 flex-col md:flex-row" :class="{ 'flex-col-reverse md:flex-row-reverse': locale === 'zh-CN' }">
        <span class="text-4xl">{{ nowFormattedTime }}</span>
        <span class="text-2xl">{{ nowFormattedDate }}</span>
      </div>
      <div class="flex gap2">
        <div
          v-if="viewing"
          i-carbon-exit
          :title="t('button.exit_preview')"
          class="icon-btn cursor-pointer"
          @click="urlMyDay = undefined"
        />
        <div
          v-if="!initializing"
          ref="shareRef"
          i-carbon-share
          :title="t('button.share_preview')"
          class="icon-btn cursor-pointer"
          @click="handleShare(viewing)"
        />
        <Teleport v-if="floatingRef" :to="floatingRef">
          <div class="flex gap1 items-center my-c-success/67">
            <div i-carbon-checkmark-outline />
            <div>{{ t('my_day.share_info') }}</div>
          </div>
        </Teleport>
        <div
          :class="edit ? 'i-carbon-checkmark' : 'i-carbon-edit'"
          :title="edit ? t('button.complete') : t('button.edit')"
          class="icon-btn cursor-pointer"
          @click="handleEdit()"
        />
      </div>
    </div>
    <div v-if="edit && viewing" class="text-6 my-c-warning">
      {{ t('my_day.viewing_editing') }}
    </div>
    <template v-if="viewing">
      <TheDay
        v-for="(day, index) in urlMyDay"
        :key="index"
        :model-value="day"
        :edit="edit"
      />
    </template>
    <TheDay v-else-if="initializing" :model-value="getDefaultMyDay()" />
    <template v-else>
      <TheDay
        v-for="(day, index) in storeMyDay"
        :key="index"
        :model-value="day"
        :edit="edit"
      />
    </template>
  </div>
</template>

<style scoped>

</style>

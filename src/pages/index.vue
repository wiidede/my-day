<script lang="ts" setup>
import { isClient, promiseTimeout } from '@vueuse/core'
import type { IMyDay } from '~/types/my-day'

const { t, locale } = useI18n()

const { nowDate, isSleeping } = useTheNow()
const nowFormattedTime = useDateFormat(nowDate, () => t('my_day.time_formatter'), { locales: 'en' })
const nowFormattedDate = useDateFormat(nowDate, () => t('my_day.date_formatter'), { locales: 'en' })

function getDefaultMyDay() {
  const day: IMyDay = {
    wakeTime: 7 * 60,
    wakeLabel: t('my_day.wake'),
    sleepTime: 16 * 60,
    sleepLabel: t('my_day.sleep'),
    name: t('my_day.title'),
    plans: [
      { name: t('my_day.plan_1'), start: 30, end: 60 },
      { name: t('my_day.plan_2'), start: 60, end: 90 },
      { name: t('my_day.plan_3'), start: 90, end: 120 },
      { name: t('my_day.plan_4'), start: 120, end: 15 * 60 },
    ],
  }
  return day
}

const storeMyDay = useStorage<IMyDay[]>('my-day-list', [])
const urlMyDay = useUrlStore<IMyDay[]>().data
const initializing = computed(() => (!storeMyDay.value || !storeMyDay.value.length))
const viewing = computed(() => !!urlMyDay.value)

const edit = ref(false)
const toggleEdit = useToggle(edit)
function handleEdit() {
  if (initializing.value)
    storeMyDay.value = [getDefaultMyDay()]
  toggleEdit()
}

const toggleShowHeader = inject(showHeaderKey)
const pure = ref(false)
const togglePure = useToggle(pure)
watch(pure, (val) => {
  toggleShowHeader?.(!val)
})

const { width, padding } = useTheDayWidth()
const currentStoreIndex = useStorage('my-day-index', 0)
const currentUrlIndex = ref(0)
const currentIndex = computed({
  get() {
    return viewing.value ? currentUrlIndex.value : currentStoreIndex.value
  },
  set(value) {
    if (viewing.value)
      currentUrlIndex.value = value
    else
      currentStoreIndex.value = value
  },
})
const currentX = computed(() => 0 - currentIndex.value * (width.value + 24))
const lastIndex = ref(0)
const currentLength = computed(() => viewing.value ? (urlMyDay.value?.length || 0) : storeMyDay.value.length)
watchEffect(() => {
  if (currentIndex.value >= currentLength.value)
    currentIndex.value = currentLength.value - 1
  if (currentIndex.value < 0)
    currentIndex.value = 0
})
const currentTransforming = ref(false)
async function handleCurrentChange(index: number) {
  lastIndex.value = currentIndex.value
  currentIndex.value = index
  currentTransforming.value = true
  await promiseTimeout(500)
  currentTransforming.value = false
}

const shareRef = ref<HTMLElement>()
const saveRef = ref<HTMLElement>()
const dayContainerRef = ref<HTMLElement>()
const deleteRef = ref<HTMLElement[]>([])
const addingLeftRef = ref<HTMLElement>()
const addingRightRef = ref<HTMLElement>()
const floatModel = ref<'sharing' | 'shared' | 'saving' | 'saved' | 'deleting' | 'deleted' | 'addingLeft' | 'addingRight'>()
const floatRef = computed(() => {
  switch (floatModel.value) {
    case 'sharing':
    case 'shared':
      return shareRef.value
    case 'saving':
    case 'saved':
      return saveRef.value
    case 'deleting':
      return deleteRef.value[currentIndex.value]
    case 'deleted':
      return dayContainerRef.value
    case 'addingLeft':
      return addingLeftRef.value
    case 'addingRight':
      return addingRightRef.value
  }
})
const { startFloating, endFloating, floatingRef } = useFloating(floatRef)
async function handleShare() {
  floatModel.value = 'sharing'
  startFloating()
}
async function onShare(index?: number) {
  if (!viewing.value)
    urlMyDay.value = index === undefined ? storeMyDay.value : [storeMyDay.value[index]]
  else if (urlMyDay.value?.length)
    urlMyDay.value = index === undefined ? urlMyDay.value : [urlMyDay.value[index]]
  await nextTick()
  currentIndex.value = index ? 0 : currentStoreIndex.value
  await promiseTimeout(10)
  await navigator.clipboard.writeText(location.href)
  floatModel.value = 'shared'
  await startFloating(3000)
}

function handleSave() {
  floatModel.value = 'saving'
  startFloating()
}

async function onSave(index?: number) {
  const length = storeMyDay.value.length
  if (urlMyDay.value?.length) {
    const saving = index === undefined ? urlMyDay.value : [urlMyDay.value[index]]
    storeMyDay.value.splice(length, 0, ...saving)
  }
  floatModel.value = 'saved'
  if (index === undefined) {
    urlMyDay.value = undefined
    currentStoreIndex.value = length
  }
  else {
    urlMyDay.value?.splice(index, 1)
    if (!urlMyDay.value?.length) {
      urlMyDay.value = undefined
      currentStoreIndex.value = length
    }
  }
  await startFloating(3000)
}

function handleCancel() {
  floatModel.value = undefined
  endFloating()
}

const currentStore = computed({
  get() {
    return viewing.value ? urlMyDay.value : storeMyDay.value
  },
  set(value) {
    if (viewing.value)
      urlMyDay.value = value
    else
      storeMyDay.value = value
  },
})

function handleAdd(type: 'addingLeft' | 'addingRight') {
  floatModel.value = type
  startFloating()
}

function onAdd(index: number) {
  if (!currentStore.value)
    return
  currentStore.value.splice(index, 0, getDefaultMyDay())
  handleCurrentChange(index)
}

let deletingIndex = 0
function handleDelete(index: number) {
  deletingIndex = index
  floatModel.value = 'deleting'
  startFloating()
}
async function onDelete() {
  if (!currentStore.value)
    return
  currentStore.value.splice(deletingIndex, 1)
  handleCurrentChange(Math.max(deletingIndex - 1, 0))
  floatModel.value = 'deleted'
  await startFloating(3000)
}

function handleMove(index: number, step: number) {
  if (!currentStore.value)
    return
  const newIndex = index + step
  if (newIndex < 0 || newIndex >= currentLength.value)
    return
  [currentStore.value[index], currentStore.value[newIndex]] = [currentStore.value[newIndex], currentStore.value[index]]
  handleCurrentChange(newIndex)
}

const moons = Array.from({ length: Math.floor(Math.random() * 15 + 10) }).fill(0).map(() => ({
  left: Math.random() * 90,
  top: Math.random() * 90,
  rotate: Math.random() * 60 - 45,
  delay: Math.random() * 3,
}))
</script>

<template>
  <div class="m-auto w-full flex flex-col items-center md:w-768px">
    <div
      class="relative mb4 flex items-center justify-between md:items-baseline md:justify-center"
      :style="{ width: pure ? 'fit-content' : `${width}px` }"
      :class="{ 'absolute top-4 self-end mr-24px z-1 md:mr-0': pure }"
    >
      <div v-show="!pure" class="flex flex-col items-baseline gap2 md:flex-row" :class="{ 'flex-col-reverse md:flex-row-reverse': locale === 'zh-CN' }">
        <span class="text-4xl">{{ nowFormattedTime }}</span>
        <span class="text-2xl">{{ nowFormattedDate }}</span>
      </div>
      <div class="right-0 h-full flex items-center gap2 md:absolute">
        <div
          v-if="!edit && !viewing"
          class="my-icon-btn"
          :title="pure ? t('button.close_pure') : t('button.open_pure')"
          @click="togglePure()"
        >
          <div :class="pure ? 'i-carbon-fade' : 'i-carbon-circle-dash'" />
        </div>
        <div
          v-if="viewing && !pure"
          class="my-icon-btn"
          :title="t('button.exit_preview')"
          @click="urlMyDay = undefined"
        >
          <div i-carbon-exit />
        </div>
        <div
          v-if="!initializing && !edit && !pure"
          ref="shareRef"
          :title="t('button.share_preview')"
          class="my-icon-btn"
          @click="handleShare()"
        >
          <div i-carbon-share />
        </div>
        <div
          v-if="viewing && !edit && !pure"
          ref="saveRef"
          :title="t('button.save_preview')"
          class="my-icon-btn"
          @click="handleSave()"
        >
          <div i-carbon-save />
        </div>
        <Teleport v-if="floatingRef" :to="floatingRef">
          <template v-if="floatModel === 'sharing'">
            <div class="flex flex-col items-center gap2 p4">
              <div>{{ t('my_day.sharing_text') }}</div>
              <button class="w-fit btn" @click="onShare(currentIndex)">
                {{ t('button.sharing_one') }}
              </button>
              <button class="w-fit btn" @click="onShare()">
                {{ t('button.sharing_all') }}
              </button>
              <button class="w-fit btn" @click="handleCancel">
                {{ t('button.cancel') }}
              </button>
            </div>
          </template>
          <template v-else-if="floatModel === 'shared'">
            <div class="flex items-center gap2 my-c-success/67">
              <div i-carbon-checkmark-outline class="flex-shrink-0" />
              <div>{{ t('my_day.share_info') }}</div>
            </div>
          </template>
          <template v-else-if="floatModel === 'saving'">
            <div class="flex flex-col items-center gap2 p4">
              <div>{{ t('my_day.saving_text') }}</div>
              <button class="w-fit btn" @click="onSave(currentIndex)">
                {{ t('button.saving_one') }}
              </button>
              <button class="w-fit btn" @click="onSave()">
                {{ t('button.saving_all') }}
              </button>
              <button class="w-fit btn" @click="handleCancel">
                {{ t('button.cancel') }}
              </button>
            </div>
          </template>
          <template v-else-if="floatModel === 'saved'">
            <div class="flex items-center gap2 my-c-success/67">
              <div i-carbon-checkmark-outline class="flex-shrink-0" />
              <div>{{ t('my_day.save_info') }}</div>
            </div>
          </template>
          <template v-else-if="floatModel === 'deleting'">
            <div class="flex flex-col items-center gap2 p4">
              <div>{{ t('my_day.delete_day_text') }}</div>
              <button class="w-fit btn" @click="onDelete()">
                {{ t('button.delete_day') }}
              </button>
              <button class="w-fit btn" @click="handleCancel">
                {{ t('button.cancel') }}
              </button>
            </div>
          </template>
          <template v-else-if="floatModel === 'deleted'">
            <div class="flex items-center gap2 my-c-success/67">
              <div i-carbon-checkmark-outline class="flex-shrink-0" />
              <div>{{ t('my_day.delete_day_info') }}</div>
            </div>
          </template>
          <template v-else-if="floatModel === 'addingLeft' || floatModel === 'addingRight'">
            <div class="flex flex-col items-center gap2 p4">
              <div>{{ t('my_day.add_one_day') }}</div>
              <button class="w-fit btn" @click="onAdd(floatModel === 'addingLeft' ? 0 : currentLength)">
                {{ t('button.confirm') }}
              </button>
              <button class="w-fit btn" @click="handleCancel">
                {{ t('button.cancel') }}
              </button>
            </div>
          </template>
        </Teleport>
        <div
          v-if="!pure && !viewing"
          :title="edit ? t('button.complete') : t('button.edit')"
          class="my-icon-btn"
          @click="handleEdit()"
        >
          <div :class="edit ? 'i-carbon-checkmark' : 'i-carbon-edit'" />
        </div>
      </div>
    </div>
    <div v-if="viewing" v-show="!pure" class="my4 flex items-center justify-center gap-2 text-4 op-50">
      <div i-carbon-view />
      {{ t('my_day.viewing') }}
    </div>
    <div v-if="isClient && isSleeping" v-show="!pure" class="fixed bottom-0 left-0 right-0 top-0 z--1">
      <div
        v-for="(moon, index) in moons"
        :key="index"
        i-the-my-day
        class="breeze-animation absolute text-16 text-#B7DCFF transition"
        :style="{
          'left': `${moon.left}%`,
          'top': `${moon.top}%`,
          'transform': `rotate(${moon.rotate}deg)`,
          '--animation-delay': `${moon.delay}s`,
        }"
      />
    </div>
    <div v-if="isSleeping" v-show="!pure" class="my2 text-xl my-c-primary">
      {{ t('my_day.sleep_time') }}
    </div>
    <div
      v-if="initializing"
      class="w-full flex flex-col items-center p-x24px"
      :class="{ block: pure }"
    >
      <TheDay :model-value="getDefaultMyDay()" :pure="pure" />
    </div>
    <template v-else>
      <div ref="dayContainerRef" class="relative w-full">
        <div
          class="w-full overflow-hidden p-x24px"
          :class="{ 'the-days-mask': isLargeScreen && edit && !isSafari, 'the-days-mask-ios': isLargeScreen && edit && isSafari }"
        >
          <div
            :style="{
              width: `${(currentLength) * (width + 24) - 24}px`,
              transform: `translateX(${currentX + padding}px)`,
            }"
            class="flex gap-24px transition-transform transition-duration-500"
          >
            <TheDay
              v-for="(day, index) in viewing ? urlMyDay : storeMyDay"
              :key="index"
              :model-value="day"
              :edit="edit"
              :pure="pure || !(index === currentIndex || (index === lastIndex && currentTransforming))"
              :class="{
                'h-0': !(index === currentIndex || (index === lastIndex && currentTransforming)),
                'op-0': !edit && !(index === currentIndex || (index === lastIndex && currentTransforming)),
              }"
              :current="index === currentIndex"
            >
              <template #actions>
                <div
                  v-show="currentIndex === index"
                  :title="t('button.prev_day')"
                  class="my-icon-btn mr-auto"
                  :class="{ disabled: index === 0 }"
                  @click="handleCurrentChange(index - 1)"
                >
                  <div i-carbon-chevron-left />
                </div>
                <div
                  v-if="edit"
                  :title="t('button.add_day')"
                  class="my-icon-btn"
                  @click="onAdd(index)"
                >
                  <div i-carbon-add-alt />
                </div>
                <div
                  :title="t('button.move_day_left')"
                  class="my-icon-btn"
                  :class="{ disabled: index === 0 }"
                  @click="handleMove(index, -1)"
                >
                  <div i-carbon-arrow-left />
                </div>
                <div
                  ref="deleteRef"
                  :title="t('button.delete_day')"
                  class="my-icon-btn"
                  :class="{ disabled: currentLength === 1 }"
                  @click="handleDelete(index)"
                >
                  <div i-carbon-trash-can />
                </div>
                <div
                  :title="t('button.move_day_right')"
                  class="my-icon-btn"
                  :class="{ disabled: index === currentLength - 1 }"
                  @click="handleMove(index, 1)"
                >
                  <div i-carbon-arrow-right />
                </div>
                <div
                  v-if="edit"
                  :title="t('button.add_day')"
                  class="my-icon-btn"
                  @click="onAdd(index + 1)"
                >
                  <div i-carbon-add-alt />
                </div>
                <div
                  v-show="currentIndex === index"
                  :title="t('button.next_day')"
                  class="my-icon-btn ml-auto"
                  :class="{ disabled: index === currentLength - 1 }"
                  @click="handleCurrentChange(index + 1)"
                >
                  <div i-carbon-chevron-right />
                </div>
              </template>
            </TheDay>
          </div>
        </div>
        <div v-if="edit" class="absolute left-0 top-0 h-full w-50px">
          <div
            v-if="currentIndex !== 0"
            :title="t('button.prev_day')"
            class="h-full w-full flex cursor-pointer items-center justify-center op-50 hover:op-90 hover:my-bg-white"
            @click="handleCurrentChange(currentIndex - 1)"
          >
            <div class="my-icon-btn">
              <div i-carbon-chevron-left />
            </div>
          </div>
          <div
            v-else
            :title="t('button.add_day')"
            class="h-full w-full flex cursor-pointer items-center justify-center op-50 hover:op-90 hover:my-bg-white"
            @click="handleAdd('addingLeft')"
          >
            <div ref="addingLeftRef" class="my-icon-btn">
              <div i-carbon-add-alt />
            </div>
          </div>
        </div>
        <div v-if="edit" class="absolute right-0 top-0 h-full w-50px">
          <div
            v-if="currentIndex !== currentLength - 1"
            :title="t('button.next_day')"
            class="h-full w-full flex cursor-pointer items-center justify-center op-50 hover:op-90 hover:my-bg-white"
            @click="handleCurrentChange(currentIndex + 1)"
          >
            <div class="my-icon-btn">
              <div i-carbon-chevron-right />
            </div>
          </div>
          <div
            v-else
            :title="t('button.add_day')"
            class="h-full w-full flex cursor-pointer items-center justify-center op-50 hover:op-90 hover:my-bg-white"
            @click="handleAdd('addingRight')"
          >
            <div ref="addingRightRef" class="my-icon-btn">
              <div i-carbon-add-alt />
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentLength > 1" class="flex justify-center gap-4 pt2 neumorphism:pt0">
        <div
          v-for="index in currentLength"
          v-show="!pure"
          :key="index"
          class="h-4 w-4 cursor-pointer rd-full bg-gray/20"
          :class="{ 'my-bg-primary': index - 1 === currentIndex }"
          @click="handleCurrentChange(index - 1)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.the-days-mask {
  --mask: url('data:image/svg+xml,<svg width="768" height="768" viewBox="0 0 768 768" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><g clip-path="url(%23clip0_201_2)"><g filter="url(%23filter0_f_201_2)"><rect width="768" height="768" rx="58" fill="url(%23paint0_linear_201_2)"/></g></g><defs><filter id="filter0_f_201_2" x="-25" y="-25" width="818" height="818" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="12.5" result="effect1_foregroundBlur_201_2"/></filter><linearGradient id="paint0_linear_201_2" x1="768" y1="384" x2="0" y2="384" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="0.109375" stop-color="white"/><stop offset="0.880208" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><clipPath id="clip0_201_2"><rect width="768" height="768" fill="white"/></clipPath></defs></svg>');
  mask: var(--mask) no-repeat center / 100% 100%;
  -webkit-mask: var(--mask) no-repeat center / 100% 100%;
}

.the-days-mask-ios {
  --mask: linear-gradient(to right, transparent, #fff 10%, #fff 90%, transparent);
  mask: var(--mask) no-repeat center / 100% 100%;
  -webkit-mask: var(--mask) no-repeat center / 100% 100%;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

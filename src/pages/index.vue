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

const pure = ref(false)
const togglePure = useToggle(pure)

const { width } = useTheDayWidth()
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
const currentX = computed(() => -(currentIndex.value + (edit.value ? 1 : 0)) * (width.value + 24))
const lastIndex = ref(0)
const currentLength = computed(() => viewing.value ? (urlMyDay.value?.length || 0) : storeMyDay.value.length)
watchEffect(() => {
  if (currentIndex.value >= currentLength.value)
    currentIndex.value = currentLength.value - 1
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
const deleteRef = ref<HTMLElement[]>([])
const floatModel = ref<'sharing' | 'shared' | 'saving' | 'saved' | 'deleting' | 'deleted'>()
const floatRef = computed(() => {
  switch (floatModel.value) {
    case 'sharing':
    case 'shared':
      return shareRef.value
    case 'saving':
    case 'saved':
      return saveRef.value
    case 'deleting':
    case 'deleted':
      return deleteRef.value[currentIndex.value]
  }
})
const { floating, floatingRef } = useFloating(floatRef)
async function handleShare() {
  floatModel.value = 'sharing'
  floating.value = true
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
  floating.value = true
  await promiseTimeout(3000)
  handleCancel()
}

function handleSave() {
  floatModel.value = 'saving'
  floating.value = true
}

async function onSave(index?: number) {
  const length = storeMyDay.value.length
  if (urlMyDay.value?.length) {
    const saving = index === undefined ? urlMyDay.value : [urlMyDay.value[index]]
    storeMyDay.value.splice(length, 0, ...saving)
  }
  floatModel.value = 'saved'
  floating.value = true
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
  await promiseTimeout(3000)
  handleCancel()
}

function handleCancel() {
  floatModel.value = undefined
  floating.value = false
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

function handleAdd(index: number) {
  if (!currentStore.value)
    return
  currentStore.value.splice(index, 0, getDefaultMyDay())
  handleCurrentChange(index)
}

let deletingIndex = 0
function handleDelete(index: number) {
  deletingIndex = index
  floatModel.value = 'deleting'
  floating.value = true
}
async function onDelete() {
  if (!currentStore.value)
    return
  currentStore.value.splice(deletingIndex, 1)
  handleCurrentChange(Math.max(deletingIndex - 1, 0))
  floatModel.value = 'deleted'
  floating.value = true
  await promiseTimeout(3000)
  handleCancel()
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
          v-if="!initializing && !edit"
          ref="shareRef"
          :title="t('button.share_preview')"
          class="my-icon-btn"
          @click="handleShare()"
        >
          <div i-carbon-share />
        </div>
        <div
          v-if="viewing && !edit"
          ref="saveRef"
          :title="t('button.save_preview')"
          class="my-icon-btn"
          @click="handleSave()"
        >
          <div i-carbon-save />
        </div>
        <Teleport v-if="floatingRef" :to="floatingRef">
          <template v-if="floatModel === 'sharing'">
            <div class="flex flex-col gap2 items-center p4">
              <div>分享每日计划</div>
              <button class="btn w-fit" @click="onShare(currentIndex)">
                分享此条
              </button>
              <button class="btn w-fit" @click="onShare()">
                分享所有
              </button>
              <button class="btn w-fit" @click="handleCancel">
                取消
              </button>
            </div>
          </template>
          <template v-if="floatModel === 'shared'">
            <div class="flex gap2 items-center my-c-success/67">
              <div i-carbon-checkmark-outline class="flex-shrink-0" />
              <div>{{ t('my_day.share_info') }}</div>
            </div>
          </template>
          <template v-if="floatModel === 'saving'">
            <div class="flex flex-col gap2 items-center p4">
              <div>追加预览内容到本地</div>
              <button class="btn w-fit" @click="onSave(currentIndex)">
                保存此条
              </button>
              <button class="btn w-fit" @click="onSave()">
                保存所有
              </button>
              <button class="btn w-fit" @click="handleCancel">
                取消
              </button>
            </div>
          </template>
          <template v-if="floatModel === 'saved'">
            <div class="flex gap2 items-center my-c-success/67">
              <div i-carbon-checkmark-outline class="flex-shrink-0" />
              <div>保存成功</div>
            </div>
          </template>
          <template v-if="floatModel === 'deleting'">
            <div class="flex flex-col gap2 items-center p4">
              <div>确定要删除此条计划</div>
              <button class="btn w-fit" @click="onDelete()">
                删除
              </button>
              <button class="btn w-fit" @click="handleCancel">
                取消
              </button>
            </div>
          </template>
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
    <TheDay v-if="initializing" :model-value="getDefaultMyDay()" :pure="pure" />
    <template v-else>
      <div
        :style="{
          width: `${width + 100 + 48}px`,
          transform: `translateX(${0 - 50 - 24}px)`,
        }"
        class="py2 neumorphism:py9 transition-padding overflow-hidden"
        :class="{ 'the-days-mask': edit }"
      >
        <div
          :style="{
            width: `${(currentLength + 2) * (width + 24) - 24}px`,
            transform: `translateX(${currentX + 50 + 24}px)`,
          }"
          class="flex gap-24px transition-transform transition-duration-500"
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
                :title="t('button.save_preview')"
                class="my-icon-btn"
                :class="{ disabled: index === 0 }"
                @click="handleMove(index, -1)"
              >
                <div i-carbon-arrow-left />
              </div>
              <div
                ref="deleteRef"
                :title="t('button.save_preview')"
                class="my-icon-btn"
                @click="handleDelete(index)"
              >
                <div i-carbon-trash-can />
              </div>
              <div
                :title="t('button.save_preview')"
                class="my-icon-btn"
                :class="{ disabled: index === currentLength - 1 }"
                @click="handleMove(index, 1)"
              >
                <div i-carbon-arrow-right />
              </div>
            </template>
          </TheDay>
          <div
            v-if="edit"
            :title="t('button.add_plan')"
            :style="{ width: `${width}px` }"
            class="flex flex-col justify-center items-start py4 my-round z-inset-box-shadow neumorphism:py8 transition-padding cursor-pointer"
            @click="handleAdd(currentLength)"
          >
            <div i-carbon-add-alt class="mx4" />
          </div>
        </div>
      </div>
      <div v-if="currentLength > 1" class="flex justify-center gap-4 my2">
        <div
          v-for="index in currentLength"
          :key="index"
          class="rd-full w-4 h-4 cursor-pointer bg-gray/20"
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
</style>

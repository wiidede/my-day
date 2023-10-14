<script lang="ts" setup>
const { t } = useI18n()

const ranging = ref(false)
const range = useStorage('my-day-theme-color', useCssVar('--my-c-primary-hue'))
const rangeValue = computed({
  get: () => Number(range.value),
  set: (v: number) => (range.value = v.toString()),
})

const rangeRef = ref<HTMLInputElement>()
onClickOutside(rangeRef, () => {
  ranging.value = false
})
</script>

<template>
  <TheRange
    v-if="ranging"
    ref="rangeRef"
    v-model="rangeValue"
    class="the-theme-range w40"
    :min="0" :max="360" :step="1"
    size="medium"
  />
  <button v-else class="my-icon-btn" :title="t('button.toggle_color')" @click="() => (ranging = true)">
    <div i-carbon:color-palette />
  </button>
</template>

<style scoped>
.the-theme-range :deep(.m-range-track) {
  --at-apply: shadow;
  border-radius: 2px;
  background: linear-gradient(to right,
      hsl(0 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(60 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(120 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(180 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(240 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(300 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(360 var(--my-c-primary-saturation) var(--my-c-primary-lightness)));;
}
.the-theme-range :deep(.m-range-thumb) {
  border-radius: 0.5rem;
  background-color: var(--my-c-primary);
  box-shadow: 0 1px 4px 0 var(--my-c-primary), inset 0 0 1px 1px rgba(var(--my-c-black-rgb), 0.4);
  border: 0;
}
</style>

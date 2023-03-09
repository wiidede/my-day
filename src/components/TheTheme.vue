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
  <input v-if="ranging" ref="rangeRef" v-model="rangeValue" type="range" class="the-theme-range mx2 w40" :min="0" :max="360" :step="1">
  <button v-else class="icon-btn mx-2" :title="t('button.toggle_theme')" @click="() => (ranging = true)">
    <div i-carbon:color-palette />
  </button>
</template>

<style lang="scss" scoped>
@mixin my-track {
  background: var(--rainbow-gradient);
  border-radius: 2px;
  height: 0.75rem;
  --at-apply: shadow;
}

@mixin my-thumb {

  -webkit-appearance: none;
  appearance: none;

  border: none;
  outline: none;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 0.25rem;
  background-color: var(--my-c-primary);
  box-shadow: 0 0.5px 2px 0 var(--my-c-primary), inset 0 0 0.5px 0.5px rgba(var(--my-c-black-rgb), 0.4);
  transform: scale(2);
}

input.the-theme-range[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  --rainbow-gradient: linear-gradient(to right,
      hsl(0 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(60 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(120 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(180 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(240 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(300 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(360 var(--my-c-primary-saturation) var(--my-c-primary-lightness)));

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    @include my-track;
  }

  &::-webkit-slider-thumb {
    @include my-thumb;
  }

  &::-moz-range-track {
    @include my-track;
  }

  &::-moz-range-thumb {
    @include my-thumb;
  }
}
</style>

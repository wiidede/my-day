<script lang="ts" setup>
const { t } = useI18n()

const ranging = ref(false)
const range = useCssVar('--my-c-primary-hue')
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

<style scoped>
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
}

input.the-theme-range[type="range"]:focus {
  outline: none;
}

input.the-theme-range[type="range"]::-webkit-slider-runnable-track {
  background: var(--rainbow-gradient);
  border-radius: 2px;
  --at-apply: shadow;
}

input.the-theme-range[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 0.25rem;
  background-color: var(--my-c-primary);
  box-shadow: 0 0.5px 3px 0 var(--my-c-primary), inset 0 0 0.5px 0.5px rgba(var(--my-c-black-rgb), 0.6);
  transform: scale(2);
}

input.the-theme-range[type="range"]::-moz-range-track {
  background: var(--rainbow-gradient);
  border-radius: 2px;
  height: 0.75rem;
  --at-apply: shadow;
}

input.the-theme-range[type="range"]::-moz-range-thumb {
  border: none;
  outline: none;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 0.25rem;
  background-color: var(--my-c-primary);
  box-shadow: 0 0.5px 3px 0 var(--my-c-primary), inset 0 0 0.5px 0.5px rgba(var(--my-c-black-rgb), 0.6);
  transform: scale(2);
}
</style>

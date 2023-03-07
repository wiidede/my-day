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
  <input v-if="ranging" ref="rangeRef" v-model="rangeValue" type="range" class="the-theme-range" :min="0" :max="360" :step="1">
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
      hsl(30 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(60 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(90 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(120 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(150 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(180 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(210 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(240 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(270 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(300 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(330 var(--my-c-primary-saturation) var(--my-c-primary-lightness)),
      hsl(360 var(--my-c-primary-saturation) var(--my-c-primary-lightness)));
}

input.the-theme-range[type="range"]:focus {
  outline: none;
}

input.the-theme-range[type="range"]::-webkit-slider-runnable-track {
  background: var(--rainbow-gradient);
  border-radius: 4px;
  box-shadow: inset 0 1px 6px 0px #00000080;
  /* height: 0.5rem; */
}

input.the-theme-range[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ffffff;
  background-color: var(--my-c-primary);
}

input.the-theme-range[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 1px 6px 0px #ffffff;
}

input.the-theme-range[type="range"]::-moz-range-track {
  background: var(--rainbow-gradient);
  border-radius: 0.5rem;
  height: 0.5rem;
}

input.the-theme-range[type="range"]::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ffffff;
  background-color: var(--my-c-primary);
}

input.the-theme-range[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 1px 6px 0px #ffffff;
}
</style>

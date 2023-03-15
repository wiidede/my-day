<script setup lang="ts">
const { modelValue } = defineModel<{
  modelValue: string
}>()
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    type="text"
    v-bind="$attrs"
    p="x-4 y-2"
    bg="transparent"
    border="rounded none"
    outline="none active:none"
    class="my-shadow"
    :style="{ background: 'var(--my-input-bg)' }"
  >
</template>

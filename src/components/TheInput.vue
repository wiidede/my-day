<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    type="text"
    v-bind="$attrs"
    p="x-4 y-2"
    outline="none active:none"
    class="my-input my-round"
  >
</template>

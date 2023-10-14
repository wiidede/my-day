<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <h1 class="p6 text-4xl">
    {{ t('not-found') }}
  </h1>
  <div class="m8 flex items-center justify-center gap-8">
    <RouterLink class="my-icon-btn p3 text-4xl my-c-primary" to="/" :title="t('button.home')">
      <div i-the-my-day />
    </RouterLink>
    <button class="my-icon-btn my-c-primary" @click="router.back()">
      <div class="flex items-center gap-2 p2 text-2xl">
        <div i-carbon-arrow-left /><span>{{ t('button.back') }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <h1 class="text-4xl p6">
    {{ t('not-found') }}
  </h1>
  <div class="m8 flex items-center gap-8 justify-center">
    <RouterLink class="my-icon-btn my-c-primary text-4xl p3" to="/" :title="t('button.home')">
      <div i-the-my-day />
    </RouterLink>
    <button class="my-icon-btn my-c-primary" @click="router.back()">
      <div class="p2 text-2xl flex items-center gap-2">
        <div i-carbon-arrow-left /><span>{{ t('button.back') }}</span>
      </div>
    </button>
  </div>
</template>

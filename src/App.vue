<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Fly My Day',
  meta: [
    { name: 'description', content: 'A simple and delicate day planner' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#252526' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

const floatingRef = ref<HTMLElement>()
const { x, y, strategy, floating, content, className } = useFloatingRef(floatingRef)
</script>

<template>
  <RouterView />
  <Transition name="fade">
    <div
      v-show="floating"
      ref="floatingRef"
      class="floating my-shadow p2 rd"
      :class="className"
      style="background-color: var(--my-box-bg);"
      :style="{ position: strategy, top: `${y ?? 0}px`, left: `${x}px` }"
    >
      <span v-if="content" class="floating-content">{{ content }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  --at-apply: transition-opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

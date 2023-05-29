<template>
  <div class="w-100vw h-100vh overflow-hidden flex flex-col">
    <header class="px-4 text-center">
      <TheHeader />
    </header>
    <main class="flex-auto min-h0 py-4 text-center text-gray-700 dark:text-gray-200">
      <RouterView />
    </main>
  </div>
</template>

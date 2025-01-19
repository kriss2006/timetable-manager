<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex items-center justify-between p-4 shadow">
      <i
        @click="navigateTo('/')"
        class="icon-home text-2xl not-italic cursor-pointer"
        >🏠</i
      >
      <h1 class="text-xl font-semibold text-center">Timetable Manager</h1>
      <i
        @click="navigateTo('/account')"
        class="text-2xl not-italic cursor-pointer"
        >👤 {{ user ? user.name : '' }}</i
      >
    </header>
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>
    <footer class="p-4 text-sm border-t">
      <p>&copy; {{ today.getFullYear() }} Timetable Manager</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore()
const { user } = storeToRefs(store)

store.loadFromLocalStorage()

const today = new Date()
</script>

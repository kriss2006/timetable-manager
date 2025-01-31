<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex items-center justify-between p-4 shadow">
      <span class="flex justify-start gap-4 flex-1 basis-0">
        <UButton size="lg" color="green" variant="soft" to="/">Home</UButton>
        <UButton
          v-if="user && user?.type !== 'student'"
          size="lg"
          color="green"
          variant="soft"
          to="/admin/dashboard"
        >
          Dashboard
        </UButton>
      </span>
      <h1 class="text-xl font-semibold text-center flex-1">
        Timetable Manager
      </h1>
      <span class="flex justify-end flex-1 basis-0">
        <UButton
          size="lg"
          color="green"
          variant="soft"
          to="/account"
          class="justify-end"
        >
          {{ user ? `Logged in as: ${user.name}` : 'Log in' }}
        </UButton>
      </span>
    </header>
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>
    <footer class="p-4 text-sm border-t">
      <p>&copy; {{ new Date().getFullYear() }} Timetable Manager</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore()
const { user } = storeToRefs(store)

store.loadFromLocalStorage()
</script>

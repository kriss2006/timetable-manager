<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex items-center justify-between p-4 shadow">
      <span class="flex gap-4">
        <UButton size="lg" color="green" variant="soft" to="/">Home</UButton>
        <UButton
          v-if="user?.type !== 'student'"
          size="lg"
          color="green"
          variant="soft"
          to="/admin/dashboard"
        >
          Dashboard
        </UButton>
      </span>
      <h1 class="text-xl font-semibold text-center">
        Timetable Manager Administration
      </h1>
      <UButton size="lg" color="green" variant="soft" to="/account">
        {{ user ? `Logged in as: ${user.name}` : 'Log in' }}
      </UButton>
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

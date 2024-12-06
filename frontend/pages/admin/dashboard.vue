<template>
  <h1>Dashboard</h1>
  <USelectMenu
    :loading="yearsLoading"
    searchable
    v-model="selectedYearId"
    :options="years"
    placeholder="Select a year"
    value-attribute="id"
    option-attribute="name"
    class="w-48"
  />

  <div v-if="selectedYearId">
    <UButton color="blue" variant="soft" @click="navigateTo('rooms')"
      >Manage rooms
    </UButton>
    <UButton color="blue" variant="soft" @click="navigateTo('classes')"
      >Manage classes
    </UButton>
    <UButton color="blue" variant="soft" @click="navigateTo('timetable')"
      >Manage timetable
    </UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const store = useAdminStore()

const { selectedYearId, yearsLoading } = storeToRefs(store)

const years = ref<Year[]>([])

onMounted(async () => {
  years.value = await store.fetchYears()
})
</script>

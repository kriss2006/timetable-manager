<template>
  <div class="flex flex-col items-center my-2 gap-4">
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

    <div v-if="selectedYearId" class="flex flex-col items-center my-2 gap-4">
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('years')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage years
      </UButton>
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('rooms')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage rooms
      </UButton>
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('classes')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage classes
      </UButton>
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('subjects')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage subjects
      </UButton>
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('teachers')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage teachers
      </UButton>
      <UButton
        color="blue"
        variant="soft"
        @click="navigateTo('timetable')"
        :ui="{ base: 'w-36 flex justify-center' }"
        >Manage timetable
      </UButton>
    </div>
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

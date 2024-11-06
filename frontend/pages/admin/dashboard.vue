<template>
  <h1>Dashboard temp</h1>

  <select v-model="selectedYear">
    <option :value="0">Select year</option>
    <option v-for="year in years" :key="year.id" :value="year.id">
      {{ year.name }}
    </option>
  </select>
  <div v-if="selectedYear">
    <button @click="navigateTo('classes')">Manage classses</button>
    <button @click="navigateTo('teachers')">Manage teachers</button>
    <button>Manage subjects</button>
    <button>Manage rooms</button>
    <button>Manage timetables</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()
const { selectedYear } = storeToRefs(store)

const years = ref<Year[]>([])
const classes = ref<Class[]>([])

onMounted(async () => {
  const resultYears = await store.fetchYears()
  if (resultYears) {
    years.value = resultYears
  }
})

watch(selectedYear, async () => {
  const resultClasses = await store.fetchClasses()
  if (resultClasses) {
    classes.value = resultClasses
  }
})
</script>

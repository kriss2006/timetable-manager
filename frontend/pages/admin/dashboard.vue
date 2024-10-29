<template>
  <h1>Dashboard temp</h1>

  <select v-model="selectedYearTerm">
    <option :value="0">Select term</option>
    <option
      v-for="yearTerm in yearTerms"
      :key="yearTerm.id"
      :value="yearTerm.id"
    >
      {{ yearTerm.year }} {{ yearTerm.term == 1 ? 'I-ви' : 'II-ри' }} срок
    </option>
  </select>
  <div v-if="selectedYearTerm">
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
const { selectedYearTerm } = storeToRefs(store)

const yearTerms = ref<YearTerm[]>([])
const classes = ref<Class[]>([])

onMounted(async () => {
  const resultYearTerms = await store.fetchYearTerms()
  if (resultYearTerms) {
    yearTerms.value = resultYearTerms
  }
})

watch(selectedYearTerm, async () => {
  const resultClasses = await store.fetchClasses()
  if (resultClasses) {
    classes.value = resultClasses
  }
})
</script>

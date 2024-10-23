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
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()
const { selectedYearTerm, yearTerms } = storeToRefs(store)

onMounted(() => {
  store.fetchYearTerms()
})
</script>

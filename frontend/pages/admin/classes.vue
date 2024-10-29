<template>
  <h1>Manage classes</h1>

  <div>
    <UInput v-model="q" placeholder="Search" />

    <UTable
      :loading="!classes.length"
      :rows="filteredRows"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const columns = [
  {
    key: 'name',
  },
]

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return classes.value
  }

  return classes.value.filter((classs) => {
    return String(classs.name).toLowerCase().includes(q.value.toLowerCase())
  })
})

const store = useAdminStore()

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})
</script>

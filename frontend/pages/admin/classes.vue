<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <h1 class="text-2xl font-bold">Manage Classes</h1>

    <UInput v-model="q" placeholder="Search" />

    <UTable
      :loading="!classes.length"
      :rows="computedRows"
      :columns="columns"
    />

    <UPagination
      v-model="page"
      :page-count="itemsPerPage"
      :total="classes.length"
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

const page = ref(1)
const itemsPerPage = ref(8)

const computedRows = computed(() => {
  let rows = classes.value

  if (q.value) {
    rows.filter((row) => {
      return String(row.name).toLowerCase().includes(q.value.toLowerCase())
    })
  }

  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return rows.slice(start, end)
})

const store = useAdminStore()

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})
</script>

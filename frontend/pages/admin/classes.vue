<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <h1 class="text-2xl font-bold">Manage Classes</h1>

    <UInput v-model="q" placeholder="Search" />

    <UTable :loading="!classes.length" :rows="computedRows" :columns="columns">
      <template #actions-data="{ row }">
        <UButton
          color="blue"
          variant="soft"
          @click="editClass(row.id)"
          class="mx-1"
          >Edit</UButton
        >
        <UButton
          color="red"
          variant="soft"
          @click="removeClass(row.id)"
          class="mx-1"
          >Remove</UButton
        >
      </template></UTable
    >

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
  { key: 'actions' },
]

const q = ref('')

const page = ref(1)
const itemsPerPage = ref(8)

const computedRows = computed(() => {
  let rows = classes.value

  if (q.value) {
    rows = rows.filter((row) => {
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
const editClass = (row: number) => {
  console.log('Edit', row)
}

const removeClass = (row: number) => {
  console.log('Remove', row)
}
</script>

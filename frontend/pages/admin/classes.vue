<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <h1 class="text-2xl font-bold">Manage Classes</h1>

    <UInput v-model="q" placeholder="Search" />

    <UTable :loading="!classes.length" :rows="computedRows" :columns="columns">
      <template #actions-data="{ row }">
        <UButton
          color="blue"
          variant="soft"
          @click="openEditModal(row)"
          class="mx-1"
        >
          Edit
        </UButton>
        <UButton color="red" variant="soft" @click="" class="mx-1">
          Remove
        </UButton>
      </template>
    </UTable>

    <UPagination
      v-model="page"
      :page-count="itemsPerPage"
      :total="filteredRowsCount"
    />

    <UModal v-model="modalOpen">
      <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
        <h2 class="text-xl font-semibold">Edit Class</h2>
        <UInput v-model="editData.name" placeholder="Class Name" />

        <p v-if="modalError" class="text-red-500">{{ modalError }}</p>
        <div class="flex justify-end gap-2 mt-4">
          <UButton color="blue" variant="soft" @click="saveEdit">Save</UButton>
          <UButton color="red" variant="soft" @click="cancelEdit"
            >Cancel</UButton
          >
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const { modalError } = storeToRefs(store)

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})

const columns = [{ key: 'name' }, { key: 'actions' }]

const q = ref('')
const page = ref(1)
const itemsPerPage = ref(8)

const filteredRowsCount = ref(classes.value.length)
const computedRows = computed(() => {
  let rows = classes.value
  if (q.value) {
    rows = rows.filter((row) => {
      return String(row.name).toLowerCase().includes(q.value.toLowerCase())
    })
  }
  filteredRowsCount.value = rows.length
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return rows.slice(start, end)
})

const modalOpen = ref(false)

const editData = ref<{ id: number; name: string }>({
  id: -1,
  name: '',
})

const openEditModal = (row: Class) => {
  editData.value = { id: row.id, name: row.name }
  modalOpen.value = true
}

watch(
  () => editData.value.name,
  () => {
    if (modalError.value) {
      modalError.value = null
    }
  }
)

const cancelEdit = () => {
  modalOpen.value = false
  editData.value = { id: -1, name: '' }
  modalError.value = null
}

const saveEdit = async () => {
  if (editData.value.id) {
    await store.handleEdit('class', editData.value)
    classes.value = await store.fetchClasses()
    if (!modalError.value) {
      cancelEdit()
    }
  }
}
</script>

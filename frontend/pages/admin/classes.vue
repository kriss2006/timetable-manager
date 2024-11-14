<template>
  <DataTable
    title="Manage classes"
    :isLoading="tableLoading"
    :columns="columns"
    :hiddenColumns="hiddenColumns"
    :rows="classes"
    :itemsPerPage="8"
    :onAdd="openAddModal"
    :onEdit="openEditModal"
    :onRemove="openRemoveModal"
  />

  <AddModal
    :open="addModalOpen"
    :hidden-columns="hiddenColumns"
    :row="addFormData"
    :errorMessage="errorMessage"
    @update:open="addModalOpen = $event"
    @add:row="addRow($event)"
    @reset:error-message="errorMessage = ''"
  />
  <EditModal
    :open="editModalOpen"
    :hidden-columns="hiddenColumns"
    :row="editFormData"
    :errorMessage="errorMessage"
    @update:open="editModalOpen = $event"
    @edit:row="editRow($event)"
    @reset:error-message="errorMessage = ''"
  />
  <RemoveModal
    :open="removeModalOpen"
    :hidden-columns="hiddenColumns"
    :row="removeFormData"
    :errorMessage="errorMessage"
    @update:open="removeModalOpen = $event"
    @remove:row="removeRow($event)"
    @reset:error-message="errorMessage = ''"
  />
</template>

<script setup lang="ts">
import axios from 'axios'

definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const { selectedYear } = storeToRefs(store)

const classes = ref<Class[]>([])

const tableLoading = ref(true)
onMounted(async () => {
  classes.value = await store.fetchClasses()
  tableLoading.value = false
})

const columns = [{ key: 'name' }, { key: 'actions' }]
const hiddenColumns = ['id', 'yearId', 'year_id']
const errorMessage = ref('')

const addModalOpen = ref(false)
const addFormData = ref({
  name: '',
  yearId: -1,
})

const openAddModal = () => {
  addFormData.value = { name: '', yearId: selectedYear.value }
  errorMessage.value = ''
  addModalOpen.value = true
}

const addRow = (row: Class) => {
  axios
    .post(`http://localhost:3001/api/classes/${selectedYear.value}`, {
      name: row.name,
    })
    .then((response) => {
      classes.value.push({ id: response.data.id, name: row.name })
      addModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
        // console.error(error.response.data)
        // console.error(error.response.status)
        // console.error(error.response.headers)
      } else if (error.request) {
        // console.error(error.request)
      } else {
        // console.error('Error', error.message)
      }
      // console.error(error.config)
    })
}

const editModalOpen = ref(false)
const editFormData = ref({
  id: -1,
  name: '',
})

const openEditModal = (row: Class) => {
  editFormData.value = { id: row.id, name: row.name }
  errorMessage.value = ''
  editModalOpen.value = true
}

const editRow = async (row: Class) => {
  await axios
    .patch(`http://localhost:3001/api/classes/${row.id}`, {
      name: row.name,
    })
    .then(() => {
      const index = classes.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        Object.assign(classes.value[index], row)
      }
      editModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
        // console.error(error.response.data)
        // console.error(error.response.status)
        // console.error(error.response.headers)
      } else if (error.request) {
        // console.error(error.request)
      } else {
        // console.error('Error', error.message)
      }
      // console.error(error.config)
    })
}

const removeModalOpen = ref(false)
const removeFormData = ref({
  id: -1,
  name: '',
})

const openRemoveModal = (row: Class) => {
  removeFormData.value = { id: row.id, name: row.name }
  errorMessage.value = ''
  removeModalOpen.value = true
}

const removeRow = async (id: number) => {
  await axios
    .delete(`http://localhost:3001/api/classes/${id}`)
    .then(() => {
      const index = classes.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        classes.value.splice(index, 1)
      }
      removeModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
        // console.error(error.response.data)
        // console.error(error.response.status)
        // console.error(error.response.headers)
      } else if (error.request) {
        // console.error(error.request)
      } else {
        // console.error('Error', error.message)
      }
      // console.error(error.config)
    })
}
</script>

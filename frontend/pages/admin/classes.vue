<template>
  <DataTable
    title="Manage classes"
    :isLoading="studentClassesLoading"
    :columns="columns"
    :hiddenColumns="hiddenColumns"
    :rows="studentClasses"
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
  layout: 'admin',
  middleware: ['admin'],
})

const store = useAdminStore()

const { selectedYearId, studentClassesLoading } = storeToRefs(store)

const studentClasses = ref<StudentClass[]>([])

onMounted(async () => {
  studentClasses.value = await store.fetchStudentClasses()
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
  addFormData.value = { name: '', yearId: selectedYearId.value }
  errorMessage.value = ''
  addModalOpen.value = true
}

const addRow = (row: StudentClass) => {
  axios
    .post(`http://localhost:3001/api/student-classes/${selectedYearId.value}`, {
      name: row.name,
    })
    .then((response) => {
      studentClasses.value.push({ id: response.data.id, name: row.name })
      addModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
      }
    })
}

const editModalOpen = ref(false)
const editFormData = ref({
  id: -1,
  name: '',
})

const openEditModal = (row: StudentClass) => {
  editFormData.value = { id: row.id, name: row.name }
  errorMessage.value = ''
  editModalOpen.value = true
}

const editRow = async (row: StudentClass) => {
  await axios
    .patch(`http://localhost:3001/api/student-classes/${row.id}`, {
      name: row.name,
    })
    .then(() => {
      const index = studentClasses.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        Object.assign(studentClasses.value[index], row)
      }
      editModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
      }
    })
}

const removeModalOpen = ref(false)
const removeFormData = ref({
  id: -1,
  name: '',
})

const openRemoveModal = (row: StudentClass) => {
  removeFormData.value = { id: row.id, name: row.name }
  errorMessage.value = ''
  removeModalOpen.value = true
}

const removeRow = async (id: number) => {
  await axios
    .delete(`http://localhost:3001/api/student-classes/${id}`)
    .then(() => {
      const index = studentClasses.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        studentClasses.value.splice(index, 1)
      }
      removeModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
      }
    })
}
</script>

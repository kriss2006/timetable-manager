<template>
  <DataTable
    title="Manage classes"
    :isLoading="studentClassesLoading"
    :columns="columns"
    :rows="studentClasses"
    :itemsPerPage="8"
    :onAdd="openAddModal"
    :onEdit="openEditModal"
    :onRemove="openRemoveModal"
  />

  <AddModal
    :data="addModalData"
    @close="addModalData.open = false"
    @reset:error-message="addModalData.errorMessage = ''"
    @add="addRow($event)"
  />
  <EditModal
    :data="editModalData"
    @close="editModalData.open = false"
    @reset:error-message="editModalData.errorMessage = ''"
    @edit="editRow($event)"
  />
  <RemoveModal
    :data="removeModalData"
    @close="removeModalData.open = false"
    @reset:error-message="removeModalData.errorMessage = ''"
    @remove="removeRow($event)"
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

const addModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    name: '',
  },
})

const openAddModal = () => {
  addModalData.value = {
    open: true,
    errorMessage: '',
    id: NaN,
    input: { name: '' },
  }
}

const addRow = (data: ModalData) => {
  axios
    .post(`http://localhost:3001/api/student-classes/${selectedYearId.value}`, {
      name: data.input.name,
    })
    .then((response) => {
      if (typeof data.input.name === 'string') {
        studentClasses.value.push({
          id: response.data.id,
          name: data.input.name,
        })
      }

      addModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        addModalData.value.errorMessage = error.response.data.error
      }
    })
}

const editModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    name: '',
  },
})

const openEditModal = (row: Room) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { name: row.name },
  }
}

const editRow = async (data: ModalData) => {
  await axios
    .patch(`http://localhost:3001/api/student-classes/${data.id}`, {
      name: data.input.name,
    })
    .then(() => {
      const index = studentClasses.value.findIndex(
        (item) => item.id === data.id
      )
      if (index !== -1 && typeof data.input.name === 'string') {
        studentClasses.value[index] = { id: data.id, name: data.input.name }
      }

      editModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        editModalData.value.errorMessage = error.response.data.error
      }
    })
}

const removeModalData = ref<RemoveModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  name: '',
})

const openRemoveModal = (row: Room) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: row.name,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/student-classes/${data.id}`)
    .then(() => {
      const index = studentClasses.value.findIndex(
        (item) => item.id === data.id
      )
      if (index !== -1) {
        studentClasses.value.splice(index, 1)
      }

      removeModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        removeModalData.value.errorMessage = error.response.data.error
      }
    })
}
</script>

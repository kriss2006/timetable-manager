<template>
  <DataTable
    title="Manage subjects"
    :isLoading="subjectsLoading"
    :columns="columns"
    :rows="subjects"
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

const { selectedYearId, subjectsLoading } = storeToRefs(store)

const subjects = ref<Subject[]>([])

onMounted(async () => {
  subjects.value = await store.fetchSubjects()
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'abbreviation', label: 'Abbreviation' },
  { key: 'actions' },
]

const addModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    name: '',
    abbreviation: '',
  },
})

const openAddModal = () => {
  addModalData.value = {
    open: true,
    errorMessage: '',
    id: NaN,
    input: { name: '', abbreviation: '' },
  }
}

const addRow = (data: ModalData) => {
  axios
    .post(`http://localhost:3001/api/subjects/${selectedYearId.value}`, {
      name: data.input.name,
      abbreviation: data.input.abbreviation,
    })
    .then((response) => {
      if (
        typeof data.input.name === 'string' &&
        typeof data.input.abbreviation === 'string'
      ) {
        subjects.value.push({
          id: response.data.id,
          name: data.input.name,
          abbreviation: data.input.abbreviation,
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
    abbreviation: '',
  },
})

const openEditModal = (row: Subject) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { name: row.name, abbreviation: row.abbreviation ?? '' },
  }
}

const editRow = async (data: ModalData) => {
  await axios
    .patch(`http://localhost:3001/api/subjects/${data.id}`, {
      name: data.input.name,
      abbreviation: data.input.abbreviation,
    })
    .then(() => {
      const index = subjects.value.findIndex((item) => item.id === data.id)
      if (
        index !== -1 &&
        typeof data.input.name === 'string' &&
        typeof data.input.abbreviation === 'string'
      ) {
        subjects.value[index] = {
          id: data.id,
          name: data.input.name,
          abbreviation: data.input.abbreviation,
        }
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

const openRemoveModal = (row: Subject) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: row.name,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/subjects/${data.id}`)
    .then(() => {
      const index = subjects.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        subjects.value.splice(index, 1)
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

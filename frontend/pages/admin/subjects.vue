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
    @add="addRow($event)"
  />
  <EditModal
    :data="editModalData"
    @close="editModalData.open = false"
    @edit="editRow($event)"
  />
  <RemoveModal
    :data="removeModalData"
    @close="removeModalData.open = false"
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
  if (!data.input.name) {
    addModalData.value.errorMessage = 'Name is required'
    return
  }

  if ((data.input.name as string).length > 255) {
    addModalData.value.errorMessage = 'Name must be up to 255 characters'
    return
  }

  if ((data.input.abbreviation as string).length > 32) {
    addModalData.value.errorMessage = 'Abbreviation must be up to 32 characters'
    return
  }

  axios
    .post(`http://localhost:3001/api/subjects/${selectedYearId.value}`, {
      name: data.input.name,
      abbreviation: data.input.abbreviation,
    })
    .then((response) => {
      subjects.value.push({
        id: response.data.id,
        name: data.input.name as string,
        abbreviation: data.input.abbreviation as string,
      })

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
  if (!data.input.name) {
    editModalData.value.errorMessage = 'Name is required'
    return
  }

  if ((data.input.name as string).length > 255) {
    editModalData.value.errorMessage = 'Name must be up to 255 characters'
    return
  }

  if ((data.input.abbreviation as string).length > 32) {
    editModalData.value.errorMessage =
      'Abbreviation must be up to 32 characters'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/subjects/${data.id}`, {
      name: data.input.name,
      abbreviation: data.input.abbreviation,
    })
    .then(() => {
      const index = subjects.value.findIndex((item) => item.id === data.id)

      if (index !== -1) {
        subjects.value[index] = {
          id: data.id,
          name: data.input.name as string,
          abbreviation: data.input.abbreviation as string,
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

<template>
  <DataTable
    title="Manage years"
    :isLoading="yearsLoading"
    :columns="columns"
    :rows="years"
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

const { yearsLoading } = storeToRefs(store)

const years = ref<Year[]>([])

onMounted(async () => {
  years.value = await store.fetchYears()
})

const columns = [{ key: 'name', label: 'Name' }, { key: 'actions' }]

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
  if (!data.input.name) {
    addModalData.value.errorMessage = 'Name is required'
    return
  }

  if ((data.input.name as string).length !== 9) {
    addModalData.value.errorMessage = 'Name must be 9 characters'
    return
  }

  axios
    .post(`http://localhost:3001/api/years`, {
      name: data.input.name,
    })
    .then((response) => {
      years.value.push({
        id: response.data.id,
        name: data.input.name as string,
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
  },
})

const openEditModal = (row: Year) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { name: row.name },
  }
}

const editRow = async (data: ModalData) => {
  if (!data.input.name) {
    editModalData.value.errorMessage = 'Name is required'
    return
  }

  if ((data.input.name as string).length !== 9) {
    editModalData.value.errorMessage = 'Name must be 9 characters'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/years/${data.id}`, {
      name: data.input.name,
    })
    .then(() => {
      const index = years.value.findIndex((item) => item.id === data.id)

      if (index !== -1) {
        years.value[index] = { id: data.id, name: data.input.name as string }
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

const openRemoveModal = (row: Year) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: row.name,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/years/${data.id}`)
    .then(() => {
      const index = years.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        years.value.splice(index, 1)
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

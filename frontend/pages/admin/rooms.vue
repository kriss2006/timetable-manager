<template>
  <DataTable
    title="Manage rooms"
    :isLoading="roomsLoading"
    :columns="columns"
    :rows="rooms"
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

const { selectedYearId, roomsLoading } = storeToRefs(store)

const rooms = ref<Room[]>([])

onMounted(async () => {
  rooms.value = await store.fetchRooms()
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

  if ((data.input.name as string).length > 255) {
    addModalData.value.errorMessage = 'Name must be up to 255 characters'
    return
  }

  axios
    .post(`http://localhost:3001/api/rooms/${selectedYearId.value}`, {
      name: data.input.name,
    })
    .then((response) => {
      rooms.value.push({
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

const openEditModal = (row: Room) => {
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

  if ((data.input.name as string).length > 255) {
    editModalData.value.errorMessage = 'Name must be up to 255 characters'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/rooms/${data.id}`, {
      name: data.input.name,
    })
    .then(() => {
      const index = rooms.value.findIndex((item) => item.id === data.id)

      if (index !== -1) {
        rooms.value[index] = { id: data.id, name: data.input.name as string }
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
    .delete(`http://localhost:3001/api/rooms/${data.id}`)
    .then(() => {
      const index = rooms.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        rooms.value.splice(index, 1)
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

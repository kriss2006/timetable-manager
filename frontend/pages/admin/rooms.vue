<template>
  <DataTable
    title="Manage rooms"
    :isLoading="roomsLoading"
    :columns="columns"
    :hiddenColumns="hiddenColumns"
    :rows="rooms"
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

const { selectedYearId, roomsLoading } = storeToRefs(store)

const rooms = ref<Room[]>([])

onMounted(async () => {
  rooms.value = await store.fetchRooms()
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'actions' },
]
const hiddenColumns = ['id', 'yearId', 'year_id']
const errorMessage = ref('')

const addModalOpen = ref(false)
const addFormData = ref({
  name: '',
  type: '',
  yearId: -1,
})

const openAddModal = () => {
  addFormData.value = { name: '', type: '', yearId: selectedYearId.value }
  errorMessage.value = ''
  addModalOpen.value = true
}

const addRow = (row: Room) => {
  axios
    .post(`http://localhost:3001/api/rooms/${selectedYearId.value}`, {
      name: row.name,
      type: row.type,
    })
    .then((response) => {
      rooms.value.push({ id: response.data.id, name: row.name, type: row.type })
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
  type: '',
})

const openEditModal = (row: Room) => {
  editFormData.value = { id: row.id, name: row.name, type: row.type }
  errorMessage.value = ''
  editModalOpen.value = true
}

const editRow = async (row: Room) => {
  await axios
    .patch(`http://localhost:3001/api/rooms/${row.id}`, {
      name: row.name,
      type: row.type,
    })
    .then(() => {
      const index = rooms.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        Object.assign(rooms.value[index], row)
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
  type: '',
})

const openRemoveModal = (row: Room) => {
  removeFormData.value = { id: row.id, name: row.name, type: row.type }
  errorMessage.value = ''
  removeModalOpen.value = true
}

const removeRow = async (id: number) => {
  await axios
    .delete(`http://localhost:3001/api/rooms/${id}`)
    .then(() => {
      const index = rooms.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        rooms.value.splice(index, 1)
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

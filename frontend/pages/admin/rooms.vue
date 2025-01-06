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
    :open="addModalOpen"
    :hidden-columns="hiddenColumns"
    :row="addFormData"
    :errorMessage="errorMessage"
    @update:open="addModalOpen = $event"
    @add:row="addRow($event)"
    @reset:error-message="errorMessage = ''"
  />

  <EditModal
    :data="editModalData"
    @close="editModalData.open = false"
    @reset:error-message="editModalData.errorMessage = ''"
    @edit="editRow($event)"
  />
  <!--
  <RemoveModal
    :open="removeModalOpen"
    :hidden-columns="hiddenColumns"
    :row="removeFormData"
    :errorMessage="errorMessage"
    @update:open="removeModalOpen = $event"
    @remove:row="removeRow($event)"
    @reset:error-message="errorMessage = ''"
  /> -->
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

const { selectedYearId, roomsLoading } = storeToRefs(store)

const rooms = ref<Room[]>([])

onMounted(async () => {
  rooms.value = await store.fetchRooms()
})

const columns = [{ key: 'name', label: 'Name' }, { key: 'actions' }]
const hiddenColumns = []
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

const addRow = (row: Room) => {
  axios
    .post(`http://localhost:3001/api/rooms/${selectedYearId.value}`, {
      name: row.name,
    })
    .then((response) => {
      rooms.value.push({ id: response.data.id, name: row.name })
      addModalOpen.value = false
    })
    .catch((error) => {
      if (error.response) {
        errorMessage.value = error.response.data.error
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
    .patch(`http://localhost:3001/api/rooms/${data.id}`, {
      name: data.input.name,
    })
    .then(() => {
      const index = rooms.value.findIndex((item) => item.id === data.id)
      if (index !== -1 && typeof data.input.name === 'string') {
        rooms.value[index] = { id: data.id, name: data.input.name }
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

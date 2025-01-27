<template>
  <div class="flex flex-col items-center my-2 gap-4">
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

    <div class="flex gap-2 my-4">
      <UButton
        v-if="!roomsLoading"
        color="blue"
        variant="soft"
        @click="triggerFileUpload"
        >Import</UButton
      >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".xlsx, .xls"
        class="hidden"
      />
      <UButton
        v-if="!roomsLoading"
        color="blue"
        variant="soft"
        @click="exportRooms"
        >Export</UButton
      >
    </div>
  </div>

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
import * as XLSX from 'xlsx'

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

const fileInput = ref<HTMLInputElement>()

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const sheetData = XLSX.utils.sheet_to_json<TableRoom>(sheet)

    const newRooms = (sheetData as Array<TableRoom>).filter((row) => {
      const existingRoom = rooms.value.find((room) => room.name === row.Name)
      return !existingRoom
    })

    for (const room of newRooms) {
      await addRoom(room)
    }

    rooms.value = await store.fetchRooms()
  }

  reader.readAsArrayBuffer(file)
  input.value = ''
}

const addRoom = async (row: TableRoom) => {
  await axios.post(`http://localhost:3001/api/rooms/${selectedYearId.value}`, {
    name: row.Name,
  })
}

const exportRooms = () => {
  if (rooms.value.length === 0) {
    alert('No rooms available to export.')
    return
  }

  const exportData = rooms.value.map((room) => ({
    Name: room.name,
  }))

  const sheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Rooms')

  XLSX.writeFile(workbook, 'rooms.xlsx')
}
</script>

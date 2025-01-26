<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <DataTable
      title="Manage teachers"
      :isLoading="teachersLoading"
      :columns="columns"
      :rows="teachers"
      :itemsPerPage="8"
      :onAdd="openAddModal"
      :onEdit="openEditModal"
      :onRemove="openRemoveModal"
    />
    <div class="flex gap-2 my-4">
      <UButton
        v-if="!teachersLoading"
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
        v-if="!teachersLoading"
        color="blue"
        variant="soft"
        @click="exportTeachers"
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

const { teachersLoading } = storeToRefs(store)

const teachers = ref<Teacher[]>([])

onMounted(async () => {
  teachers.value = await store.fetchTeachers()
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'initials', label: 'Initials' },
  { key: 'actions' },
]

const addModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    name: '',
    initials: '',
  },
})

const openAddModal = () => {
  addModalData.value = {
    open: true,
    errorMessage: '',
    id: NaN,
    input: { name: '', initials: '' },
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

  if (!data.input.initials) {
    addModalData.value.errorMessage = 'Initials are required'
    return
  }

  if ((data.input.initials as string).length > 4) {
    addModalData.value.errorMessage = 'Initials must be up to 4 characters'
    return
  }

  axios
    .post(`http://localhost:3001/api/teachers`, {
      name: data.input.name,
      initials: data.input.initials,
    })
    .then((response) => {
      teachers.value.push({
        id: response.data.id,
        name: data.input.name as string,
        initials: data.input.initials as string,
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
    initials: '',
  },
})

const openEditModal = (row: Teacher) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { name: row.name, initials: row.initials },
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

  if (!data.input.initials) {
    editModalData.value.errorMessage = 'Initials are required'
    return
  }

  if ((data.input.initials as string).length > 4) {
    editModalData.value.errorMessage = 'Initials must be up to 4 characters'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/teachers/${data.id}`, {
      name: data.input.name,
      initials: data.input.initials,
    })
    .then(() => {
      const index = teachers.value.findIndex((item) => item.id === data.id)

      if (index !== -1) {
        teachers.value[index] = {
          id: data.id,
          name: data.input.name as string,
          initials: data.input.initials as string,
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

const openRemoveModal = (row: Teacher) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: row.name,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/teachers/${data.id}`)
    .then(() => {
      const index = teachers.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        teachers.value.splice(index, 1)
      }

      removeModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        removeModalData.value.errorMessage = error.response.data.error
      }
    })
}

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = async (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    const newTeachers = (sheetData as Array<TableTeacher>).filter((row) => {
      const existingTeacher = teachers.value.find(
        (teacher) =>
          teacher.name === row.Name && teacher.initials === row.Initials
      )
      return !existingTeacher
    })

    for (const teacher of newTeachers) {
      await addTeacher(teacher)
    }

    teachers.value = await store.fetchTeachers()
  }

  reader.readAsArrayBuffer(file)
  input.value = ''
}

const addTeacher = async (row: TableTeacher) => {
  await axios.post('http://localhost:3001/api/teachers', {
    name: row.Name,
    initials: row.Initials,
  })
}

const exportTeachers = () => {
  if (teachers.value.length === 0) {
    alert('No teachers available to export.')
    return
  }

  const exportData = teachers.value.map((teacher) => ({
    Name: teacher.name,
    Initials: teacher.initials,
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers')

  XLSX.writeFile(workbook, 'teachers.xlsx')
}
</script>

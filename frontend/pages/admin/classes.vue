<template>
  <div class="flex flex-col items-center my-2 gap-4">
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
    <div class="flex gap-2 my-4">
      <UButton
        v-if="!studentClassesLoading"
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
        v-if="!studentClassesLoading"
        color="blue"
        variant="soft"
        @click="exportClasses"
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
import * as XLSX from 'xlsx'
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
  if (!data.input.name) {
    addModalData.value.errorMessage = 'Name is required'
    return
  }

  if ((data.input.name as string).length > 5) {
    addModalData.value.errorMessage = 'Name must be up to 5 characters'
    return
  }

  axios
    .post(`http://localhost:3001/api/student-classes/${selectedYearId.value}`, {
      name: data.input.name,
    })
    .then((response) => {
      studentClasses.value.push({
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

  if ((data.input.name as string).length > 5) {
    editModalData.value.errorMessage = 'Name must be up to 5 characters'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/student-classes/${data.id}`, {
      name: data.input.name,
    })
    .then(() => {
      const index = studentClasses.value.findIndex(
        (item) => item.id === data.id
      )

      if (index !== -1) {
        studentClasses.value[index] = {
          id: data.id,
          name: data.input.name as string,
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
    const sheetData = XLSX.utils.sheet_to_json<TableStudentClass>(sheet)

    const newClasses = (sheetData as Array<TableStudentClass>).filter((row) => {
      const existingClass = studentClasses.value.find(
        (studentClass) => studentClass.name === row.Name
      )
      return !existingClass
    })

    for (const studentClass of newClasses) {
      await addClass(studentClass)
    }

    studentClasses.value = await store.fetchStudentClasses()
  }

  reader.readAsArrayBuffer(file)
  input.value = ''
}

const addClass = async (row: TableStudentClass) => {
  await axios.post(
    `http://localhost:3001/api/student-classes/${selectedYearId.value}`,
    {
      name: row.Name,
    }
  )
}

const exportClasses = () => {
  if (studentClasses.value.length === 0) {
    alert('No classes available to export.')
    return
  }

  const exportData = studentClasses.value.map((studentClass) => ({
    Name: studentClass.name,
  }))

  const sheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Classes')

  XLSX.writeFile(workbook, 'classes.xlsx')
}
</script>

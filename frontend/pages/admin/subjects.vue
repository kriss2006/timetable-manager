<template>
  <div class="flex flex-col items-center my-2 gap-4">
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
    <div class="flex gap-2 my-4">
      <UButton
        v-if="!subjectsLoading"
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
        v-if="!subjectsLoading"
        color="blue"
        variant="soft"
        @click="exportSubjects"
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
    const sheetData = XLSX.utils.sheet_to_json<TableSubject>(sheet)

    const newSubjects = (sheetData as Array<TableSubject>).filter((row) => {
      const existingSubject = subjects.value.find(
        (subject) =>
          subject.name === row.Name &&
          ((!subject.abbreviation && !row.Abbreviation) ||
            subject.abbreviation === row.Abbreviation)
      )
      return !existingSubject
    })

    for (const subject of newSubjects) {
      await addSubject(subject)
    }

    subjects.value = await store.fetchSubjects()
  }

  reader.readAsArrayBuffer(file)
  input.value = ''
}

const addSubject = async (row: TableSubject) => {
  await axios.post(
    `http://localhost:3001/api/subjects/${selectedYearId.value}`,
    {
      name: row.Name,
      abbreviation: row.Abbreviation,
    }
  )
}

const exportSubjects = () => {
  if (subjects.value.length === 0) {
    alert('No subjects available to export.')
    return
  }

  const exportData = subjects.value.map((subject) => ({
    Name: subject.name,
    Abbreviation: subject.abbreviation ?? '',
  }))

  const sheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Subjects')

  XLSX.writeFile(workbook, 'subjects.xlsx')
}
</script>

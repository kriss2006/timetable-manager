<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <h1 class="text-2xl font-bold">Manage curricula</h1>
    <USelectMenu
      :loading="studentClassesLoading"
      searchable
      v-model="selectedStudentClassId"
      :options="studentClasses"
      placeholder="Select a class"
      value-attribute="id"
      option-attribute="name"
      :ui="{ base: 'w-36' }"
    />
    <DataTable
      title=""
      :isLoading="curriculaLoading"
      :columns="columns"
      :rows="curricula"
      :itemsPerPage="8"
      :onAdd="openAddModal"
      :onEdit="openEditModal"
      :onRemove="openRemoveModal"
    />
    <UButton
      v-if="!curriculaLoading"
      color="blue"
      variant="soft"
      @click="exportCurricula"
      >Export</UButton
    >
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
const { selectedYearId, studentClassesLoading, curriculaLoading } =
  storeToRefs(store)

const studentClasses = ref<StudentClass[]>([])
const curricula = ref<Curriculum[]>([])

onMounted(async () => {
  studentClasses.value = await store.fetchStudentClasses()
})

const selectedStudentClassId = ref<number>(NaN)

watch(selectedStudentClassId, async (value) => {
  if (selectedStudentClassId) {
    curricula.value = await store.fetchCurricula(value)
  } else {
    curricula.value = []
  }
})

const columns = [
  { key: 'classesPerWeek', label: 'Classes per week' },
  { key: 'subject', label: 'Subject' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'actions' },
]

const isDuplicateCurriculum = (
  subjectId: number,
  teacherId: number,
  excludeId?: number
) => {
  return curricula.value.some(
    (curriculum) =>
      curriculum.subject.id === subjectId &&
      curriculum.teacher.id === teacherId &&
      curriculum.id !== excludeId
  )
}

const addModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    classesPerWeek: 1,
  },
  select: {
    subject: { id: NaN, name: 'Select a subject' },
    teacher: { id: NaN, name: 'Select a teacher', initials: '' },
  },
})

const openAddModal = () => {
  addModalData.value = {
    open: true,
    errorMessage: '',
    id: NaN,
    input: { classesPerWeek: 1 },
    select: {
      subject: { id: NaN, name: 'Select a subject' },
      teacher: { id: NaN, name: 'Select a teacher', initials: '' },
    },
  }
}

const addRow = (data: ModalData) => {
  if ((data.input.classesPerWeek as number) < 1) {
    addModalData.value.errorMessage = 'Classes per week must be at least 1'
    return
  }

  if (!data.select?.subject?.id || !data.select?.teacher?.id) {
    addModalData.value.errorMessage =
      'Please select both a subject and a teacher'
    return
  }

  if (isDuplicateCurriculum(data.select.subject.id, data.select.teacher.id)) {
    addModalData.value.errorMessage =
      'This subject-teacher combination already exists'
    return
  }

  axios
    .post(
      `http://localhost:3001/api/curricula/${selectedYearId.value}/${selectedStudentClassId.value}`,
      {
        classesPerWeek: data.input.classesPerWeek,
        subjectId: data.select.subject.id,
        teacherId: data.select.teacher.id,
      }
    )
    .then((response) => {
      if (data.select?.subject && data.select?.teacher) {
        curricula.value.push({
          id: response.data.id,
          classesPerWeek: data.input.classesPerWeek as number,
          teacher: data.select?.teacher,
          subject: data.select?.subject,
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
    classesPerWeek: 1,
  },
  select: {
    subject: { id: NaN, name: 'Select a subject' },
    teacher: { id: NaN, name: 'Select a teacher', initials: '' },
  },
})

const openEditModal = (row: Curriculum) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { classesPerWeek: row.classesPerWeek },
    select: {
      subject: row.subject,
      teacher: row.teacher,
    },
  }
}

const editRow = async (data: ModalData) => {
  if ((data.input.classesPerWeek as number) < 1) {
    editModalData.value.errorMessage = 'Classes per week must be at least 1'
    return
  }

  if (!data.select?.subject?.id || !data.select?.teacher?.id) {
    editModalData.value.errorMessage =
      'Please select both a subject and a teacher'
    return
  }

  if (
    isDuplicateCurriculum(
      data.select.subject.id,
      data.select.teacher.id,
      data.id
    )
  ) {
    editModalData.value.errorMessage =
      'This subject-teacher combination already exists'
    return
  }

  await axios
    .patch(`http://localhost:3001/api/curricula/${data.id}`, {
      classesPerWeek: data.input.classesPerWeek,
      subjectId: data.select.subject.id,
      teacherId: data.select.teacher.id,
    })
    .then(() => {
      const index = curricula.value.findIndex((item) => item.id === data.id)

      if (index !== -1 && data.select?.subject && data.select?.teacher) {
        curricula.value[index] = {
          id: data.id,
          classesPerWeek: data.input.classesPerWeek as number,
          subject: data.select?.subject,
          teacher: data.select?.teacher,
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

const openRemoveModal = (row: Curriculum) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: `${row.subject.name} - ${row.teacher.name}`,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/curricula/${data.id}`)
    .then(() => {
      const index = curricula.value.findIndex((item) => item.id === data.id)

      if (index !== -1) {
        curricula.value.splice(index, 1)
      }

      removeModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        removeModalData.value.errorMessage = error.response.data.error
      }
    })
}

const exportCurricula = () => {
  if (curricula.value.length === 0) {
    alert('No curricula available to export.')
    return
  }

  const exportData = curricula.value.map((curriculum) => ({
    ClassesPerWeek: curriculum.classesPerWeek,
    Subject: curriculum.subject.name,
    Teacher: curriculum.teacher.name,
  }))

  const sheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Curricula')

  XLSX.writeFile(workbook, 'curricula.xlsx')
}
</script>

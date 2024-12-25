<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <USelectMenu
      v-model="selectedTerm"
      :options="[
        { value: 1, label: '1' },
        { value: 2, label: '2' },
      ]"
      placeholder="Select a term"
      :ui="{ base: 'w-36' }"
    />

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
    <div class="flex w-full justify-center gap-10">
      <aside class="w-1/4">
        <draggable
          :list="timetableElements.available"
          item-key="id"
          :group="{ name: 'timetable', pull: 'clone', put: false }"
          :clone="cloneAvailableElement"
        >
          <template #item="{ element }">
            <AvailableTimetableElement :key="element.id" :element="element" />
          </template>
        </draggable>
      </aside>
      <UTable
        :loading="timetableElementsLoading"
        :columns="columns"
        :rows="rows"
        :ui="{
          wrapper: 'w-3/4',
          th: { base: 'text-center w-1/5' },
          tr: { base: 'flex flex-row' },
          td: { base: 'flex flex-col w-1/5' },
        }"
      >
        <template #monday-data="{ column, row }">
          <draggable
            :list="row[column.key]"
            item-key="id"
            group="timetable"
            @change="onColumnUpdate"
          >
            <template #item="{ element }">
              <TimetableElement
                :key="element.id"
                :element="element"
                :onEdit="openEditModal"
                :onRemove="openRemoveModal"
              />
            </template>
          </draggable>
        </template>
        <template #tuesday-data="{ column, row }">
          <draggable
            :list="row[column.key]"
            item-key="id"
            group="timetable"
            @change="onColumnUpdate"
          >
            <template #item="{ element }">
              <TimetableElement
                :key="element.id"
                :element="element"
                :onEdit="openEditModal"
                :onRemove="openRemoveModal"
              />
            </template>
          </draggable>
        </template>
        <template #wednesday-data="{ column, row }">
          <draggable
            :list="row[column.key]"
            item-key="id"
            group="timetable"
            @change="onColumnUpdate"
          >
            <template #item="{ element }">
              <TimetableElement
                :key="element.id"
                :element="element"
                :onEdit="openEditModal"
                :onRemove="openRemoveModal"
              />
            </template>
          </draggable>
        </template>
        <template #thursday-data="{ column, row }">
          <draggable
            :list="row[column.key]"
            item-key="id"
            group="timetable"
            @change="onColumnUpdate"
          >
            <template #item="{ element }">
              <TimetableElement
                :key="element.id"
                :element="element"
                :onEdit="openEditModal"
                :onRemove="openRemoveModal"
              />
            </template>
          </draggable>
        </template>
        <template #friday-data="{ column, row }">
          <draggable
            :list="row[column.key]"
            item-key="id"
            group="timetable"
            @change="onColumnUpdate"
          >
            <template #item="{ element }">
              <TimetableElement
                :key="element.id"
                :element="element"
                :onEdit="openEditModal"
                :onRemove="openRemoveModal"
              />
            </template>
          </draggable>
        </template>
      </UTable>
    </div>
  </div>
  <EditModal
    :data="editModal"
    @close="editModal.open = false"
    @reset:error-message="editModal.errorMessage = ''"
    @edit="editElement($event)"
  />
  <!-- <RemoveModal
    :open="removeModalOpen"
    :hidden-columns="hiddenColumns"
    :row="removeFormData"
    :errorMessage="errorMessage"
    @update:open="removeModalOpen = $event"
    @remove:row="removeRow($event)"
    @reset:error-message="errorMessage = ''"
  /> -->
</template>

<script setup lang="ts">
// import axios from 'axios'
import draggable from 'vuedraggable'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const selectedTerm = ref<{ value: 1; label: '1' } | { value: 2; label: '2' }>()
const store = useAdminStore()
const { selectedYearId, studentClassesLoading, timetableElementsLoading } =
  storeToRefs(store)

const studentClasses = ref<StudentClass[]>([])

onMounted(async () => {
  studentClasses.value = await store.fetchStudentClasses()
})

const selectedStudentClassId = ref<number>()

const timetableElements = ref<{
  monday: TimetableElement[]
  tuesday: TimetableElement[]
  wednesday: TimetableElement[]
  thursday: TimetableElement[]
  friday: TimetableElement[]
  available: AvailableTimetableElement[]
}>({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  available: [],
})

watchEffect(async () => {
  if (selectedTerm.value && selectedStudentClassId.value) {
    timetableElements.value.monday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Monday'
    )

    timetableElements.value.tuesday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Tuesday'
    )

    timetableElements.value.wednesday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Wednesday'
    )

    timetableElements.value.thursday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Thursday'
    )

    timetableElements.value.friday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Friday'
    )

    timetableElements.value.available =
      await store.fetchAvailableTimetableElements(selectedStudentClassId.value)
  }
})
const columns = [
  {
    key: 'monday',
    label: 'Monday',
  },
  {
    key: 'tuesday',
    label: 'Tuesday',
  },
  {
    key: 'wednesday',
    label: 'Wednesday',
  },
  {
    key: 'thursday',
    label: 'Thursday',
  },
  {
    key: 'friday',
    label: 'Friday',
  },
]

const rows = ref([timetableElements.value])

function cloneAvailableElement(
  element: AvailableTimetableElement
): TimetableElement | void {
  if (element.classesPerWeek <= 0) {
    return
  }

  const targetElement = timetableElements.value.available.find(
    (e) => e.id === element.id
  )

  if (!targetElement) {
    return
  }

  targetElement.classesPerWeek--

  const allIds = [
    0,
    ...timetableElements.value.monday.map((e) => e.id),
    ...timetableElements.value.tuesday.map((e) => e.id),
    ...timetableElements.value.wednesday.map((e) => e.id),
    ...timetableElements.value.thursday.map((e) => e.id),
    ...timetableElements.value.friday.map((e) => e.id),
  ]

  const maxId = Math.max(...allIds)

  return {
    id: maxId + 1,
    period: NaN,
    startTime: timeStringToDate('00:00'),
    endTime: timeStringToDate('00:00'),
    alternating: false,
    split: false,
    studentClassSubjectTeacher: {
      id: element.id,
      subject: element.subject,
      teacher: element.teacher,
    },
    room: { id: NaN, name: 'No room selected' },
  }
}

function onColumnUpdate() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

  days.forEach((day) => {
    timetableElements.value[day].forEach((element, index) => {
      element.period = index + 1
    })
  })
}
// const addElement = (day: string) => {
//   axios
//     .post(
//       `http://localhost:3001/api/timetable-elements/${selectedYearId.value}/${selectedTerm.value?.value}/${selectedStudentClassId.value}/${day}`,
//       {
//         period: 1,
//         startTime: '1970-01-01T00:00:00.000Z',
//         endTime: '1970-01-01T00:01:00.000Z',
//         alternating: false,
//         split: false,
//         yearId: 1,
//         subjectTeacherId: 1,
//         roomId: 1,
//       }
//     )
//     .then((response) => {
//       // timetableElements.value[day.toLowerCase()].push({
//       timetableElements.value.monday.push({
//         id: response.data.id,
//         period: 1,
//         startTime: new Date('1970-01-01T00:00:00.000Z'),
//         endTime: new Date('1970-01-01T00:01:00.000Z'),
//         alternating: false,
//         split: false,
//         studentClassSubjectTeacher: {
//           subject: { id: 1, name: 'temp1' },
//           teacher: { id: 1, name: 'temp2', initials: 't2' },
//         },
//         room: { id: 1, name: 'temp3' },
//       })
//     })
// }

const editModal = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    startTime: timeStringToDate('00:00'),
    endTime: timeStringToDate('00:00'),
  },
  select: { room: { id: NaN, name: 'No room selected' } },
})

const openEditModal = (element: TimetableElement) => {
  editModal.value = {
    open: true,
    errorMessage: '',
    id: element.id,
    input: { startTime: element.startTime, endTime: element.endTime },
    select: { room: element.room },
  }
}

const editElement = async (data: ModalData) => {
  try {
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ] as const

    for (const day of days) {
      const elementToEdit = timetableElements.value[day].find(
        (e) => e.id === data.id
      )
      if (elementToEdit) {
        if (data.input.startTime instanceof Date) {
          elementToEdit.startTime = data.input.startTime
        }

        if (data.input.endTime instanceof Date) {
          elementToEdit.endTime = data.input.endTime
        }

        break
      }
    }

    editModal.value.open = false
  } catch (error) {
    editModal.value.errorMessage = 'Failed to update the timetable element.'
  }
}

// const removeModalOpen = ref(false)
// const removeFormData = ref({
//   id: -1,
//   name: '',
// })

const openRemoveModal = (element: TimetableElement) => {
  //     removeFormData.value = { id: row.id, name: row.name }
  //   errorMessage.value = ''
  //      removeModalOpen.value = true
}

// const removeRow = async (id: number) => {
//   await axios
//     .delete(`http://localhost:3001/api/student-classes/${id}`)
//     .then(() => {
//       const index = studentClasses.value.findIndex((item) => item.id === id)
//       if (index !== -1) {
//         studentClasses.value.splice(index, 1)
//       }
//       removeModalOpen.value = false
//     })
//     .catch((error) => {
//       if (error.response) {
//         errorMessage.value = error.response.data.error
//       }
//     })
// }
</script>

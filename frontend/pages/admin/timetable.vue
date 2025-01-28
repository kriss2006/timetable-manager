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
    <div class="flex gap-2 my-4">
      <UButton
        size="lg"
        color="blue"
        variant="soft"
        @click="save"
        :disabled="!okToSave"
      >
        Save changes
      </UButton>
      <UButton
        size="lg"
        color="red"
        variant="soft"
        @click="updateTimetable()"
        :disabled="!(selectedTerm && selectedStudentClassId)"
      >
        Revert changes
      </UButton>
    </div>
    <div class="flex w-full justify-center gap-10">
      <aside class="w-1/4">
        <draggable
          :list="timetable.available"
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
                :admin="true"
                :warnings="warnings"
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
                :admin="true"
                :warnings="warnings"
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
                :admin="true"
                :warnings="warnings"
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
                :admin="true"
                :warnings="warnings"
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
                :admin="true"
                :warnings="warnings"
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
    :data="editModalData"
    @close="editModalData.open = false"
    @edit="editElement($event)"
  />
  <RemoveModal
    :data="removeModalData"
    @close="removeModalData.open = false"
    @remove="removeElement($event)"
  />
</template>

<script setup lang="ts">
import axios from 'axios'
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

const timetable = ref<Timetable>({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  available: [],
})

const fetchTimetable = async (): Promise<Timetable> => {
  let fetchedTimetable: Timetable = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    available: [],
  }
  if (selectedTerm.value && selectedStudentClassId.value) {
    fetchedTimetable.monday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Monday'
    )

    fetchedTimetable.tuesday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Tuesday'
    )

    fetchedTimetable.wednesday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Wednesday'
    )

    fetchedTimetable.thursday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Thursday'
    )

    fetchedTimetable.friday = await store.fetchTimetableElements(
      selectedTerm.value.value,
      selectedStudentClassId.value,
      'Friday'
    )

    fetchedTimetable.available = await store.fetchCurricula(
      selectedStudentClassId.value
    )
  }

  return fetchedTimetable
}

const updateTimetable = async () => {
  timetable.value = await fetchTimetable()
  warnings.value = []
}

watchEffect(() => {
  updateTimetable()
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

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

const rows = computed(() => [timetable.value])

function cloneAvailableElement(element: Curriculum): TimetableElement | void {
  if (element.classesPerWeek <= 0) {
    return
  }

  const targetElement = timetable.value.available.find(
    (e) => e.id === element.id
  )

  if (!targetElement) {
    return
  }

  targetElement.classesPerWeek--

  const allIds = [
    0,
    ...timetable.value.monday.map((e) => e.id),
    ...timetable.value.tuesday.map((e) => e.id),
    ...timetable.value.wednesday.map((e) => e.id),
    ...timetable.value.thursday.map((e) => e.id),
    ...timetable.value.friday.map((e) => e.id),
  ]

  const maxId = Math.max(...allIds)

  return {
    id: maxId + 1,
    day: 'Monday',
    period: NaN,
    startTime: timeStringToDate('00:00'),
    endTime: timeStringToDate('00:00'),
    curriculum: {
      id: element.id,
      subject: element.subject,
      teacher: element.teacher,
    },
    room: { id: NaN, name: 'No room selected' },
  }
}

function onColumnUpdate() {
  days.forEach((day) => {
    const capitalisedDay = (day.charAt(0).toUpperCase() +
      day.slice(1)) as TimetableElement['day']

    timetable.value[day].forEach((element, index) => {
      element.day = capitalisedDay
      element.period = index + 1
    })
  })
}

const editModalData = ref<ModalData>({
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
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: element.id,
    input: { startTime: element.startTime, endTime: element.endTime },
    select: { room: element.room },
  }
}

const editElement = async (data: ModalData) => {
  try {
    for (const day of days) {
      const index = timetable.value[day].findIndex((e) => e.id === data.id)
      if (
        index !== -1 &&
        data.input.startTime instanceof Date &&
        data.input.endTime instanceof Date &&
        data.select?.room
      ) {
        timetable.value[day].splice(index, 1, {
          ...timetable.value[day][index],
          startTime: data.input.startTime,
          endTime: data.input.endTime,
          room: data.select.room,
        })
        break
      }
    }

    editModalData.value.open = false
  } catch (error) {
    editModalData.value.errorMessage = 'Failed to update the timetable element.'
  }
}

const removeModalData = ref<RemoveModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  name: '',
})

const openRemoveModal = (element: TimetableElement) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: element.id,
    name: element.curriculum.subject.name,
  }
}

const removeElement = async (data: RemoveModalData) => {
  try {
    for (const day of days) {
      const index = timetable.value[day].findIndex((e) => e.id === data.id)
      if (index !== -1) {
        const availableElementId = timetable.value[day][index].curriculum.id
        const availableElement = timetable.value.available.find(
          (e) => e.id === availableElementId
        )
        if (availableElement) {
          availableElement.classesPerWeek++
        }

        timetable.value[day].splice(index, 1)
        break
      }
    }

    removeModalData.value.open = false
  } catch (error) {
    removeModalData.value.errorMessage =
      'Failed to remove the timetable element.'
  }
}

const isTeacherFree = async (element: TimetableElement) => {
  let result = false
  await axios
    .get(
      `http://localhost:3001/api/teacher-free/${element.curriculum.teacher.id}/${element.day}/${element.startTime.toISOString()}/${element.endTime.toISOString()}/${selectedStudentClassId.value}`
    )
    .then(() => {
      result = true
    })
    .catch(() => {
      result = false
    })

  return result
}

const isRoomFree = async (element: TimetableElement) => {
  await axios
    .get(
      `http://localhost:3001/api/room-free/${element.room.id}/${element.day}/${element.startTime.toISOString()}/${element.endTime.toISOString()}/${selectedStudentClassId.value}`
    )
    .then((response) => {
      return true
    })
    .catch(() => {
      return false
    })

  return false
}
const warnings = ref<{ id: number; message: string }[]>([])

const okToSave = async () => {
  if (!(selectedTerm.value?.value && selectedStudentClassId.value)) {
    return false
  }

  warnings.value = []

  for (const day of days) {
    for (let i = 0; i < timetable.value[day].length; i++) {
      const element = timetable.value[day][i]
      const prevElement = i > 0 ? timetable.value[day][i - 1] : null

      if (element.startTime >= element.endTime) {
        warnings.value.push({
          id: element.id,
          message: 'Start time must be before end time.',
        })
        continue
      }

      if (prevElement && element.startTime < prevElement.endTime) {
        warnings.value.push({
          id: element.id,
          message: 'Start time must be after previous element end time.',
        })
        continue
      }

      if (isNaN(element.room.id)) {
        warnings.value.push({
          id: element.id,
          message: 'A room must be selected',
        })
        continue
      }

      if (!(await isTeacherFree(element))) {
        warnings.value.push({
          id: element.id,
          message: 'Teacher is with another class at this time.',
        })
        continue
      }

      if (!isRoomFree(element)) {
        warnings.value.push({
          id: element.id,
          message: 'Another class is in this room at this time.',
        })
        continue
      }
    }
  }

  if (warnings.value.length) {
    return false
  }

  return true
}

const save = async () => {
  if (!(await okToSave())) {
    return
  }

  const initialTimetable = await fetchTimetable()

  const diff = compareTimetables(initialTimetable, timetable.value)

  diff.added.forEach(async (element) => {
    await axios
      .post(
        `http://localhost:3001/api/timetable-elements/${selectedYearId.value}/${selectedTerm.value?.value}/${selectedStudentClassId.value}`,
        { element }
      )
      .then((response) => {
        const lowercaseDay =
          element.day.toLowerCase() as keyof typeof timetable.value

        const index = timetable.value[lowercaseDay].findIndex(
          (e) => e.id === element.id
        )
        if (index !== -1 && response.data.id !== null) {
          timetable.value[lowercaseDay][index].id = response.data.id
        }
      })
  })

  diff.modified.forEach(async (element) => {
    await axios.patch(
      `http://localhost:3001/api/timetable-elements/${element.id}`,
      {
        element,
      }
    )
  })

  diff.deleted.forEach(async (element) => {
    await axios.delete(
      `http://localhost:3001/api/timetable-elements/${element.id}`
    )
  })

  diff.availableModified.forEach(async (element) => {
    await axios.patch(`http://localhost:3001/api/curricula/${element.id}`, {
      classesPerWeek: element.classesPerWeek,
      subjectId: element.subject.id,
      teacherId: element.teacher.id,
    })
  })
}
</script>

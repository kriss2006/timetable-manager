<template>
  <div class="grid gap-4 grid-cols-4 mx-auto my-3 w-1/2">
    <div
      v-for="studentClass in studentClasses"
      :key="studentClass.id"
      class="flex items-center justify-center border-none rounded-3xl w-36 h-36 bg-green-400 cursor-pointer"
      @click="openModal(studentClass.id)"
    >
      {{ studentClass.name }}
    </div>

    <UModal
      v-model="modalData.open"
      :ui="{
        base: 'p-4 w-max mx-auto flex flex-col gap-4',
        width: 'sm:max-w-full',
      }"
    >
      <UTable
        :loading="timetableElementsLoading"
        :columns="columns"
        :rows="rows"
        :ui="{
          th: { base: 'text-center w-1/5' },
          tr: { base: 'flex flex-row' },
          td: { base: 'flex flex-col w-1/5' },
        }"
      >
        <template #monday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :element="element"
              :admin="false"
              :onEdit="openEditModal"
              :onRemove="openRemoveModal"
            />
          </span>
          <span v-else />
        </template>
        <template #tuesday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :element="element"
              :admin="false"
              :onEdit="openEditModal"
              :onRemove="openRemoveModal"
            />
          </span>
          <span v-else />
        </template>
        <template #wednesday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :element="element"
              :admin="false"
              :onEdit="openEditModal"
              :onRemove="openRemoveModal"
            />
          </span>
          <span v-else />
        </template>
        <template #thursday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :element="element"
              :admin="false"
              :onEdit="openEditModal"
              :onRemove="openRemoveModal"
            />
          </span>
          <span v-else />
        </template>
        <template #friday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :element="element"
              :admin="false"
              :onEdit="openEditModal"
              :onRemove="openRemoveModal"
            />
          </span>
          <span v-else />
        </template>
      </UTable>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="red" variant="soft" @click="modalData.open = false"
          >Close</UButton
        >
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore()

const { timetableElementsLoading } = storeToRefs(store)

const getCurrentYear = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  if (currentMonth < 9) {
    return encodeURIComponent(`${currentYear - 1}/${currentYear}`)
  } else {
    return encodeURIComponent(`${currentYear}/${currentYear + 1}`)
  }
}

const getCurrentTerm = () => {
  const currentMonth = new Date().getMonth() + 1

  if (currentMonth >= 9 || currentMonth <= 1) {
    return 1
  } else {
    return 2
  }
}

const studentClasses = ref<StudentClass[]>([])

onMounted(async () => {
  studentClasses.value = await store.fetchStudentClasses(getCurrentYear())
})

const modalData = ref({ open: false, studentClassId: 1 })

const openModal = (studentClassId: number) => {
  modalData.value = {
    open: true,
    studentClassId,
  }
}

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

  if (getCurrentTerm() && modalData.value.studentClassId) {
    fetchedTimetable.monday = await store.fetchTimetableElements(
      getCurrentTerm(),
      modalData.value.studentClassId,
      'Monday',
      getCurrentYear()
    )

    fetchedTimetable.tuesday = await store.fetchTimetableElements(
      getCurrentTerm(),
      modalData.value.studentClassId,
      'Tuesday',
      getCurrentYear()
    )

    fetchedTimetable.wednesday = await store.fetchTimetableElements(
      getCurrentTerm(),
      modalData.value.studentClassId,
      'Wednesday',
      getCurrentYear()
    )

    fetchedTimetable.thursday = await store.fetchTimetableElements(
      getCurrentTerm(),
      modalData.value.studentClassId,
      'Thursday',
      getCurrentYear()
    )

    fetchedTimetable.friday = await store.fetchTimetableElements(
      getCurrentTerm(),
      modalData.value.studentClassId,
      'Friday',
      getCurrentYear()
    )
  }

  return fetchedTimetable
}

const updateTimetable = async () => {
  timetable.value = await fetchTimetable()
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

const rows = computed(() => [timetable.value])

const openEditModal = () => {}
const openRemoveModal = () => {}
</script>

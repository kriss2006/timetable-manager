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

    <UTable
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
        <div v-for="period in row[column.key]" :key="period.id">
          <TimetableElement :timetable-element="period" />
        </div>
      </template>
      <template #tuesday-data="{ column, row }">
        <div v-for="period in row[column.key]" :key="period.id">
          <!-- <TimetableElement
            :period="period.number"
            :start="period.start"
            :end="period.end"
            :name="period.subject"
            :teacher="period.teacher"
            :room="period.room"
          /> -->
        </div>
      </template>
      <template #wednesday-data="{ column, row }">
        <div v-for="period in row[column.key]" :key="period.id">
          <!-- <TimetableElement
            :period="period.number"
            :start="period.start"
            :end="period.end"
            :name="period.subject"
            :teacher="period.teacher"
            :room="period.room"
          /> -->
        </div>
      </template>
      <template #thursday-data="{ column, row }">
        <div v-for="period in row[column.key]" :key="period.id">
          <!-- <TimetableElement
            :period="period.number"
            :start="period.start"
            :end="period.end"
            :name="period.subject"
            :teacher="period.teacher"
            :room="period.room"
          /> -->
        </div>
      </template>
      <template #friday-data="{ column, row }">
        <div v-for="period in row[column.key]" :key="period.id">
          <!-- <TimetableElement
            :period="period.number"
            :start="period.start"
            :end="period.end"
            :name="period.subject"
            :teacher="period.teacher"
            :room="period.room"
          /> -->
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import TimetableElement from '@/components/TimetableElement.vue'

definePageMeta({
  middleware: ['admin'],
})

const selectedTerm = ref<1 | 2>()
const store = useAdminStore()
const { studentClassesLoading, timetableElementsLoading } = storeToRefs(store)

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
}>({ monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] })

watchEffect(async () => {
  console.log('zele')
  timetableElements.value.monday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Monday'
  )
  rows.value[0].monday = timetableElements.value.monday
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

const rows = ref([
  {
    monday: timetableElements.value.monday,
    tuesday: [
      {
        id: 1,
        number: 1,
        start: '08:00',
        end: '08:40',
        subject: 'Chemistry',
        teacher: 'Alice Brown',
        room: '103',
      },
      {
        id: 2,
        number: 2,
        start: '08:50',
        end: '09:30',
        subject: 'Biology',
        teacher: 'Mark Lee',
        room: '104',
      },
      {
        id: 2,
        number: 2,
        start: '08:50',
        end: '09:30',
        subject: 'Biology',
        teacher: 'Mark Lee',
        room: '104',
      },
      {
        id: 2,
        number: 2,
        start: '08:50',
        end: '09:30',
        subject: 'Biology',
        teacher: 'Mark Lee',
        room: '104',
      },
    ],
    wednesday: [
      {
        id: 3,
        period: 1,
        start: '05:10',
        end: '05:20',
        subject: 'something',
        teacher: 'da',
        room: 'ne',
      },
    ],
    thursday: [
      {
        id: 3,
        period: 1,
        start: '05:10',
        end: '05:20',
        subject: 'something',
        teacher: 'da',
        room: 'ne',
      },
    ],
    friday: [
      {
        id: 3,
        period: 1,
        start: '05:10',
        end: '05:20',
        subject: 'something',
        teacher: 'da',
        room: 'ne',
      },
    ],
  },
])
</script>

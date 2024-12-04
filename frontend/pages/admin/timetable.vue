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
        <span v-if="row[column.key].length">
          <span v-for="period in row[column.key]" :key="period.id">
            <TimetableElement :timetable-element="period" />
          </span>
        </span>
        <span v-else />
      </template>
      <template #tuesday-data="{ column, row }">
        <span v-if="row[column.key].length">
          <span v-for="period in row[column.key]" :key="period.id">
            <TimetableElement :timetable-element="period" />
          </span>
        </span>
        <span v-else />
      </template>
      <template #wednesday-data="{ column, row }">
        <span v-if="row[column.key].length">
          <span v-for="period in row[column.key]" :key="period.id">
            <TimetableElement :timetable-element="period" />
          </span>
        </span>
        <span v-else />
      </template>
      <template #thursday-data="{ column, row }">
        <span v-if="row[column.key].length">
          <span v-for="period in row[column.key]" :key="period.id">
            <TimetableElement :timetable-element="period" />
          </span>
        </span>
        <span v-else />
      </template>
      <template #friday-data="{ column, row }">
        <span v-if="row[column.key].length">
          <span v-for="period in row[column.key]" :key="period.id">
            <TimetableElement :timetable-element="period" />
          </span>
        </span>
        <span v-else />
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
  timetableElements.value.monday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Monday'
  )

  timetableElements.value.tuesday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Tuesday'
  )

  timetableElements.value.wednesday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Wednesday'
  )

  timetableElements.value.thursday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Thursday'
  )

  timetableElements.value.friday = await store.fetchTimetableElements(
    selectedTerm.value,
    selectedStudentClassId.value,
    'Friday'
  )
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
</script>

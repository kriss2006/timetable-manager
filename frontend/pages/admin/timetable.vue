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
            v-if="row[column.key].length"
            :list="row[column.key]"
            item-key="id"
            group="timetable"
          >
            <template #item="{ element }">
              <TimetableElement
                :timetable-element="element"
                :key="element.id"
              />
            </template>
            <!-- <AddElement @on:click="addElement('Monday')" /> -->
          </draggable>
          <span v-else />
        </template>
        <template #tuesday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :timetable-element="element"
            />
            <!-- <AddElement @on:click="addElement('Tuesday')" /> -->
          </span>
          <span v-else />
        </template>
        <template #wednesday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :timetable-element="element"
            />
            <!-- <AddElement @on:click="addElement('Wednesday')" /> -->
          </span>
          <span v-else />
        </template>
        <template #thursday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :timetable-element="element"
            />
            <!-- <AddElement @on:click="addElement('Thursday')" /> -->
          </span>
          <span v-else />
        </template>
        <template #friday-data="{ column, row }">
          <span v-if="row[column.key].length">
            <TimetableElement
              v-for="element in row[column.key]"
              :key="element.id"
              :timetable-element="element"
            />
            <!-- <AddElement @on:click="addElement('Friday')" /> -->
          </span>
          <span v-else />
        </template>
      </UTable>

      <aside class="w-1/4">
        <AvailableTimetableElement
          v-for="element in timetableElements.available"
          :key="element.id"
          :element="element"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios'
import draggable from 'vuedraggable'
const list = ref(['neshto', 'oshte neshto', 'treto neshto'])
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
</script>

<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <USelectMenu
      v-model="selectedTerm"
      :options="[
        { value: 1, label: '1' },
        { value: 2, label: '2' },
      ]"
      placeholder="Select a term"
      class="w-36"
    />

    <USelectMenu
      :loading="classesLoading"
      searchable
      v-model="selectedClassId"
      :options="classes"
      placeholder="Select a class"
      value-attribute="id"
      option-attribute="name"
      class="w-36"
    />

    <UTable :columns="columns"> </UTable>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const selectedTerm = ref<1 | 2>()
const store = useAdminStore()

const { classesLoading } = storeToRefs(store)

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})

const selectedClassId = ref<number>()

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
</script>

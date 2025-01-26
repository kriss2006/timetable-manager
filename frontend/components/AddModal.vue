<template>
  <UModal :modelValue="data.open" @update:modelValue="emit('close')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Add</h2>
      <UInput
        v-for="(_value, key) in parsedInput"
        :key="key"
        v-model="parsedInput[key]"
        :type="typeOfInput(key)"
        :min="typeOfInput(key) === 'number' ? 1 : undefined"
        :placeholder="`Enter ${key}`"
        :ui="{ base: 'w-full' }"
      />
      <div
        v-if="formData.select"
        class="p-0 w-full max-w-md mx-auto flex flex-col gap-4"
      >
        <USelectMenu
          v-if="'room' in formData.select"
          :loading="roomsLoading"
          searchable
          v-model="formData.select.room"
          :options="rooms"
          placeholder="Select a room"
          option-attribute="name"
        />
        <USelectMenu
          v-if="'subject' in formData.select"
          :loading="subjectsLoading"
          searchable
          v-model="formData.select.subject"
          :options="subjects"
          placeholder="Select a subject"
          option-attribute="name"
        />
        <USelectMenu
          v-if="'teacher' in formData.select"
          :loading="teachersLoading"
          searchable
          v-model="formData.select.teacher"
          :options="teachers"
          placeholder="Select a teacher"
          option-attribute="name"
        />
      </div>
      <p v-if="data.errorMessage" class="text-red-500">
        {{ data.errorMessage }}
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="blue" variant="soft" @click="save">Add</UButton>
        <UButton color="red" variant="soft" @click="cancel">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: ModalData
}>()

const emit = defineEmits(['close', 'add'])

const store = useAdminStore()
const { roomsLoading, subjectsLoading, teachersLoading } = storeToRefs(store)

const rooms = ref<Room[]>([])
const subjects = ref<Subject[]>([])
const teachers = ref<Teacher[]>([])

onMounted(async () => {
  if (props.data.select) {
    if ('room' in props.data.select) {
      rooms.value = await store.fetchRooms()
    }

    if ('subject' in props.data.select) {
      subjects.value = await store.fetchSubjects()
    }

    if ('teacher' in props.data.select) {
      teachers.value = await store.fetchTeachers()
    }
  }
})

const typeOfInput = (key: string) => {
  if (typeof props.data.input[key] === 'number') {
    return 'number'
  } else if (props.data.input[key] instanceof Date) {
    return 'time'
  } else {
    return 'text'
  }
}

const parsedInput = computed(() => {
  const copy: Record<string, number | string> = {}
  for (const key in props.data.input) {
    const value = props.data.input[key]
    copy[key] = value instanceof Date ? dateToTimeString(value) : value
  }
  return copy
})

const formData = ref({ ...props.data })

watch(
  () => props.data,
  (newData) => {
    formData.value = { ...newData }
    formData.value.input = { ...parsedInput.value }
  },
  { immediate: true, deep: true }
)

const save = () => {
  const updatedData = { ...formData.value }
  for (const key in parsedInput.value) {
    updatedData.input[key] =
      typeOfInput(key) === 'time'
        ? timeStringToDate(parsedInput.value[key] as string)
        : parsedInput.value[key]
  }
  emit('add', updatedData)
}

const cancel = () => {
  emit('close')
}
</script>

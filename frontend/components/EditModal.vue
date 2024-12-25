<template>
  <UModal :modelValue="data.open" @update:modelValue="emit('close')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Edit</h2>
      <template v-for="(_value, key) in parsedInput" :key="String(key)">
        <UInput
          v-model="parsedInput[String(key)]"
          :type="isDateField(String(key)) ? 'time' : 'text'"
          :placeholder="`Enter ${String(key)}`"
        />
      </template>
      <div v-if="formData.select.room">
        <USelectMenu
          :loading="roomsLoading"
          searchable
          v-model="formData.select.room"
          :options="rooms"
          placeholder="Select a room"
          option-attribute="name"
        />
      </div>
      <p v-if="data.errorMessage" class="text-red-500">
        {{ data.errorMessage }}
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="blue" variant="soft" @click="save">Save</UButton>
        <UButton color="red" variant="soft" @click="cancel">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: ModalData
}>()

const emit = defineEmits(['close', 'reset:error-message', 'edit'])

const store = useAdminStore()
const { roomsLoading } = storeToRefs(store)

const rooms = ref<Room[]>([])

onMounted(async () => {
  if ('room' in props.data.select) {
    rooms.value = await store.fetchRooms()
  }
})

const isDateField = (key: string) => props.data.input[key] instanceof Date

const parsedInput = computed(() => {
  const copy: Record<string, number | string | boolean> = {}
  for (const key in props.data.input) {
    const value = props.data.input[key]
    copy[key] = value instanceof Date ? dateToTimeString(value) : value
  }
  return copy
})

const formData = ref({ ...props.data })
formData.value.input = { ...parsedInput.value }

watch(
  () => props.data,
  (newData) => {
    formData.value = { ...newData }
    formData.value.input = { ...parsedInput.value }
  },
  { immediate: true, deep: true }
)

watch(formData, () => emit('reset:error-message'), { deep: true })

const save = () => {
  const updatedData = { ...formData.value }
  for (const key in parsedInput.value) {
    updatedData.input[key] = isDateField(key)
      ? timeStringToDate(parsedInput.value[key] as string)
      : parsedInput.value[key]
  }
  emit('edit', updatedData)
}

const cancel = () => {
  emit('close', false)
}
</script>

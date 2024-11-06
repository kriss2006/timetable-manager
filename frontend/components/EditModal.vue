<template>
  <UModal :modelValue="open" @update:modelValue="emit('update:open')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <UInput v-model="formData.name" placeholder="Class Name" />

      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="blue" variant="soft" @click="saveEdit">Save</UButton>
        <UButton color="red" variant="soft" @click="cancelEdit">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import axios from 'axios'

const props = defineProps<{
  type: string
  title: string
  open: boolean
  initialData: Class
}>()

const emit = defineEmits(['update:open', 'edit:row'])
const formData = ref({ ...props.initialData })

watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData }
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) formData.value = { ...props.initialData }
  }
)

const errorMessage = ref('')

watch(
  () => formData.value.name,
  () => (errorMessage.value = '')
)

const handleEdit = async () => {
  console.info('Type: ', props.type, 'Row: ', formData.value)
  switch (props.type) {
    case 'year':
      console.log('Edit year', formData.value)
      break

    case 'class':
      await axios
        .patch(`http://localhost:3001/api/classes/${formData.value.id}`, {
          name: formData.value.name,
        })
        .catch((error) => {
          if (error.response) {
            errorMessage.value = error.response.data.error
            // console.error(error.response.data)
            // console.error(error.response.status)
            // console.error(error.response.headers)
          } else if (error.request) {
            // console.error(error.request)
          } else {
            // console.error('Error', error.message)
          }
          // console.error(error.config)
        })
      break

    case 'teacher':
      console.log('Edit teacher', formData.value)
      break

    default:
      return
  }
}

const saveEdit = async () => {
  if (formData.value.id) {
    await handleEdit()
    if (!errorMessage.value) {
      emit('edit:row', formData.value)
      emit('update:open', false)
    }
  }
}

const cancelEdit = () => {
  errorMessage.value = ''
  emit('update:open', false)
}
</script>
